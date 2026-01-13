# Presentation Forge

AI-powered presentation creation, validation, and refinement for Slidev-based presentations.

## Overview

This skill orchestrates a **5-phase workflow** designed through dual-AI strategic planning (Claude + Gemini). It follows an **AI-Assistant model** where the AI proposes changes and the user confirms, rather than auto-applying fixes.

## 5-Phase Workflow

### Phase 1: STRUCTURE
**Goal**: Generate a YAML outline for quick stakeholder approval before investing in full content generation.

**Process**:
1. Gather requirements (topic, audience, duration, key messages)
2. Generate a structured YAML outline with slide titles and bullet points
3. Present outline for user review and approval
4. Iterate until outline is approved

**Output**: Approved YAML outline file

### Phase 2: GENERATE
**Goal**: Transform the approved outline into full Slidev markdown.

**Process**:
1. Load appropriate template (stakeholder-briefing, technical-deep-dive, etc.)
2. Expand outline bullets into full slide content
3. Add Mermaid diagrams, code blocks, and visual elements
4. Apply theme and branding

**Output**: Complete slides.md file

### Phase 3: VALIDATE
**Goal**: Automated quality checks before human review.

**Process**:
1. Start Slidev dev server (`npx slidev --port 3030`)
2. Run overflow-check.js (Playwright DOM analysis)
3. Run accessibility-check.js (WCAG validation)
4. Check slide count against duration constraints (~2 min/slide)
5. Capture screenshots of any issues

**Output**: Validation report with identified issues

### Phase 4: REFINE
**Goal**: Iteratively improve based on validation and user feedback.

**Critical**: This phase follows the **AI-Assistant model**:
- AI **proposes** fixes with specific changes
- User **reviews and confirms** before applying
- NO auto-application of changes

**Process**:
1. Present validation issues with proposed fixes
2. Wait for user approval on each fix
3. Apply approved changes only
4. Re-run validation to confirm fixes
5. Accept user feedback and propose additional refinements

**Output**: Refined slides.md passing validation

### Phase 5: FINALIZE
**Goal**: Export all deliverables for the presentation.

**Process**:
1. Export PDF version (`npx slidev export`)
2. Generate speaker notes document
3. Create leave-behind materials (condensed handouts)
4. Package all artifacts

**Output**:
- slides.pdf
- speaker-notes.md
- leave-behind.pdf
- facilitation-guide.md (if applicable)

---

## Quick Start

```bash
# 1. Navigate to your project
cd ~/your-project/docs/presentations

# 2. Run the forge workflow
# (Claude will guide you through all 5 phases)
```

## Templates

| Template | Use Case |
|----------|----------|
| `stakeholder-briefing` | Executive presentations with approval checkpoints |
| `technical-deep-dive` | Developer audiences with code and diagrams |
| `_base` | Minimal starting point for custom presentations |

## Validators

| Validator | Purpose |
|-----------|---------|
| `overflow-check.js` | Detects content overflow via Playwright |
| `slide-crawler.js` | Systematic slide-by-slide analysis |
| `accessibility-check.js` | WCAG contrast and aria validation |

## Configuration

The skill can be configured via `skill.yaml`:

```yaml
config:
  defaultTemplate: stakeholder-briefing
  slidevPort: 3030
  validationTimeout: 30000
  maxSlidesPerDeck: 30
```

## Design Principles

1. **Structure First**: Get outline approval before full generation
2. **AI-Assistant Model**: AI proposes, human confirms
3. **Automated Validation**: Catch issues before human review
4. **Iterative Refinement**: Multiple passes until quality met
5. **Complete Deliverables**: Not just slides, but full presentation package

---

*This skill was designed using cf_plan strategic planning with dual-AI synthesis (Claude + Gemini).*
