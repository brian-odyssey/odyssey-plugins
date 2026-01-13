#!/usr/bin/env node
/**
 * slide-crawler.js - Systematic slide-by-slide analysis for Slidev presentations
 *
 * Crawls through all slides and collects metrics including:
 * - Content density (word count, element count)
 * - Mermaid diagram presence
 * - Code block usage
 * - Speaker notes presence
 * - Estimated timing
 *
 * Usage:
 *   node slide-crawler.js --url http://localhost:3030
 *   node slide-crawler.js --url http://localhost:3030 --output ./analysis
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);
const urlIndex = args.indexOf('--url');
const outputIndex = args.indexOf('--output');

const baseUrl = urlIndex !== -1 ? args[urlIndex + 1] : 'http://localhost:3030';
const outputDir = outputIndex !== -1 ? args[outputIndex + 1] : './analysis';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Timing estimates (minutes per slide type)
const TIMING_ESTIMATES = {
  title: 0.5,
  section: 0.5,
  simple: 1.5,
  diagram: 2.5,
  code: 3.0,
  table: 2.0,
  dense: 3.0,
  default: 2.0
};

async function crawlSlides() {
  console.log('🕷️  Starting slide crawler...');
  console.log(`   URL: ${baseUrl}`);
  console.log(`   Output: ${outputDir}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const results = {
    timestamp: new Date().toISOString(),
    baseUrl,
    totalSlides: 0,
    estimatedDuration: 0,
    slides: [],
    summary: {
      withDiagrams: 0,
      withCode: 0,
      withTables: 0,
      withSpeakerNotes: 0,
      averageWordCount: 0,
      contentDensity: 'unknown'
    },
    warnings: [],
    errors: []
  };

  try {
    // Navigate to first slide
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Get total slide count
    const totalSlides = await page.evaluate(() => {
      const nav = document.querySelector('.slidev-nav-total');
      if (nav) return parseInt(nav.textContent, 10);
      return 30; // Fallback
    });

    results.totalSlides = totalSlides;
    console.log(`📊 Analyzing ${totalSlides} slides...\n`);

    let totalWords = 0;

    // Analyze each slide
    for (let slideNum = 1; slideNum <= totalSlides; slideNum++) {
      process.stdout.write(`   Slide ${slideNum}/${totalSlides}...`);

      await page.goto(`${baseUrl}/${slideNum}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      const slideData = await page.evaluate((slideNumber) => {
        const content = document.querySelector('.slidev-page, .slidev-layout, main');
        if (!content) return null;

        // Extract text content
        const textContent = content.innerText || '';
        const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;

        // Check for various elements
        const hasMermaid = !!content.querySelector('.mermaid, svg.mermaid');
        const hasCode = !!content.querySelector('pre code, .shiki');
        const hasTable = !!content.querySelector('table');
        const hasImage = !!content.querySelector('img:not(.logo)');

        // Get heading
        const heading = content.querySelector('h1, h2')?.innerText || `Slide ${slideNumber}`;

        // Count interactive elements (v-clicks)
        const vClicks = content.querySelectorAll('[data-v-click]').length;

        // Detect slide type
        let slideType = 'default';
        if (heading.toLowerCase().includes('agenda') || wordCount < 20) {
          slideType = 'simple';
        } else if (hasMermaid) {
          slideType = 'diagram';
        } else if (hasCode) {
          slideType = 'code';
        } else if (hasTable) {
          slideType = 'table';
        } else if (wordCount > 100) {
          slideType = 'dense';
        }

        // Check for title/section slides
        const layout = document.querySelector('[class*="layout-"]');
        if (layout?.className.includes('section') || layout?.className.includes('center')) {
          slideType = 'section';
        }
        if (slideNumber === 1) {
          slideType = 'title';
        }

        // Element count
        const elementCount = content.querySelectorAll('*').length;

        return {
          number: slideNumber,
          heading: heading.substring(0, 50),
          wordCount,
          elementCount,
          hasMermaid,
          hasCode,
          hasTable,
          hasImage,
          vClicks,
          slideType
        };
      }, slideNum);

      if (slideData) {
        // Calculate estimated time
        slideData.estimatedMinutes = TIMING_ESTIMATES[slideData.slideType] || TIMING_ESTIMATES.default;

        // Check for potential issues
        if (slideData.wordCount > 150) {
          results.warnings.push({
            slide: slideNum,
            type: 'dense_content',
            message: `Slide ${slideNum} has ${slideData.wordCount} words (recommended: <100)`
          });
        }

        if (slideData.elementCount > 50) {
          results.warnings.push({
            slide: slideNum,
            type: 'complex_layout',
            message: `Slide ${slideNum} has ${slideData.elementCount} elements (may render slowly)`
          });
        }

        results.slides.push(slideData);
        totalWords += slideData.wordCount;

        // Update summary counts
        if (slideData.hasMermaid) results.summary.withDiagrams++;
        if (slideData.hasCode) results.summary.withCode++;
        if (slideData.hasTable) results.summary.withTables++;

        console.log(` ${slideData.slideType} (${slideData.wordCount} words)`);
      } else {
        console.log(' ⚠️  Could not analyze');
        results.errors.push(`Could not analyze slide ${slideNum}`);
      }
    }

    // Calculate summary statistics
    results.summary.averageWordCount = Math.round(totalWords / results.totalSlides);
    results.estimatedDuration = results.slides.reduce((sum, s) => sum + (s.estimatedMinutes || 2), 0);

    // Determine overall content density
    if (results.summary.averageWordCount < 50) {
      results.summary.contentDensity = 'light';
    } else if (results.summary.averageWordCount < 100) {
      results.summary.contentDensity = 'moderate';
    } else {
      results.summary.contentDensity = 'dense';
    }

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    results.errors.push(error.message);
  } finally {
    await browser.close();
  }

  // Generate report
  console.log('\n' + '='.repeat(60));
  console.log('📋 SLIDE ANALYSIS REPORT');
  console.log('='.repeat(60));

  console.log(`\nTotal Slides: ${results.totalSlides}`);
  console.log(`Estimated Duration: ${results.estimatedDuration.toFixed(1)} minutes`);
  console.log(`Average Words/Slide: ${results.summary.averageWordCount}`);
  console.log(`Content Density: ${results.summary.contentDensity}`);

  console.log('\nSlide Types:');
  const typeCount = {};
  for (const slide of results.slides) {
    typeCount[slide.slideType] = (typeCount[slide.slideType] || 0) + 1;
  }
  for (const [type, count] of Object.entries(typeCount)) {
    console.log(`  ${type}: ${count}`);
  }

  console.log('\nFeatures Used:');
  console.log(`  Mermaid Diagrams: ${results.summary.withDiagrams}`);
  console.log(`  Code Blocks: ${results.summary.withCode}`);
  console.log(`  Tables: ${results.summary.withTables}`);

  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    for (const warning of results.warnings) {
      console.log(`  - ${warning.message}`);
    }
  }

  // Save JSON report
  const reportPath = path.join(outputDir, 'slide-analysis.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nReport saved: ${reportPath}`);

  // Generate markdown summary
  const markdownReport = generateMarkdownReport(results);
  const mdPath = path.join(outputDir, 'slide-analysis.md');
  fs.writeFileSync(mdPath, markdownReport);
  console.log(`Markdown report: ${mdPath}`);

  process.exit(results.warnings.length > 5 ? 1 : 0);
}

function generateMarkdownReport(results) {
  let md = `# Slide Analysis Report

**Generated**: ${results.timestamp}
**URL**: ${results.baseUrl}

## Summary

| Metric | Value |
|--------|-------|
| Total Slides | ${results.totalSlides} |
| Estimated Duration | ${results.estimatedDuration.toFixed(1)} min |
| Avg Words/Slide | ${results.summary.averageWordCount} |
| Content Density | ${results.summary.contentDensity} |

## Slide Breakdown

| # | Title | Type | Words | Features |
|---|-------|------|-------|----------|
`;

  for (const slide of results.slides) {
    const features = [];
    if (slide.hasMermaid) features.push('📊');
    if (slide.hasCode) features.push('💻');
    if (slide.hasTable) features.push('📋');
    if (slide.hasImage) features.push('🖼️');

    md += `| ${slide.number} | ${slide.heading} | ${slide.slideType} | ${slide.wordCount} | ${features.join(' ') || '-'} |\n`;
  }

  if (results.warnings.length > 0) {
    md += `\n## Warnings\n\n`;
    for (const warning of results.warnings) {
      md += `- **Slide ${warning.slide}**: ${warning.message}\n`;
    }
  }

  return md;
}

// Run the crawler
crawlSlides().catch(console.error);
