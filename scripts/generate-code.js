#!/usr/bin/env node

/**
 * Call Azure OpenAI GPT-4o to generate code based on issue requirements
 * Uses the Azure OpenAI REST API
 */

const https   = require('https');
const fs      = require('fs');
const path    = require('path');

const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const API_KEY = process.env.AZURE_OPENAI_KEY;
const DEPLOYMENT = process.env.GPT4O_DEPLOYMENT || 'gpt4o-code-gen';

async function callAzureOpenAI(messages) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=2024-08-01-preview`);

    const requestBody = JSON.stringify({
      messages: messages,
      max_tokens: 4000,
      temperature: 0.7,
      top_p: 0.9,
      stop: null,
    });

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(`Azure OpenAI Error: ${response.error.message}`));
          } else {
            resolve(response);
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

async function generateCode() {
  try {
    console.log('🚀 Starting Code Generation with Azure OpenAI...');

    // Load issue context from previous step
    const contextPath = path.join(__dirname, '../.issue-context.json');
    let issueContext = {};
    
    if (fs.existsSync(contextPath)) {
      issueContext = JSON.parse(fs.readFileSync(contextPath, 'utf-8'));
    }

    const issueTitle = process.env.ISSUE_TITLE || '';
    const issueBody = process.env.ISSUE_BODY || '';

    console.log(`📝 Issue: ${issueTitle}`);

    // Prepare the prompt for Azure OpenAI
    const systemPrompt = `You are an expert code generation AI assistant. Your task is to:
1. Analyze GitHub issues and requirements
2. Generate production-ready code based on the requirements
3. Follow best practices and coding conventions
4. Include appropriate comments and documentation
5. Provide code in JSON format with file structure

IMPORTANT: Respond ONLY with valid JSON in this format:
{
  "files": [
    {
      "path": "path/to/file.extension",
      "content": "file content here"
    }
  ],
  "summary": "Brief summary of changes",
  "notes": "Any important implementation notes"
}`;

    const userPrompt = `Please analyze the following GitHub issue and generate the necessary code:

**Issue Title:** ${issueTitle}

**Issue Description:**
${issueBody}

**Context:**
- Issue Type: ${issueContext.type || 'unknown'}
- Tech Stack: ${issueContext.techStack?.join(', ') || 'generic'}
- Acceptance Criteria: ${issueContext.acceptanceCriteria?.join('; ') || 'none specified'}

Generate production-ready code that addresses this issue. Include all necessary files.`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ];

    console.log('🔄 Calling Azure OpenAI GPT-4o...');
    const response = await callAzureOpenAI(messages);

    const generatedContent = response.choices[0].message.content;
    console.log('✅ Code generation completed');

    // Parse the JSON response
    let codeData;
    try {
      codeData = JSON.parse(generatedContent);
    } catch (parseError) {
      // Try to extract JSON from the response
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        codeData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse code generation response as JSON');
      }
    }

    // Save generated code for next step
    const outputPath = path.join(__dirname, '../.generated-code.json');
    fs.writeFileSync(outputPath, JSON.stringify(codeData, null, 2));

    console.log('\n📦 Generated Files:');
    codeData.files?.forEach((file) => {
      console.log(`  - ${file.path}`);
    });

    console.log(`\n📝 Summary: ${codeData.summary || 'Code generated successfully'}`);
    if (codeData.notes) {
      console.log(`📌 Notes: ${codeData.notes}`);
    }

    // Output for GitHub Actions
    console.log('\n::set-output name=generated_code::' + JSON.stringify(codeData).replace(/"/g, '\\"'));
    console.log('::set-output name=files_list::' + JSON.stringify(codeData.files || []).replace(/"/g, '\\"'));

    process.exit(0);
  } catch (error) {
    console.error('❌ Code generation failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run code generation
generateCode();
