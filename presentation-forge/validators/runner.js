#!/usr/bin/env node
/**
 * runner.js - Shared validation runner for Slidev presentation validators
 *
 * Provides centralized:
 * - Browser launch and teardown
 * - Slide count detection
 * - Slide navigation with error handling
 * - Exit code logic (with execution error checking)
 * - Report generation
 *
 * Usage (from validator files):
 *   const { runValidation } = require('./runner');
 *   runValidation(config, checkFunction);
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * Parse common CLI arguments
 * @returns {{ baseUrl: string, outputDir: string }}
 */
function parseArgs(defaultOutputDir) {
  const args = process.argv.slice(2);
  const urlIndex = args.indexOf('--url');
  const outputIndex = args.indexOf('--output');

  return {
    baseUrl: urlIndex !== -1 ? args[urlIndex + 1] : 'http://localhost:3030',
    outputDir: outputIndex !== -1 ? args[outputIndex + 1] : defaultOutputDir
  };
}

/**
 * Ensure output directory exists
 * @param {string} dir
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Get slide count from Slidev presentation
 * @param {import('playwright').Page} page
 * @returns {Promise<number>}
 */
async function getSlideCount(page) {
  return await page.evaluate(() => {
    // Slidev stores slide count in various places
    const slideNav = document.querySelector('.slidev-nav-total');
    if (slideNav) return parseInt(slideNav.textContent, 10);

    // Alternative: count from URL navigation
    const links = document.querySelectorAll('[data-slide-id]');
    if (links.length > 0) return links.length;

    // Last resort: try to detect from page content
    // This is a known limitation - fallback may not be accurate
    console.warn('⚠️  Could not detect slide count, using fallback of 30');
    return 30;
  });
}

/**
 * Navigate to a specific slide with retry logic
 * @param {import('playwright').Page} page
 * @param {string} baseUrl
 * @param {number} slideNum
 * @param {number} retries
 * @returns {Promise<void>}
 */
async function navigateToSlide(page, baseUrl, slideNum, retries = 3) {
  const url = `${baseUrl}/${slideNum}`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(300); // Brief wait for animations
      return;
    } catch (err) {
      if (attempt === retries - 1) {
        throw new Error(`Failed to navigate to slide ${slideNum} after ${retries} attempts: ${err.message}`);
      }
      console.warn(`\n      ⚠️  Retry ${attempt + 1}/${retries} for slide ${slideNum}`);
      await page.waitForTimeout(1000 * (attempt + 1)); // Exponential backoff
    }
  }
}

/**
 * Take a screenshot with error handling
 * @param {import('playwright').Page} page
 * @param {string} screenshotPath
 * @returns {Promise<{ success: boolean, path: string }>}
 */
async function safeScreenshot(page, screenshotPath) {
  try {
    await page.screenshot({ path: screenshotPath, fullPage: true });
    return { success: true, path: screenshotPath };
  } catch (err) {
    console.warn(`\n      ⚠️  Could not save screenshot: ${err.message}`);
    return { success: false, path: `FAILED: ${screenshotPath}` };
  }
}

/**
 * Determine exit code and exit process
 * Checks execution errors FIRST to prevent silent failures
 *
 * @param {Object} results - Validation results
 * @param {string[]} results.errors - Execution errors
 * @param {number} issueCount - Number of validation issues found
 */
function exitWithCode(results, issueCount) {
  // CRITICAL: Check execution errors FIRST
  if (results.errors && results.errors.length > 0) {
    console.error(`\n❌ Validation failed: ${results.errors.length} execution error(s)`);
    process.exit(2);  // Distinct code for execution failures
  }

  // Then check validation results
  process.exit(issueCount > 0 ? 1 : 0);
}

/**
 * Save JSON report to file
 * @param {string} outputDir
 * @param {string} filename
 * @param {Object} results
 * @returns {string} Report path
 */
function saveReport(outputDir, filename, results) {
  const reportPath = path.join(outputDir, filename);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  return reportPath;
}

/**
 * Main validation runner
 *
 * @param {Object} config
 * @param {string} config.name - Validator name (for logging)
 * @param {string} config.emoji - Emoji for logging
 * @param {string} config.defaultOutputDir - Default output directory
 * @param {string} config.reportFilename - Report filename
 * @param {Function} config.initResults - Function to create initial results object
 * @param {Function} checkSlide - Function to check a single slide (page, slideNum, results) => Promise<void>
 * @param {Function} generateReport - Function to generate final report (results) => void
 * @returns {Promise<void>}
 */
async function runValidation(config, checkSlide, generateReport) {
  const { baseUrl, outputDir } = parseArgs(config.defaultOutputDir);
  ensureDir(outputDir);

  console.log(`${config.emoji} Starting ${config.name}...`);
  console.log(`   URL: ${baseUrl}`);
  console.log(`   Output: ${outputDir}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const results = config.initResults(baseUrl);

  try {
    // Navigate to first slide
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for Slidev to fully render

    // Get slide count
    const totalSlides = await getSlideCount(page);
    results.totalSlides = totalSlides;
    console.log(`📊 Found ${totalSlides} slides\n`);

    // Check each slide
    for (let slideNum = 1; slideNum <= totalSlides; slideNum++) {
      process.stdout.write(`   Checking slide ${slideNum}/${totalSlides}...`);

      await navigateToSlide(page, baseUrl, slideNum);
      await checkSlide(page, slideNum, results, outputDir);
    }

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    results.errors.push(error.message);
  } finally {
    await browser.close();
  }

  // Generate report
  generateReport(results, outputDir);

  // Save JSON report
  const reportPath = saveReport(outputDir, config.reportFilename, results);
  console.log(`\nReport saved: ${reportPath}`);

  return results;
}

module.exports = {
  parseArgs,
  ensureDir,
  getSlideCount,
  navigateToSlide,
  safeScreenshot,
  exitWithCode,
  saveReport,
  runValidation
};
