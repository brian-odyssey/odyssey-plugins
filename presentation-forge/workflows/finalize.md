# Phase 5: FINALIZE

Export all deliverables and package the complete presentation.

## Prerequisites

- Refined `slides.md` from Phase 4
- All validation checks passing
- User approval to finalize

## Process

### Step 1: Export PDF

Generate PDF version of slides:

```bash
# Export to PDF (default)
npx slidev export slides.md

# With options
npx slidev export slides.md \
  --format pdf \
  --output slides-export.pdf \
  --dark \
  --with-clicks
```

**Export Options**:
| Option | Description |
|--------|-------------|
| `--format pdf` | PDF format (default) |
| `--format png` | Individual PNG images |
| `--dark` | Dark theme export |
| `--with-clicks` | Include v-click states |
| `--timeout 60000` | Longer timeout for complex slides |

### Step 2: Generate Speaker Notes

Extract and format speaker notes:

```markdown
# Speaker Notes: [Presentation Title]

## Slide 1: Title
- Introduce yourself
- Set expectations for duration and format
- Mention Q&A at end

## Slide 2: Agenda
- Walk through the three main sections
- Highlight the key decision point in section 2
- Estimate ~3 minutes for this slide

## Slide 3: ...
[Continue for all slides]

---
## Timing Guide

| Slide | Target Time | Cumulative |
|-------|-------------|------------|
| 1-2 | 3 min | 3 min |
| 3-7 | 10 min | 13 min |
| 8-12 | 10 min | 23 min |
| 13-15 | 7 min | 30 min |

## Key Transitions
- After slide 5, pause for questions
- Slide 10 is the main decision point
- Allow extra time on slide 12 (complex diagram)
```

### Step 3: Create Leave-Behind Materials

Generate condensed handout for attendees:

```markdown
# [Presentation Title] - Summary

## Key Takeaways

1. **[Takeaway 1]**: Brief explanation
2. **[Takeaway 2]**: Brief explanation
3. **[Takeaway 3]**: Brief explanation

## Important Decisions

| Decision | Options | Recommendation |
|----------|---------|----------------|
| [Decision 1] | A, B, C | Option B |
| [Decision 2] | X, Y | Option X |

## Next Steps

- [ ] Action item 1 (Owner: [Name], Due: [Date])
- [ ] Action item 2 (Owner: [Name], Due: [Date])
- [ ] Action item 3 (Owner: [Name], Due: [Date])

## Reference Materials

- [Link to detailed documentation]
- [Link to supporting data]
- [Contact for questions]

---
*Generated from presentation on [Date]*
```

### Step 4: Create Facilitation Guide (Optional)

For interactive presentations:

```markdown
# Facilitation Guide: [Presentation Title]

## Pre-Meeting Checklist
- [ ] Test screen sharing
- [ ] Load slides in presenter mode
- [ ] Have backup PDF ready
- [ ] Prepare whiteboard for notes

## Audience Engagement Points

| Slide | Engagement | Duration |
|-------|------------|----------|
| 3 | Ask: "What challenges have you seen?" | 2 min |
| 7 | Poll: "Which approach do you prefer?" | 1 min |
| 12 | Discussion: Review the architecture | 5 min |

## Handling Objections

### "This seems too complex"
Response: Point to slide 8 showing simplified alternative...

### "What about timeline?"
Response: Reference slide 15 with phased approach...

## Contingency Plans

| Issue | Response |
|-------|----------|
| Running over time | Skip slides 9-10, summarize verbally |
| Technical questions | Defer to appendix or follow-up meeting |
| Disagreement | Capture in parking lot, continue |
```

### Step 5: Package Deliverables

Create organized output:

```
presentation-package/
├── slides.md                    # Source Slidev file
├── slides-export.pdf            # PDF export
├── speaker-notes.md             # Extracted notes
├── leave-behind.md              # Attendee handout
├── facilitation-guide.md        # (if applicable)
├── screenshots/                 # Key slide images
│   ├── slide-01-title.png
│   ├── slide-07-architecture.png
│   └── slide-15-timeline.png
└── README.md                    # Package contents
```

### Step 6: Present Final Package

Show user the complete deliverable set:

```markdown
## Presentation Package Complete 🎉

### Deliverables Created

| File | Description | Size |
|------|-------------|------|
| `slides.md` | Source Slidev presentation | 12 KB |
| `slides-export.pdf` | PDF for sharing | 2.4 MB |
| `speaker-notes.md` | Presenter guide | 4 KB |
| `leave-behind.md` | Attendee summary | 2 KB |
| `facilitation-guide.md` | Meeting guide | 3 KB |

### Quick Links

- **Present**: `npx slidev slides.md`
- **PDF**: Open `slides-export.pdf`
- **Presenter Mode**: http://localhost:3030/presenter

### Presentation Statistics

- **Slides**: 15
- **Estimated Duration**: 30 minutes
- **Mermaid Diagrams**: 3
- **Code Blocks**: 2

---

**Ready to present!**

Would you like me to:
- [ ] Start the presentation server
- [ ] Open presenter mode
- [ ] Make any final adjustments
```

## Output

Complete presentation package including:
- Source Slidev markdown
- Exported PDF
- Speaker notes
- Leave-behind materials
- Optional facilitation guide

## Post-Finalize

After successful finalize:

1. **Archive**: Consider committing to version control
2. **Backup**: Copy package to shared drive if needed
3. **Rehearse**: Run through presentation with speaker notes
4. **Feedback**: After presenting, note improvements for next time

---

*Presentation forge workflow complete!*
