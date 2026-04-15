# ux-patterns

Domain UX pattern skills for Claude Code. Encodes vertical-specific UX conventions that generic design reviewers structurally cannot catch.

**v0.1.0 — fitness vertical (v1).** Hospitality, legal, SaaS, healthcare planned as sibling skills.

## What this plugin does

When loaded, this plugin teaches Claude to see domain-specific UX anti-patterns. It is cited by `/gstack-design-review` to catch issues a generic reviewer would miss ("red-at-80% capacity panic", "waitlist-without-count", "intro-offer-decoupled-from-booking") and loaded during UI generation to bake the right conventions in from the start.

It is a **lens, not a codegen tool** — the skill provides pattern libraries with anti-patterns, real-world citations, shadcn reference snippets, and measurable checks. Claude does the generation or review; this plugin just makes it domain-aware.

## Skills shipped in this plugin

| Skill | Vertical | Patterns |
|-------|----------|----------|
| `fitness` | Pilates, Lagree, barre, spin, CrossFit, yoga, wellness | 12 patterns (class booking, schedule grid, capacity signal, waitlist, instructor affinity, kiosk check-in, intro-offer funnel, package credits, multi-location, mobile-first, pricing tiers, recurring membership) |

## Install (once published to odyssey-plugins marketplace)

```bash
claude plugin marketplace add github:brian-odyssey/odyssey-plugins
claude plugin install ux-patterns@odyssey-plugins
```

## Local development

```bash
claude --plugin-dir ~/Workshop/claude-dev/plugins/ux-patterns
```

Uses the dev marketplace at `.claude-plugin/marketplace.json`.

## Directory layout

```
ux-patterns/
├── .claude-plugin/
│   ├── plugin.json            # plugin manifest
│   └── marketplace.json       # DEV marketplace (for local --plugin-dir testing)
├── skills/
│   └── fitness/
│       ├── SKILL.md           # skill index + routing + review/generation protocols
│       └── references/
│           ├── booking-flow.md
│           ├── capacity-signal.md
│           ├── schedule-grid.md
│           ├── waitlist-cancellation.md
│           ├── instructor-affinity.md
│           ├── intro-offer-funnel.md
│           ├── kiosk-checkin.md
│           ├── mobile-first-defaults.md
│           ├── multi-location-selection.md
│           ├── package-credits.md
│           ├── pricing-tier-presentation.md
│           └── recurring-membership.md
├── README.md
├── LICENSE                    # MIT
└── CHANGELOG.md
```

## How this gets used in practice

**During a design review:**
```
Claude, run /gstack-design-review on http://localhost:3000/classes
  → Claude's skill auto-router loads the `fitness` skill from ux-patterns
  → Skill's review protocol identifies schedule + capacity + waitlist surface
  → Loads references/schedule-grid.md, capacity-signal.md, waitlist-cancellation.md
  → Evaluates the page against each reference's anti-patterns + checks
  → Reports findings in the four-attribute format (pattern, anti-pattern, citation, file:line)
```

**During UI generation:**
```
"Build a class booking card for InTension's intro pack"
  → Claude loads the fitness skill + frontend-design skill
  → Skill's generation protocol reads booking-flow.md + intro-offer-funnel.md
  → Anti-patterns become negative constraints during generation
  → Reference shadcn snippets become starting templates
  → Output respects fitness-domain conventions (urgency language, waitlist UX, founder affinity, etc.)
```

## Success criteria

A `/gstack-design-review` run with this plugin loaded should catch at least 3 domain-specific findings on any fitness studio page that a generic reviewer (without this plugin) would miss. Each finding must cite:
1. The pattern reference (e.g. `capacity-signal.md`)
2. The anti-pattern name (e.g. `red-at-80%`)
3. A real-world brand from the references' citations
4. A file:line in the target project

Findings that cannot be cited by all four attributes are generic, not domain, and do not count toward the threshold.

## License

MIT. Use freely in commercial and open-source projects.

## Contributing

This is a v1. Pattern contributions, citation refreshes, and new verticals are welcome once the fitness skill stabilizes. Open an issue at https://github.com/brian-odyssey/odyssey-plugins first so we can align on scope.
