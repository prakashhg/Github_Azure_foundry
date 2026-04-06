#!/usr/bin/env node

/**
 * Extract and parse GitHub issue details
 * Analyzes the issue title and body to understand what needs to be done
 */

const fs = require('fs');
const path = require('path');

function extractIssueDetails() {
  const issueTitle = process.env.ISSUE_TITLE || '';
  const issueBody = process.env.ISSUE_BODY || '';
  const issueNumber = process.env.ISSUE_NUMBER || '';

  console.log('📋 Extracting Issue Details...');
  console.log(`Issue #${issueNumber}: ${issueTitle}`);
  console.log('---');

  // Parse issue content
  const details = {
    number: issueNumber,
    title: issueTitle,
    body: issueBody,
    type: detectIssueType(issueTitle, issueBody),
    labels: extractLabels(issueBody),
    acceptanceCriteria: extractAcceptanceCriteria(issueBody),
    dependencies: extractDependencies(issueBody),
    techStack: detectTechStack(issueBody),
  };

  console.log('\n✅ Issue Details Extracted:');
  console.log(JSON.stringify(details, null, 2));

  // Save to file for next step
  fs.writeFileSync(
    path.join(__dirname, '../.issue-context.json'),
    JSON.stringify(details, null, 2)
  );

  return details;
}

function detectIssueType(title, body) {
  const lowerTitle = (title + ' ' + body).toLowerCase();

  if (lowerTitle.includes('bug') || lowerTitle.includes('fix')) return 'bug-fix';
  if (lowerTitle.includes('feature') || lowerTitle.includes('add')) return 'feature';
  if (lowerTitle.includes('refactor')) return 'refactor';
  if (lowerTitle.includes('docs') || lowerTitle.includes('documentation')) return 'documentation';
  if (lowerTitle.includes('test')) return 'test';

  return 'task';
}

function extractLabels(body) {
  const labelRegex = /(?:^|\n)(?:labels?|tags?):\s*(.+?)(?:\n|$)/i;
  const match = body.match(labelRegex);
  return match ? match[1].split(',').map(l => l.trim()) : [];
}

function extractAcceptanceCriteria(body) {
  const criteriaRegex = /(?:^|\n)(?:acceptance\s+criteria|requirements):\s*([\s\S]*?)(?=\n\n|$)/i;
  const match = body.match(criteriaRegex);
  
  if (!match) return [];

  return match[1]
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .map(line => line.replace(/^[-*]\s*/, '').trim())
    .filter(line => line.length > 0);
}

function extractDependencies(body) {
  const depRegex = /(?:^|\n)(?:dependencies?|depends on):\s*(.+?)(?:\n|$)/i;
  const match = body.match(depRegex);
  return match ? match[1].split(',').map(d => d.trim()) : [];
}

function detectTechStack(body) {
  const techs = [];
  const keywords = {
    'javascript': ['js', 'javascript', 'node', 'nodejs', 'npm'],
    'typescript': ['typescript', 'ts'],
    'python': ['python', 'py'],
    'rust': ['rust', 'cargo'],
    'go': ['golang', 'go'],
    'java': ['java', 'spring'],
    'csharp': ['csharp', 'c#', 'dotnet'],
    'terraform': ['terraform', 'tf', 'iac', 'infrastructure'],
    'react': ['react', 'jsx'],
    'vue': ['vue', 'vuejs'],
    'express': ['express', 'expressjs'],
    'fastapi': ['fastapi', 'fast api'],
    'docker': ['docker', 'container'],
  };

  const lowerBody = body.toLowerCase();
  
  for (const [tech, keys] of Object.entries(keywords)) {
    if (keys.some(key => lowerBody.includes(key))) {
      techs.push(tech);
    }
  }

  return techs;
}

// Run extraction
try {
  const details = extractIssueDetails();
  process.exit(0);
} catch (error) {
  console.error('❌ Error extracting issue details:', error);
  process.exit(1);
}
