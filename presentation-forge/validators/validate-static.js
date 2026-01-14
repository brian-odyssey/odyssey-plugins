#!/usr/bin/env node
/**
 * validate-static.js - P1 Fix M4: Static Markdown Validation
 *
 * Validates Slidev markdown without requiring a running server.
 * Enables validation in CI/CD pipelines.
 *
 * Usage:
 *   node validate-static.js --file ./slides.md
 */

const fs = require('fs');

// Parse arguments
const args = process.argv.slice(2);
const fileIndex = args.indexOf('--file');

if (fileIndex === -1) {
  console.error('Usage: node validate-static.js --file <slides.md>');
  process.exit(1);
}

const filePath = args[fileIndex + 1];

function validateMarkdown(content) {
  const results = {
    valid: true,
    slideCount: 0,
    presenterNotes: 0,
    mermaidDiagrams: 0,
    codeBlocks: 0,
    vClicks: 0,
    images: 0,
    warnings: [],
    errors: []
  };

  // Count slides (--- separators)
  const lines = content.split('\n');
  const separators = lines.filter(l => l.trim() === '---').length;
  results.slideCount = Math.max(0, separators - 1);

  // Count presenter notes (<!-- ... -->)
  const presenterNoteMatches = content.match(/<!--[\s\S]*?-->/g) || [];
  results.presenterNotes = presenterNoteMatches.length;

  // Count mermaid diagrams
  results.mermaidDiagrams = (content.match(/```mermaid/g) || []).length;

  // Count code blocks (excluding mermaid)
  const allCodeBlocks = (content.match(/```/g) || []).length / 2;
  results.codeBlocks = Math.floor(allCodeBlocks) - results.mermaidDiagrams;

  // Count v-clicks
  results.vClicks = (content.match(/v-click|v-clicks/g) || []).length;

  // Count images
  results.images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;

  // Validation checks
  if (results.slideCount < 3) {
    results.warnings.push('Very few slides detected. Check if frontmatter is correct.');
  }

  if (results.slideCount > 60) {
    results.warnings.push(`${results.slideCount} slides may be too many for a single presentation.`);
  }

  // Check for unclosed code blocks
  const codeBlockMarkers = (content.match(/```/g) || []).length;
  if (codeBlockMarkers % 2 !== 0) {
    results.errors.push('Unclosed code block detected');
    results.valid = false;
  }

  // Check for broken image references
  const imageRefs = content.match(/!\[.*?\]\((.*?)\)/g) || [];
  for (const ref of imageRefs) {
    const urlMatch = ref.match(/\((.*?)\)/);
    if (urlMatch && !urlMatch[1].startsWith('http') && !urlMatch[1].startsWith('/')) {
      results.warnings.push(`Relative image path: ${urlMatch[1]} - verify file exists`);
    }
  }

  // Check for empty slides
  const slides = content.split(/\n---\n/);
  let emptySlideCount = 0;
  for (let i = 1; i < slides.length; i++) {
    const slideContent = slides[i].replace(/<!--[\s\S]*?-->/g, '').trim();
    if (slideContent.length < 10) {
      emptySlideCount++;
    }
  }
  if (emptySlideCount > 2) {
    results.warnings.push(`${emptySlideCount} slides appear nearly empty`);
  }

  return results;
}

function main() {
  console.log('📄 Static Markdown Validation');
  console.log('='.repeat(40));
  console.log(`File: ${filePath}\n`);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const results = validateMarkdown(content);

    console.log('Metrics:');
    console.log(`  Slides: ${results.slideCount}`);
    console.log(`  Presenter Notes: ${results.presenterNotes}`);
    console.log(`  Mermaid Diagrams: ${results.mermaidDiagrams}`);
    console.log(`  Code Blocks: ${results.codeBlocks}`);
    console.log(`  v-clicks: ${results.vClicks}`);
    console.log(`  Images: ${results.images}`);

    if (results.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      for (const w of results.warnings) {
        console.log(`  - ${w}`);
      }
    }

    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      for (const e of results.errors) {
        console.log(`  - ${e}`);
      }
    }

    if (results.valid) {
      console.log('\n✅ Validation PASSED');
      process.exit(0);
    } else {
      console.log('\n❌ Validation FAILED');
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
