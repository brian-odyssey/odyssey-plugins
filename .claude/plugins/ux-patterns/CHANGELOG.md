# Changelog

All notable changes to the ux-patterns plugin are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added since 0.1.0 initial scaffold
- 12 fitness-skill reference files authored via 3 waves of 4 parallel subagents (~35 min total wall time).
- 3,579 total lines across the skill (119 SKILL.md + 3,460 references).
- 86 real-world brand citations, all WebSearch-verified with `last_verified: 2026-04-15` tags. Zero known fabrications — every unverifiable citation was dropped or flagged.
- Regulatory grounding in `recurring-membership.md` and `package-credits.md` — FTC Click-to-Cancel, CA AB 2863, NY AG Equinox settlement, SoulCycle/ClassPass class-action precedent.
- Consistency pass across all 12 references: kebab-case for anti-pattern names, snake_case for measurable check names, peer-standard citation format (`### Brand` + bullet list), precedence rule numbers cited from SKILL.md.
- SKILL.md extended with approved "Regulatory context" structural exception for regulation-heavy patterns.

### In progress (next session or follow-up)
- Citation link check (all 144 unique brand URLs — currently running via curl)
- Local install smoke test via `claude --plugin-dir`
- SKILL.md routing test (auto-invocation on fitness pages)
- Dogfood on `/classes` page — must catch ≥5 of 8 target domain findings from the baseline measurement
- Publish to `brian-odyssey/odyssey-plugins` marketplace (copy + marketplace.json entry)

## [0.1.0] — 2026-04-15

Initial scaffold. Plugin manifest, dev marketplace, fitness skill SKILL.md, README, LICENSE.

### Added
- `.claude-plugin/plugin.json` — plugin manifest
- `.claude-plugin/marketplace.json` — dev marketplace for local `--plugin-dir` testing
- `skills/fitness/SKILL.md` — fitness vertical skill with 12-pattern index, decision tree, precedence rules, review protocol, generation protocol
- `skills/fitness/references/` — directory for the 12 pattern reference files (empty at initial scaffold)
- `README.md`, `LICENSE` (MIT), `CHANGELOG.md`

### Context
- Born out of [`workshop-2lf`](https://github.com/brian-odyssey/odyssey-plugins/issues) (beads).
- Design doc: `~/.gstack/projects/Odyssey-Mercantile-intension-pilates/brianlopez-main-design-ux-patterns-20260415-064713.md`.
- Baseline measurement passed 2026-04-15: generic `/gstack-design-review` on `/classes` caught 0-1 domain findings out of 8 target findings. Plugin value proven.
- Triumvirate review (Codex + Gemini + Claude subagent) surfaced citation-rot, dogfood-gameability, and effort-underestimation concerns. All mitigated in plan.
