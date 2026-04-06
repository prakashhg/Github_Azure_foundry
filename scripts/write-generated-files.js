#!/usr/bin/env node

/**
 * Write generated code files to the repository
 * Takes the JSON output from Azure OpenAI and creates actual files
 */

const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeGeneratedFiles() {
  try {
    console.log('📝 Writing Generated Files to Repository...');

    // Load the generated code from previous step
    const generatedCodePath = path.join(__dirname, '../.generated-code.json');
    
    if (!fs.existsSync(generatedCodePath)) {
      console.log('⚠️  No generated code found. Skipping file writing.');
      process.exit(0);
    }

    const codeData = JSON.parse(fs.readFileSync(generatedCodePath, 'utf-8'));

    if (!codeData.files || codeData.files.length === 0) {
      console.log('⚠️  No files to write in generated code.');
      process.exit(0);
    }

    const repoRoot = path.join(__dirname, '..');
    let filesWritten = 0;

    // Write each file
    codeData.files.forEach((file) => {
      try {
        const filePath = path.join(repoRoot, file.path);
        
        // Prevent writing outside repo
        if (!path.resolve(filePath).startsWith(path.resolve(repoRoot))) {
          console.warn(`⚠️  Skipping file ${file.path} (outside repo root)`);
          return;
        }

        console.log(`📄 Writing: ${file.path}`);
        
        // Ensure directory exists
        ensureDirectoryExists(filePath);
        
        // Write file
        fs.writeFileSync(filePath, file.content, 'utf-8');
        filesWritten++;

        console.log(`   ✅ Success (${Buffer.byteLength(file.content)} bytes)`);
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
      }
    });

    console.log(`\n✅ Successfully wrote ${filesWritten} file(s)`);

    // Clean up temporary files
    fs.unlinkSync(generatedCodePath);
    if (fs.existsSync(path.join(__dirname, '../.issue-context.json'))) {
      fs.unlinkSync(path.join(__dirname, '../.issue-context.json'));
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error writing generated files:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run file writing
writeGeneratedFiles();
