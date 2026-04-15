# Changelog

All notable changes to `project-update-router` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning follows [SemVer](https://semver.org/).

## [0.2.0] — 2026-04-15

**Extension Consumer Protocol + Auto-pull Protocol** — still interpreter-mode, but now formally scoped. First consumer of the per-project extension plugin pattern (first instance: `fulcrum-update` shipped same day in `fulcrum-fitness`).

### Added

- **Extension Consumer Protocol section** in SKILL.md: discovery (scan `cwd` for `.claude/plugins/*-update/config/`), validation (keyword `extends:project-update-router`), config schema (field-by-field: which phase consumes which path in `audiences.yaml` / `brand.yaml` / `routing-overrides.yaml`), load order (shared defaults → extension → user response).
- **Auto-pull Protocol section** in SKILL.md: 4 sources (beads, git log, gstack learnings, gstack design docs) with scoping rules keyed off extension's `project.{slug, beads_prefix, git_repo, repo_path}` fields. Missing extension → fall back to auto-detection + user prompts.
- **Phase 0 update**: extension discovery step appended after project detection.
- **Phase 1 update**: named-human audience resolution via extension `people.<key>.audience` map; `default_distribution_by_audience` overrides shared defaults.
- **Phase 2 update**: extension `routing-overrides.yaml` checked before shared routing table, first-match semantics preserved within overrides.
- **Phase 3 update**: literacy blocklist seeded from extension `blocklist_tokens_for_audience[<audience>]`.

### Changed

- Version bump `0.1.0 → 0.2.0`.
- `plugin.json` description reflects new protocols.

### Not yet (unchanged)

- Automated microsite generator (now v0.3+, was v0.2)
- Automated long-form generator (v0.3+)
- `$D serve`-style review UI (v0.4)
- SVG diagram template files (v0.3+)
- Pre-publish validation hooks (v0.3+)
- Deploy-protection-aware verification helper (v0.3+)
- Brand-token drift detection between `brand.yaml` and project's `DESIGN.md` (v0.3+)

### Context

v0.2.0 closes the risk flagged in the 2026-04-15 Fulcrum self-retro: *"router v0.2+ must actually consume extension configs or they become orphaned docs."* The Extension Consumer Protocol is the formal contract that `fulcrum-update` (and its future Resmark / InTension / Odyssey siblings) can rely on. Interpreter-mode means Claude executes the protocols directly from SKILL.md — no compiled code yet, but the contract is specified with enough precision that v0.3 generators can implement against it.

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
