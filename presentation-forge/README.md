# Presentation Forge

AI-powered Slidev presentation creation, validation, and refinement.

## Overview

Presentation Forge is a Claude Code skill that orchestrates the entire presentation lifecycle:

1. **STRUCTURE** - Generate and approve outline before content
2. **GENERATE** - Create full Slidev markdown from templates
3. **VALIDATE** - Automated overflow, accessibility, and timing checks
4. **REFINE** - Iterative improvement with AI-proposed fixes
5. **FINALIZE** - Export PDF, speaker notes, and leave-behinds

## Installation

```bash
# Clone or copy to your skills directory
cp -r presentation-forge ~/.claude/skills/

# Install dependencies (for validators)
cd ~/.claude/skills/presentation-forge
npm install
```

## Usage

### With Claude Code

Simply ask Claude to create a presentation:

```
Create a stakeholder briefing presentation about our Q1 results
```

Or invoke specific phases:

```
/forge:structure - Generate outline only
/forge:validate - Validate existing slides
/forge:refine - Refine based on feedback
```

### Templates

| Template | Use Case |
|----------|----------|
| `stakeholder-briefing` | Executive presentations with approval checkpoints |
| `technical-deep-dive` | Developer audiences with code and diagrams |
| `_base` | Minimal starting point |

### Validators

Run validators manually:

```bash
# Start Slidev server first
npx slidev slides.md --port 3030 &

# Run validators
node validators/overflow-check.js --url http://localhost:3030
node validators/slide-crawler.js --url http://localhost:3030
node validators/accessibility-check.js --url http://localhost:3030
```

## Design Philosophy

### AI-Assistant Model

The REFINE phase follows an **AI-Assistant** model, not AI-Automaton:

- AI **proposes** fixes with clear explanations
- User **reviews and confirms** before application
- No auto-applying changes without consent

This ensures presentations match presenter intent and brand requirements.

### Structure First

By generating a YAML outline before full slides:

- Faster iteration on structure (text vs. formatted slides)
- Early stakeholder alignment
- Clear approval checkpoint before content investment

### Automated Validation

Three validators catch issues before human review:

1. **overflow-check.js** - DOM-based overflow detection via Playwright
2. **slide-crawler.js** - Content density and timing analysis
3. **accessibility-check.js** - WCAG contrast and structure validation

## Configuration

Edit `skill.yaml` to customize:

```yaml
config:
  defaultTemplate: stakeholder-briefing
  slidevPort: 3030
  validationTimeout: 30000
  maxSlidesPerDeck: 30
```

## Development

### Adding Templates

1. Create new `.md` file in `templates/`
2. Use `{{VARIABLE}}` placeholders
3. Add entry to `skill.yaml` templates section

### Adding Validators

1. Create new `.js` file in `validators/`
2. Accept `--url` and `--output` arguments
3. Return exit code 0 (pass) or 1 (fail)
4. Add entry to `skill.yaml` validators section

## Examples

See `examples/resmark-stakeholder/` for a complete presentation created with this skill.

## Credits

Designed using dual-AI strategic planning (Claude + Gemini) via `cf_plan`.

---

**Version**: 1.0.0
**License**: MIT
