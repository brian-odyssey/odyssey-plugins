#!/usr/bin/env node
/**
 * overflow-check.js - Playwright-based DOM overflow detection for Slidev presentations
 *
 * Detects content overflow by comparing scrollHeight vs clientHeight for each slide.
 * Captures screenshots of problematic slides for review.
 *
 * Usage:
 *   node overflow-check.js --url http://localhost:3030
 *   node overflow-check.js --url http://localhost:3030 --output ./validation-results
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);
const urlIndex = args.indexOf('--url');
const outputIndex = args.indexOf('--output');

const baseUrl = urlIndex !== -1 ? args[urlIndex + 1] : 'http://localhost:3030';
const outputDir = outputIndex !== -1 ? args[outputIndex + 1] : './screenshots';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function checkOverflow() {
  console.log('🔍 Starting overflow detection...');
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
    overflowSlides: [],
    screenshots: [],
    errors: []
  };

  try {
    // Navigate to first slide
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for Slidev to fully render

    // Get total slide count from Slidev
    const totalSlides = await page.evaluate(() => {
      // Slidev stores slide count in various places
      const slideNav = document.querySelector('.slidev-nav-total');
      if (slideNav) return parseInt(slideNav.textContent, 10);

      // Alternative: count from URL navigation
      const links = document.querySelectorAll('[data-slide-id]');
      return links.length || 30; // Fallback to 30
    });

    results.totalSlides = totalSlides;
    console.log(`📊 Found ${totalSlides} slides`);

    // Check each slide for overflow
    for (let slideNum = 1; slideNum <= totalSlides; slideNum++) {
      process.stdout.write(`   Checking slide ${slideNum}/${totalSlides}...`);

      // Navigate to specific slide
      await page.goto(`${baseUrl}/${slideNum}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500); // Brief wait for animations

      // Check for overflow conditions
      const overflowData = await page.evaluate(() => {
        // Multiple selectors for Slidev content areas
        const selectors = [
          '.slidev-page',
          '.slidev-layout',
          '[data-slidev-page]',
          'main',
          '.slide-content'
        ];

        let hasOverflow = false;
        let overflowDetails = [];

        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) {
            const scrollHeight = element.scrollHeight;
            const clientHeight = element.clientHeight;
            const scrollWidth = element.scrollWidth;
            const clientWidth = element.clientWidth;

            // Check vertical overflow
            if (scrollHeight > clientHeight + 5) { // 5px tolerance
              hasOverflow = true;
              overflowDetails.push({
                selector,
                type: 'vertical',
                overflow: scrollHeight - clientHeight,
                scrollHeight,
                clientHeight
              });
            }

            // Check horizontal overflow
            if (scrollWidth > clientWidth + 5) {
              hasOverflow = true;
              overflowDetails.push({
                selector,
                type: 'horizontal',
                overflow: scrollWidth - clientWidth,
                scrollWidth,
                clientWidth
              });
            }
          }
        }

        // Also check for elements with CSS overflow: hidden that are clipping
        // Skip intentionally hidden elements like sr-only (screen-reader only)
        const skipClasses = ['sr-only', 'visually-hidden', 'screen-reader-only', 'clip-hidden'];
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          // Skip screen-reader-only and other intentionally hidden elements
          const classList = el.className?.toString() || '';
          if (skipClasses.some(c => classList.includes(c))) continue;

          const style = getComputedStyle(el);
          if (style.overflow === 'hidden' || style.overflowY === 'hidden') {
            if (el.scrollHeight > el.clientHeight + 5) {
              hasOverflow = true;
              overflowDetails.push({
                selector: el.className || el.tagName,
                type: 'clipped',
                overflow: el.scrollHeight - el.clientHeight,
                note: 'Content clipped by overflow:hidden'
              });
            }
          }
        }

        return { hasOverflow, overflowDetails };
      });

      if (overflowData.hasOverflow) {
        console.log(' ⚠️  OVERFLOW DETECTED');

        // Capture screenshot (with error handling)
        const screenshotPath = path.join(outputDir, `slide-${slideNum}-overflow.png`);
        try {
          await page.screenshot({ path: screenshotPath, fullPage: true });
          results.screenshots.push(screenshotPath);
        } catch (screenshotErr) {
          console.warn(`\n      ⚠️  Could not save screenshot: ${screenshotErr.message}`);
          results.screenshots.push(`FAILED: ${screenshotPath}`);
        }

        results.overflowSlides.push({
          slide: slideNum,
          details: overflowData.overflowDetails
        });
      } else {
        console.log(' ✅');
      }
    }

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    results.errors.push(error.message);
  } finally {
    await browser.close();
  }

  // Generate report
  console.log('\n' + '='.repeat(50));
  console.log('📋 OVERFLOW CHECK REPORT');
  console.log('='.repeat(50));
  console.log(`Total Slides: ${results.totalSlides}`);
  console.log(`Overflow Issues: ${results.overflowSlides.length}`);

  if (results.overflowSlides.length > 0) {
    console.log('\nAffected Slides:');
    for (const issue of results.overflowSlides) {
      console.log(`  - Slide ${issue.slide}:`);
      for (const detail of issue.details) {
        console.log(`      ${detail.type} overflow: ${detail.overflow}px (${detail.selector})`);
      }
    }
    console.log(`\nScreenshots saved to: ${outputDir}`);
  } else {
    console.log('\n✅ No overflow issues detected!');
  }

  // Save JSON report
  const reportPath = path.join(outputDir, 'overflow-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nReport saved: ${reportPath}`);

  // Exit with appropriate code
  // CRITICAL: Check execution errors FIRST (fixes silent failure bug)
  if (results.errors && results.errors.length > 0) {
    console.error(`\n❌ Validation failed: ${results.errors.length} execution error(s)`);
    process.exit(2);  // Distinct code for execution failures
  }
  process.exit(results.overflowSlides.length > 0 ? 1 : 0);
}

// Run the check
checkOverflow().catch(console.error);
