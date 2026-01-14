# Phase 4: REFINE

Iteratively improve based on validation and user feedback.

## Critical: AI-Assistant Model

**This phase follows the AI-Assistant model, NOT AI-Automaton.**

| Model | Behavior |
|-------|----------|
| AI-Automaton ❌ | Auto-applies fixes without confirmation |
| AI-Assistant ✅ | Proposes fixes, waits for user approval |

**Why?** Presentations are subjective. The AI cannot know:
- Which content is essential vs. expendable
- Presenter's comfort level with various layouts
- Audience expectations and context
- Brand guidelines and corporate standards

## Process

### Step 1: Present Issues with Proposed Fixes

For each validation issue, propose a specific fix:

```markdown
## Issue 1: Slide 7 Overflow

**Problem**: Mermaid mindmap exceeds container height
**Screenshot**: `screenshots/slide-7-overflow.png`

**Proposed Fix Options**:

### Option A: Replace with Card Grid (Recommended)
Convert mindmap to 4-column card layout:
```markdown
<div class="grid grid-cols-4 gap-3">
  <div class="p-3 bg-blue-900/40 rounded-lg">
    <h3>Category 1</h3>
    <p>Points...</p>
  </div>
  <!-- ... -->
</div>
```
✅ Clean, predictable layout
✅ No Mermaid rendering issues

### Option B: Simplify Mindmap
Reduce nodes from 12 to 6, increase font size.
⚠️ May lose important information

### Option C: Split into Two Slides
Divide content across slides 7a and 7b.
⚠️ Disrupts flow

**Which option would you like me to apply?**
```

### Step 2: Wait for User Approval

**DO NOT PROCEED** without explicit user confirmation:

- "Apply Option A"
- "Let's go with the card grid"
- "Yes, make that change"

**If unclear**, ask for clarification:
```
I want to make sure I apply the right fix.
Did you want Option A (card grid), B (simplify), or C (split)?
```

### Step 3: Apply Approved Fix Only

After approval:

1. Make the specific approved change
2. Show the diff or describe the modification
3. Offer to preview in browser

```markdown
✅ Applied Option A to Slide 7

**Change Made**:
- Removed Mermaid mindmap
- Added 4-column card grid with same content
- Preserved all category information

Would you like to:
- [ ] Preview slide 7 in browser
- [ ] Move to next issue
- [ ] Re-validate all slides
```

### Step 4: Re-Validate After Fixes

After all approved fixes applied:

```bash
# Re-run validators
node validators/overflow-check.js --url http://localhost:3030
```

Present updated validation report:

```markdown
## Re-Validation Results

| Check | Before | After |
|-------|--------|-------|
| Overflow | 2 slides | 0 slides ✅ |
| Accessibility | 0 issues | 0 issues ✅ |
| Timing | 24 min over | 10 min over ⚠️ |

### Remaining Issues
- **Timing**: Still 10 minutes over target

**Options**:
1. Accept current length (presenter speaks faster)
2. Identify slides to consolidate or remove
3. Adjust target duration

**How would you like to proceed?**
```

### Step 5: Accept User Feedback

Beyond validation issues, accept subjective feedback:

```markdown
User: "The color scheme on slide 12 doesn't match our brand"

**Proposed Fix**:
Change background from `bg-blue-900` to `bg-[#1a365d]` (your brand navy).
Apply same change to slides 12, 14, 18 for consistency.

**Apply this change?**
```

### Step 6: Iterate Until Satisfied

Continue the propose-approve-apply cycle until:
- All validation issues resolved
- User indicates satisfaction
- Explicit approval to proceed to FINALIZE

## Output

- Refined `slides.md` passing validation
- Change log documenting all modifications
- User approval to proceed

## Anti-Patterns to Avoid

❌ **Don't**: Apply fixes without asking
❌ **Don't**: Assume which option user prefers
❌ **Don't**: Make "improvements" beyond what was approved
❌ **Don't**: Proceed to FINALIZE without explicit approval

✅ **Do**: Present clear options with tradeoffs
✅ **Do**: Wait for explicit confirmation
✅ **Do**: Re-validate after changes
✅ **Do**: Accept "none of the above" as valid response

## Next Phase

After user approval: [Phase 5: FINALIZE](./finalize.md)
