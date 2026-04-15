# Changelog

All notable changes to `project-update-router` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning follows [SemVer](https://semver.org/).

## [0.1.0] — 2026-04-15

Initial release. **Interpreter-mode** — skill guides Claude through the workflow manually; automated generators land in v0.2+.

### Added

- `skills/router/SKILL.md` — 8-phase routing workflow (P1–P13 premises, Phases 0–7 including 2.5 audience-reframing / 4.5 pre-publish validation / 6.5 deploy-protection-aware verification)
- Routing table with 9 rows + first-match + no-match-logged fallback
- Four content patterns (A foundation-vs-new-work, B still-open-vs-premises, C severity-tagged risks, D audience-relative asks)
- SVG diagram library (Pattern E) — 4 template slots (curve, matrix, flywheel, progress) referenced but not yet written
- `skills/router/references/decisions-log-seed.md` — Fulcrum partner-page pilot findings (pilot 001, 5 near-misses, 5 reusable patterns, recalibrated estimates)
- Fulcrum pilot worked example in SKILL.md

### Context

This plugin was migrated from a personal skill at `~/.claude/skills/project-update-router/` per the architectural reframe in `workshop-575` / `workshop-lvn` (2026-04-15). The reframe established that plugin-first-as-default is the correct shape for judgment-encoding skills — context-appropriate per-project installation matters more than one-global-skill-runs-anywhere convenience.

### Not yet

- Automated microsite generator (v0.2, planned)
- Automated long-form generator (v0.2, planned)
- Live auto-pull wiring for beads + git + gstack-learn (v0.2)
- `$D serve`-style localhost review UI with per-claim provenance badges (v0.3)
- Pre-publish validation hooks (v0.2)
- Deploy-protection-aware verification helper (v0.2)
- SVG diagram template files (v0.2)
- Per-project extension plugin pattern (tracked separately in `workshop-3ra`)
