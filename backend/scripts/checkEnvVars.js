#!/usr/bin/env node

/**
 * Script to check for hardcoded values and validate environment variables
 * Run this before deployment to ensure all sensitive data uses env vars
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Patterns to check for hardcoded values
const PATTERNS = {
  credentials: {
    regex: /(password|secret|key|token)\s*[:=]\s*['"][^'"]+['"]/gi,
    severity: 'ERROR',
    message: 'Possible hardcoded credential found'
  },
  urls: {
    regex: /https?:\/\/(?!localhost)[^\s'"`,)]+/gi,
    severity: 'WARNING',
    message: 'Hardcoded URL found (verify if it should be an env var)'
  },
  awsKeys: {
    regex: /AKIA[0-9A-Z]{16}/g,
    severity: 'ERROR',
    message: 'AWS Access Key ID found in code'
  },
  mongoUri: {
    regex: /mongodb(\+srv)?:\/\/[^\s'"`,)]+/gi,
    severity: 'ERROR',
    message: 'MongoDB URI found in code'
  }
};

const IGNORE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /coverage/,
  /\.env/,
  /\.test\./,
  /\.spec\./,
  /seeds\//,
  /migrations\//,
  /checkEnvVars\.js/
];

function shouldIgnoreFile(filePath) {
  return IGNORE_PATTERNS.some(pattern => pattern.test(filePath));
}

function scanFile(filePath) {
  if (shouldIgnoreFile(filePath)) return [];
  
  const content = readFileSync(filePath, 'utf-8');
  const issues = [];

  for (const [name, pattern] of Object.entries(PATTERNS)) {
    const matches = content.matchAll(pattern.regex);
    for (const match of matches) {
      // Skip if it's a comment or in a string template
      const lineStart = content.lastIndexOf('\n', match.index);
      const line = content.substring(lineStart, content.indexOf('\n', match.index));
      
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
        continue;
      }

      issues.push({
        file: filePath,
        line: content.substring(0, match.index).split('\n').length,
        type: name,
        severity: pattern.severity,
        message: pattern.message,
        match: match[0].substring(0, 50) + (match[0].length > 50 ? '...' : '')
      });
    }
  }

  return issues;
}

function scanDirectory(dir, issues = []) {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      if (!shouldIgnoreFile(filePath)) {
        scanDirectory(filePath, issues);
      }
    } else if (stat.isFile() && ['.js', '.ts', '.jsx', '.tsx'].includes(extname(file))) {
      issues.push(...scanFile(filePath));
    }
  }

  return issues;
}

// Main execution
console.log('🔍 Scanning for hardcoded values...\n');

const srcDir = join(__dirname, '..', 'src');
const issues = scanDirectory(srcDir);

const errors = issues.filter(i => i.severity === 'ERROR');
const warnings = issues.filter(i => i.severity === 'WARNING');

if (errors.length > 0) {
  console.log('❌ ERRORS FOUND:\n');
  errors.forEach(issue => {
    console.log(`  ${issue.file}:${issue.line}`);
    console.log(`  ${issue.message}`);
    console.log(`  Found: ${issue.match}\n`);
  });
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach(issue => {
    console.log(`  ${issue.file}:${issue.line}`);
    console.log(`  ${issue.message}`);
    console.log(`  Found: ${issue.match}\n`);
  });
}

if (issues.length === 0) {
  console.log('✅ No hardcoded values found!\n');
  process.exit(0);
} else {
  console.log(`\nSummary: ${errors.length} errors, ${warnings.length} warnings`);
  
  if (errors.length > 0) {
    console.log('\n❌ Fix errors before deploying to production!');
    process.exit(1);
  } else {
    console.log('\n⚠️  Review warnings before deploying.');
    process.exit(0);
  }
}
