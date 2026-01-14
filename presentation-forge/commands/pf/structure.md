# Phase 1: STRUCTURE

Generate a YAML outline for stakeholder approval before full content generation.

## Why Structure First?

The biggest time waste in presentation creation is iterating on fully-generated slides when the fundamental structure is wrong. By generating a lightweight YAML outline first:

1. **Faster iteration** - Text outline changes in seconds vs. reformatting slides
2. **Early alignment** - Catch structural issues before content investment
3. **Clear approval point** - Explicit go/no-go before Phase 2

## Process

### Step 1: Gather Requirements

Ask the user for:

```markdown
## Presentation Requirements

**Topic**: [What is this presentation about?]
**Audience**: [Who will be watching? Technical level?]
**Duration**: [How long? e.g., 30 minutes]
**Key Messages**: [3-5 things the audience MUST take away]
**Call to Action**: [What should audience do after?]
**Context**: [Any background, constraints, or sensitivities?]
```

### Step 2: Generate YAML Outline

Create a structured outline:

```yaml
# presentation-outline.yaml
title: "[Presentation Title]"
subtitle: "[Subtitle if applicable]"
author: "[Presenter name]"
date: "[Presentation date]"
duration_minutes: 30

sections:
  - name: "Opening"
    slides:
      - title: "Title Slide"
        type: cover
        notes: "Introduce yourself, set expectations"

      - title: "Agenda"
        type: toc
        items:
          - "Section 1 topic"
          - "Section 2 topic"
          - "Section 3 topic"
        notes: "3-minute overview"

  - name: "Section 1: [Name]"
    duration_minutes: 10
    slides:
      - title: "[Slide Title]"
        key_points:
          - "Point 1"
          - "Point 2"
        visual: "diagram|chart|screenshot|none"
        notes: "Speaker notes"

  - name: "Closing"
    slides:
      - title: "Summary"
        type: summary
        key_takeaways:
          - "Takeaway 1"
          - "Takeaway 2"

      - title: "Q&A"
        type: qa
        anticipated_questions:
          - "Question 1?"
          - "Question 2?"
```

### Step 3: Present for Approval

Show the outline to the user with:

```markdown
## Proposed Presentation Structure

**[Title]**

| Section | Slides | Duration | Key Content |
|---------|--------|----------|-------------|
| Opening | 2 | 3 min | Title, Agenda |
| Section 1 | 4 | 10 min | [Topics] |
| Section 2 | 5 | 12 min | [Topics] |
| Closing | 2 | 5 min | Summary, Q&A |
| **Total** | **13** | **30 min** | |

### Questions for Approval:
1. Does this structure cover all key messages?
2. Is the time allocation appropriate?
3. Any sections to add/remove/reorder?

**Ready to proceed to GENERATE phase?**
```

### Step 4: Iterate Until Approved

- Accept feedback and modify outline
- Re-present for approval
- Only proceed to Phase 2 (GENERATE) after explicit approval

## Output

- `presentation-outline.yaml` saved to project directory
- User approval documented in conversation

## Next Phase

Once outline is approved, proceed to [Phase 2: GENERATE](./generate.md)
