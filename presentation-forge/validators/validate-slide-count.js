#!/usr/bin/env node
/**
 * validate-slide-count.js - P0 Fix C2: Slide Count Integrity Validation
 *
 * Validates that the YAML outline slide count matches the generated markdown.
 * This prevents silent slide loss during generation.
 *
 * Usage:
 *   node validate-slide-count.js --yaml ./outline.yaml --md ./slides.md
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Parse arguments
const args = process.argv.slice(2);
const yamlIndex = args.indexOf('--yaml');
const mdIndex = args.indexOf('--md');

if (yamlIndex === -1 || mdIndex === -1) {
  console.error('Usage: node validate-slide-count.js --yaml <outline.yaml> --md <slides.md>');
  process.exit(1);
}

const yamlPath = args[yamlIndex + 1];
const mdPath = args[mdIndex + 1];

function countYamlSlides(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const outline = yaml.load(content);

  let count = 0;

  // Count top-level slides
  if (outline.slides) {
    count += outline.slides.length;
  }

  // Count slides within sections
  if (outline.sections) {
    for (const section of outline.sections) {
      if (section.slides) {
        count += section.slides.length;
      }
    }
  }

  // Count in structure (alternative format)
  if (outline.structure) {
    for (const part of outline.structure) {
      if (part.slides) {
        count += part.slides.length;
      }
    }
  }

  return count;
}

function countMarkdownSlides(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Count slide separators (--- at start of line)
  // First --- is frontmatter, subsequent are slides
  const separators = content.split('\n').filter(line => line.trim() === '---').length;

  // Subtract 2 for frontmatter delimiters, add 1 for implicit first slide
  return Math.max(0, separators - 1);
}

function validate() {
  console.log('🔍 Slide Count Validation');
  console.log('='.repeat(40));

  try {
    const yamlCount = countYamlSlides(yamlPath);
    const mdCount = countMarkdownSlides(mdPath);

    console.log(`\nYAML Outline: ${yamlCount} slides`);
    console.log(`Markdown:     ${mdCount} slides`);

    const delta = mdCount - yamlCount;

    if (delta === 0) {
      console.log('\n✅ PASS: Slide counts match');
      process.exit(0);
    } else if (Math.abs(delta) <= 2) {
      console.log(`\n⚠️  WARNING: Minor discrepancy (${delta > 0 ? '+' : ''}${delta} slides)`);
      console.log('   Review outline vs generated content');
      process.exit(0);
    } else {
      console.log(`\n❌ FAIL: Significant discrepancy (${delta > 0 ? '+' : ''}${delta} slides)`);
      console.log('   YAML outline and markdown are out of sync');
      console.log('   Review generation process for lost/duplicated content');
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

validate();
