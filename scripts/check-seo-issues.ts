#!/usr/bin/env node
/**
 * SEO Issues Checker
 * Checks all pages for common SEO issues:
 * - Duplicate H1 tags
 * - Meta description length
 * - Missing meta tags
 */

import * as fs from 'fs';
import * as path from 'path';

interface SEOIssue {
  file: string;
  issue: string;
  severity: 'error' | 'warning';
  line?: number;
}

const issues: SEOIssue[] = [];
const pagesDir = path.join(__dirname, '../client/src/pages');

// Check meta description length (Bing: 120-160, Google: up to 160 recommended)
function checkDescriptionLength(description: string, file: string, line?: number): void {
  const length = description.length;
  if (length < 120) {
    issues.push({
      file,
      issue: `Meta description too short: ${length} characters (minimum 120 recommended)`,
      severity: 'warning',
      line
    });
  } else if (length > 160) {
    issues.push({
      file,
      issue: `Meta description too long: ${length} characters (Bing recommends 120-160, Google up to 160)`,
      severity: 'error',
      line
    });
  }
}

// Check for H1 tags
function checkH1Tags(content: string, file: string): void {
  const h1Matches = content.match(/<h1[^>]*>/gi) || [];
  if (h1Matches.length > 1) {
    issues.push({
      file,
      issue: `Multiple H1 tags found: ${h1Matches.length} instances (should be only 1)`,
      severity: 'error'
    });
  } else if (h1Matches.length === 0) {
    // Check if it's a page that should have H1
    if (!file.includes('NotFound') && !file.includes('not-found')) {
      issues.push({
        file,
        issue: 'No H1 tag found (pages should have exactly one H1)',
        severity: 'warning'
      });
    }
  }
}

// Read and check a file
function checkFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Check H1 tags
  checkH1Tags(content, relativePath);
  
  // Check meta descriptions
  const descriptionMatches = content.match(/description=["']([^"']+)["']/gi) || [];
  descriptionMatches.forEach(match => {
    const desc = match.replace(/description=["']/, '').replace(/["']$/, '');
    if (desc.length > 0 && !desc.includes('${') && !desc.includes('{')) {
      checkDescriptionLength(desc, relativePath);
    }
  });
  
  // Check for SEOMetaTags usage
  if (content.includes('SEOMetaTags') && !content.includes('description=')) {
    issues.push({
      file: relativePath,
      issue: 'SEOMetaTags used but no description prop found',
      severity: 'warning'
    });
  }
}

// Recursively find all .tsx files
function findTsxFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
      files.push(...findTsxFiles(fullPath));
    } else if (item.endsWith('.tsx') && !item.includes('.test.') && !item.includes('.spec.')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main check
console.log('🔍 Checking all pages for SEO issues...\n');

const pageFiles = findTsxFiles(pagesDir);

pageFiles.forEach(file => {
  try {
    checkFile(file);
  } catch (error) {
    console.error(`Error checking ${file}:`, error);
  }
});

// Report results
console.log(`\n📊 SEO Issues Report\n`);
console.log(`Checked ${pageFiles.length} files\n`);

if (issues.length === 0) {
  console.log('✅ No SEO issues found!');
} else {
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  
  console.log(`❌ Errors: ${errors.length}`);
  console.log(`⚠️  Warnings: ${warnings.length}\n`);
  
  if (errors.length > 0) {
    console.log('❌ ERRORS:\n');
    errors.forEach(issue => {
      console.log(`  ${issue.file}`);
      console.log(`    ${issue.issue}`);
      if (issue.line) console.log(`    Line: ${issue.line}`);
      console.log('');
    });
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    warnings.forEach(issue => {
      console.log(`  ${issue.file}`);
      console.log(`    ${issue.issue}`);
      if (issue.line) console.log(`    Line: ${issue.line}`);
      console.log('');
    });
  }
}

process.exit(issues.filter(i => i.severity === 'error').length > 0 ? 1 : 0);
