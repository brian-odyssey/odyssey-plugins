#!/usr/bin/env node
/**
 * accessibility-check.js - WCAG accessibility validation for Slidev presentations
 *
 * Checks for:
 * - Color contrast (WCAG AA: 4.5:1 for normal text, 3:1 for large text)
 * - Heading hierarchy (proper h1 → h2 → h3 structure)
 * - Image alt text
 * - Link text quality (no "click here")
 * - Font size minimums
 *
 * Usage:
 *   node accessibility-check.js --url http://localhost:3030
 *   node accessibility-check.js --url http://localhost:3030 --output ./a11y-results
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);
const urlIndex = args.indexOf('--url');
const outputIndex = args.indexOf('--output');

const baseUrl = urlIndex !== -1 ? args[urlIndex + 1] : 'http://localhost:3030';
const outputDir = outputIndex !== -1 ? args[outputIndex + 1] : './a11y-results';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// WCAG contrast ratios
const CONTRAST_THRESHOLDS = {
  normal: 4.5,  // AA for normal text
  large: 3.0,   // AA for large text (18pt or 14pt bold)
  enhanced: 7.0 // AAA
};

async function checkAccessibility() {
  console.log('♿ Starting accessibility check...');
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
    issues: [],
    summary: {
      contrast: { pass: 0, fail: 0 },
      headings: { pass: 0, fail: 0 },
      images: { pass: 0, fail: 0 },
      links: { pass: 0, fail: 0 },
      fontSize: { pass: 0, fail: 0 }
    },
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
      return 30;
    });

    results.totalSlides = totalSlides;
    console.log(`📊 Checking ${totalSlides} slides for accessibility...\n`);

    // Check each slide
    for (let slideNum = 1; slideNum <= totalSlides; slideNum++) {
      process.stdout.write(`   Slide ${slideNum}/${totalSlides}...`);

      await page.goto(`${baseUrl}/${slideNum}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      const slideIssues = await page.evaluate(({ slideNumber, thresholds }) => {
        const issues = [];
        const content = document.querySelector('.slidev-page, .slidev-layout, main');
        if (!content) return issues;

        // Helper: Calculate relative luminance
        function getLuminance(r, g, b) {
          const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        }

        // Helper: Calculate contrast ratio
        function getContrastRatio(l1, l2) {
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          return (lighter + 0.05) / (darker + 0.05);
        }

        // Helper: Parse color string to RGB
        function parseColor(colorStr) {
          if (colorStr.startsWith('rgb')) {
            const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
              return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
            }
          }
          return null;
        }

        // Check 1: Color contrast
        const textElements = content.querySelectorAll('p, span, li, td, th, h1, h2, h3, h4, h5, h6');
        for (const el of textElements) {
          const style = getComputedStyle(el);
          const color = parseColor(style.color);
          const bgColor = parseColor(style.backgroundColor);

          if (color && bgColor && bgColor.r !== undefined) {
            const textLum = getLuminance(color.r, color.g, color.b);
            const bgLum = getLuminance(bgColor.r, bgColor.g, bgColor.b);
            const ratio = getContrastRatio(textLum, bgLum);

            const fontSize = parseFloat(style.fontSize);
            const isBold = parseInt(style.fontWeight) >= 700;
            const isLarge = fontSize >= 18 || (fontSize >= 14 && isBold);
            const threshold = isLarge ? thresholds.large : thresholds.normal;

            if (ratio < threshold) {
              issues.push({
                type: 'contrast',
                severity: 'error',
                slide: slideNumber,
                element: el.tagName,
                text: el.innerText.substring(0, 50),
                ratio: ratio.toFixed(2),
                required: threshold,
                message: `Contrast ratio ${ratio.toFixed(2)}:1 below required ${threshold}:1`
              });
            }
          }
        }

        // Check 2: Heading hierarchy
        const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        for (const heading of headings) {
          const level = parseInt(heading.tagName[1]);
          if (level > lastLevel + 1 && lastLevel !== 0) {
            issues.push({
              type: 'headings',
              severity: 'warning',
              slide: slideNumber,
              element: heading.tagName,
              text: heading.innerText.substring(0, 50),
              message: `Heading skip: ${lastLevel > 0 ? 'H' + lastLevel : 'start'} → H${level}`
            });
          }
          lastLevel = level;
        }

        // Check 3: Images without alt text
        const images = content.querySelectorAll('img');
        for (const img of images) {
          if (!img.alt && !img.getAttribute('aria-label') && !img.getAttribute('role')) {
            issues.push({
              type: 'images',
              severity: 'error',
              slide: slideNumber,
              element: 'img',
              src: img.src?.substring(0, 50),
              message: 'Image missing alt text'
            });
          }
        }

        // Check 4: Link text quality
        const links = content.querySelectorAll('a');
        const badLinkTexts = ['click here', 'here', 'read more', 'link', 'more'];
        for (const link of links) {
          const linkText = link.innerText.toLowerCase().trim();
          if (badLinkTexts.includes(linkText)) {
            issues.push({
              type: 'links',
              severity: 'warning',
              slide: slideNumber,
              element: 'a',
              text: link.innerText,
              message: `Non-descriptive link text: "${link.innerText}"`
            });
          }
        }

        // Check 5: Font size minimums
        const allText = content.querySelectorAll('p, span, li, td');
        for (const el of allText) {
          const fontSize = parseFloat(getComputedStyle(el).fontSize);
          if (fontSize < 14 && el.innerText.trim().length > 0) {
            issues.push({
              type: 'fontSize',
              severity: 'warning',
              slide: slideNumber,
              element: el.tagName,
              text: el.innerText.substring(0, 30),
              fontSize: fontSize,
              message: `Font size ${fontSize}px below recommended 14px minimum`
            });
          }
        }

        return issues;
      }, { slideNumber: slideNum, thresholds: CONTRAST_THRESHOLDS });

      // Add issues to results
      for (const issue of slideIssues) {
        results.issues.push(issue);
        results.summary[issue.type].fail++;
      }

      // Count passes (simplified - just based on checks run)
      if (!slideIssues.some(i => i.type === 'contrast')) results.summary.contrast.pass++;
      if (!slideIssues.some(i => i.type === 'headings')) results.summary.headings.pass++;
      if (!slideIssues.some(i => i.type === 'images')) results.summary.images.pass++;
      if (!slideIssues.some(i => i.type === 'links')) results.summary.links.pass++;
      if (!slideIssues.some(i => i.type === 'fontSize')) results.summary.fontSize.pass++;

      const issueCount = slideIssues.length;
      if (issueCount > 0) {
        console.log(` ⚠️  ${issueCount} issue(s)`);
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
  console.log('\n' + '='.repeat(60));
  console.log('♿ ACCESSIBILITY REPORT');
  console.log('='.repeat(60));

  console.log(`\nTotal Slides: ${results.totalSlides}`);
  console.log(`Total Issues: ${results.issues.length}`);

  console.log('\nCategory Breakdown:');
  for (const [category, counts] of Object.entries(results.summary)) {
    const status = counts.fail === 0 ? '✅' : '⚠️';
    console.log(`  ${status} ${category}: ${counts.fail} issues`);
  }

  if (results.issues.length > 0) {
    console.log('\nIssues by Slide:');
    const bySlide = {};
    for (const issue of results.issues) {
      if (!bySlide[issue.slide]) bySlide[issue.slide] = [];
      bySlide[issue.slide].push(issue);
    }

    for (const [slide, issues] of Object.entries(bySlide)) {
      console.log(`\n  Slide ${slide}:`);
      for (const issue of issues) {
        const icon = issue.severity === 'error' ? '❌' : '⚠️';
        console.log(`    ${icon} [${issue.type}] ${issue.message}`);
      }
    }
  }

  // Save JSON report
  const reportPath = path.join(outputDir, 'accessibility-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nReport saved: ${reportPath}`);

  // Exit with appropriate code
  // CRITICAL: Check execution errors FIRST (fixes silent failure bug)
  if (results.errors && results.errors.length > 0) {
    console.error(`\n❌ Validation failed: ${results.errors.length} execution error(s)`);
    process.exit(2);  // Distinct code for execution failures
  }

  // Exit code based on errors (not warnings)
  const errorCount = results.issues.filter(i => i.severity === 'error').length;
  process.exit(errorCount > 0 ? 1 : 0);
}

// Run the check
checkAccessibility().catch(console.error);
