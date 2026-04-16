# Changelog

All notable changes to `project-update-router` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning follows [SemVer](https://semver.org/).

## [0.3.0] — 2026-04-16

**Singular plugin, installable anywhere, contextually dynamic.** v0.3.0 reverts the v0.2.0 Extension Consumer Protocol and ships a Project Context Read Protocol in its place. The plugin is one unit that reads each project's state at invocation time via probes; per-project refinements live as a flat `.claude/project-update.yaml` file in each project repo — not as per-project extension plugins.

### Removed

- **Extension Consumer Protocol (introduced in v0.2.0).** The pattern of shipping per-project plugin wrappers at `.claude/plugins/*-update/` is deprecated. The substance (audiences, handoffs, literacy blocklists, observed routing rows) migrates to `.claude/project-update.yaml` in each project repo.
- **Auto-pull Protocol's extension-scoping references.** Rewritten to reference Probe outputs instead of `audiences.yaml → project.*` fields.

### Added

- **Project Context Read Protocol** in SKILL.md — five probes run at Phase 0:
  - **Probe 1 — Identity.** Resolves slug / beads_prefix / git_repo / repo_path / subdir_for_app from `.claude/project-update.yaml`, gstack-slug, `git remote`, `.beads/`. Includes the gstack-slug-vs-git-remote collision rule + `repo_path_suffix` for monorepos.
  - **Probe 2 — Audiences + handoffs.** Reads `.claude/project-update.yaml → audiences:`.
  - **Probe 3 — Brand.** Reads `DESIGN.md` at repo root; content is a path reference, NOT parsed in v0.3.0.
  - **Probe 4 — Deploy infrastructure.** Four-level detection ladder (CLI-only / local dev only / Vercel preview / Vercel prod with custom domain).
  - **Probe 5 — Instance patterns + past updates.** Reads `.claude/project-update.yaml → instance_patterns:` + `~/.gstack/projects/<slug>/project-update-router/last-updates.jsonl` + `~/.gstack/projects/<slug>/updates/`.
- **Pattern Library** in SKILL.md — exactly two patterns with observed real instances:
  - `partner-update-hub-microsite` (reference: Fulcrum `/partner` 2026-04-15)
  - `self-retro-long-form` (reference: Fulcrum self-retro 2026-04-15)
  - **No stub patterns.** New patterns get added when an actual update needs them, proposed via `.claude/project-update-learnings.jsonl` with `applies_to: plugin`.
- **`skills/router/references/project-update-yaml-schema.md`** — full schema reference for `.claude/project-update.yaml`.
- **`skills/router/references/project-update-learnings-jsonl-schema.md`** — full schema reference for the optional `.claude/project-update-learnings.jsonl` companion file.
- **`bin/validate-project-update-yaml.py`** — advisory validator (Python stdlib only). Default mode validates `.claude/project-update.yaml`; `--learnings <path>` mode validates the jsonl companion. Checks:
  - `instance_patterns[].first_used` is a past date corresponding to a real archive artifact — surfaces `UNVERIFIED: <pattern> first_used=<date>` warnings when missing.
  - Audience / distribution / deploy_target / applies_to enum conformance.
  - Advisory only (exit 0 with stderr warnings). Not blocking.

### Changed

- **Phase 0** rewritten to run the five probes and synthesize a structured context object.
- **Phase 1** uses Probe 2's `default_distribution_by_audience` over base defaults; resolves named humans via Probe 2's audiences map.
- **Phase 2** checks Probe 5's `instance_patterns` before the shared routing table.
- **Phase 3** literacy filter seeded from Probe 2's `literacy_blocklist[<audience>]`.
- **Phase 6.5** `automation_bypass_env` now resolved from the matched pattern's `deploy.automation_bypass_env` field (env-var name only; value resolved at runtime from `~/.gstack/projects/<slug>/.env` or repo `.env.local`).
- **"Files & State"** section updated to document `.claude/project-update.yaml` + `.claude/project-update-learnings.jsonl` as the per-project context layer. `.claude/plugins/*-update/` is no longer part of the protocol.
- Version bump `0.2.0 → 0.3.0`.
- `plugin.json` description reflects the singular-plugin + probes shape.
- `marketplace.json` mirror updated.

### Deprecated

- **Per-project extension plugins** at `<project-repo>/.claude/plugins/*-update/`. Migrate via:
  1. Archive the plugin dir: `cp -R <plugin-dir> ~/.gstack/projects/<slug>/extension-archive/2026-04-16-pre-shape-revert/`
  2. Move substance (audiences, literacy_blocklist, observed routing rows) into `<project-repo>/.claude/project-update.yaml` per the schema reference.
  3. Delete the plugin dir: `rm -rf <project-repo>/.claude/plugins/<project>-update/`
  4. Drop invented / speculative routing rows; only migrate rows with a real past use date.
- Migration completed same-day for Fulcrum (`fulcrum-update`) and InTension (`intension-update`). Archives at `~/.gstack/projects/brian-odyssey-fulcrum-fitness/extension-archive/2026-04-16-pre-shape-revert/` and `~/.gstack/projects/brian-odyssey-intension-pilates/extension-archive/2026-04-16-pre-shape-revert/`.

### v0.4 commitment

v0.3.0 ships the **foundation** for an automated cross-project learning-promotion flywheel:

- Probes → consistent project-context read from disk
- `.claude/project-update.yaml` → flat config, version-controlled with the project
- `.claude/project-update-learnings.jsonl` → hand-edited learning log with `applies_to: project | plugin`

v0.4 will **close the flywheel**: automated query of all projects' learnings logs, surfacing `applies_to: plugin` entries as promotion candidates for router SKILL.md + Pattern Library edits. v0.3.0 is entirely manual — Brian reviews learnings and promotes by hand.

### Not yet (unchanged from v0.2.0)

- Automated microsite generator (v0.4+)
- Automated long-form generator (v0.4+)
- `$D serve`-style review UI (v0.4)
- SVG diagram template files (v0.4+)
- Pre-publish validation hooks (v0.4+)
- Deploy-protection-aware verification helper (v0.4+)
- Paperclip package integration (v0.3.1+ gated; trigger = Paperclip trial go-decision AND ≥1 update whose audience resolution would have benefited from Paperclip data)

### Context

v0.3.0 is a same-day reversal of v0.2.0's Extension Consumer Protocol. After two per-project extensions (`fulcrum-update`, `intension-update`) shipped on 2026-04-15, Brian audited the shape with "does this make sense?" and corrected the frame: the plugin is singular, installable anywhere, contextually dynamic. Per-project-extension-plugins were the wrong **unit**, not the wrong **size**. The reshape catches the wrong-shape error at N=2 instead of N=4+.

Design doc (approved, 9/10 after two review rounds): `~/.gstack/projects/brian-odyssey-workshop/brianlopez-main-design-20260416-070912.md`.

Tracking bead: `workshop-74w`.

## [0.2.0] — 2026-04-15

**Extension Consumer Protocol + Auto-pull Protocol** — still interpreter-mode, but now formally scoped. First consumer of the per-project extension plugin pattern (first instance: `fulcrum-update` shipped same day in `fulcrum-fitness`).

> **DEPRECATED as of v0.3.0** — the Extension Consumer Protocol is reverted. Substance migrates to `.claude/project-update.yaml` in each project repo. See v0.3.0 entry above.

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
