# Phase 3: VALIDATE

Automated quality checks before human review.

## Prerequisites

- Generated `slides.md` from Phase 2
- Node.js 18+ installed
- Playwright available

## Process

### Step 1: Start Slidev Server

```bash
# Start dev server in background
npx slidev slides.md --port 3030 &

# Wait for server to be ready
sleep 5

# Verify server is running
curl -s http://localhost:3030 > /dev/null && echo "Server ready"
```

### Step 2: Run Validators

Execute all validators in sequence:

```bash
# 1. Overflow detection (critical)
node validators/overflow-check.js --url http://localhost:3030

# 2. Slide crawl analysis
node validators/slide-crawler.js --url http://localhost:3030

# 3. Accessibility check
node validators/accessibility-check.js --url http://localhost:3030
```

### Step 3: Overflow Detection

The `overflow-check.js` validator uses Playwright to:

1. Navigate to each slide
2. Check DOM for overflow conditions:
   ```javascript
   const hasOverflow = await page.evaluate(() => {
     const content = document.querySelector('.slidev-page');
     return content.scrollHeight > content.clientHeight;
   });
   ```
3. Capture screenshot if overflow detected
4. Report affected slides

**Output Format**:
```json
{
  "totalSlides": 27,
  "overflowSlides": [7, 15],
  "screenshots": [
    "screenshots/slide-7-overflow.png",
    "screenshots/slide-15-overflow.png"
  ]
}
```

### Step 4: Accessibility Check

The `accessibility-check.js` validator checks:

| Check | Criteria |
|-------|----------|
| Color contrast | WCAG AA (4.5:1 for normal text) |
| Heading hierarchy | Proper h1 → h2 → h3 structure |
| Image alt text | All images have descriptive alt |
| Link text | No "click here" links |
| Font size | Minimum 18px for body text |

### Step 5: Timing Analysis

Calculate presentation timing:

```
Target: [duration_minutes] from outline
Rule: ~2 minutes per slide average

Slides: 27
Estimated Duration: 54 minutes
Target Duration: 30 minutes
Status: ⚠️ OVER by 24 minutes
```

### Step 6: Generate Validation Report

Compile all findings:

```markdown
## Validation Report

### Summary
| Check | Status | Issues |
|-------|--------|--------|
| Overflow | ⚠️ | 2 slides |
| Accessibility | ✅ | 0 issues |
| Timing | ⚠️ | 24 min over |

### Overflow Issues
- **Slide 7**: Mermaid mindmap overflows container
  - Screenshot: `screenshots/slide-7-overflow.png`
- **Slide 15**: Table exceeds visible area
  - Screenshot: `screenshots/slide-15-overflow.png`

### Timing Analysis
- Current: 27 slides (54 min estimated)
- Target: 15 slides (30 min target)
- Recommendation: Remove or consolidate 12 slides

### Accessibility
All checks passed.

---
**Validation Status**: NEEDS REFINEMENT
Proceed to Phase 4 (REFINE) to address issues.
```

## Output

- Validation report (displayed to user)
- Screenshots of issues (saved to `screenshots/`)
- Go/No-go decision for REFINE phase

## Decision Points

| Validation Result | Action |
|-------------------|--------|
| All checks pass | Proceed to FINALIZE |
| Issues found | Proceed to REFINE |
| Critical failures | Re-run GENERATE |

## Next Phase

Based on validation results:
- Issues found → [Phase 4: REFINE](./refine.md)
- All clear → [Phase 5: FINALIZE](./finalize.md)
