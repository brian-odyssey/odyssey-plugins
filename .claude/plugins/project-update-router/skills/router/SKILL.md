---
name: project-update-router
description: When the user needs to write or ship a project update (partner sync, client status, architecture walkthrough, strategic-pivot note, retrospective, investor update). Routes to the right artifact format (interactive microsite, long-form doc, Slidev, dashboard, playground, hybrid PPTX) based on audience + distribution + content-shape + sensitivity, then scaffolds content from beads + git log + gstack learnings. Replaces the default PPTX-for-everything muscle memory.
related: [board-update, web-artifacts-builder, presentation-forge, playground, frontend-design]
reads: [beads, git, gstack-learnings, project-update-yaml]
---

# Project Update Router

## When to Use

Activate whenever the user says any of:

- "write the [Fulcrum / Resmark / InTension / Odyssey / …] update"
- "draft a partner update / client status / board update / investor update"
- "I need to send [named person] / my partner / the team a note on where [project] is"
- "architecture walkthrough", "retrospective", "strategic pivot note"
- "turn this into a deck / one-pager / microsite"

**Do NOT** activate for:

- Single-issue status comments (use `bd update <id> --notes`)
- Git commit messages (use `/commit`)
- Blog posts / marketing copy (no routing logic — just write)

## Core Premise

**PPTX is not the default.** Format is a function of audience + distribution + content-shape + sensitivity. The skill runs the routing, surfaces the reasoning, and scaffolds the first draft from real project signals so the human edits instead of starts cold.

**One plugin, installable anywhere, contextually dynamic.** The router is a single plugin on `odyssey-plugins`. It reads each project's state at invocation time (CLAUDE.md, DESIGN.md, `.beads/`, `.claude/project-update.yaml`, live filesystem probes) to tailor output to that project. Project-local refinements (audiences, literacy blocklist, observed pattern instances) live **with the project** in `.claude/project-update.yaml`, version-controlled alongside the code they describe. Cross-project learnings **promote back into this plugin**.

Thirteen premises govern behavior:

| # | Premise | Status |
|---|---------|--------|
| P1 | PPTX-as-default is wrong for systems/AI/tooling updates | AGREED |
| P2 | Format is routable from 4 inputs (audience, distribution, content-shape, sensitivity) | AGREED |
| P3 | Auto-pull from beads/git/learnings compounds value | AGREED |
| P4 | Single-user v1, no plugin packaging | SUPERSEDED — plugin-first as of v0.1.0 |
| P5 | Hybrid path is a thin coordinator, delegates to `board-update` | AGREED |
| P6 | N=1 is enough to ship, re-examine routing table after 3+ uses | FLAGGED |
| P7 | v1 ships TWO generators (microsite + long-form); rest v2 | AGREED |
| P8 | Sensitivity is a policy boundary — filters auto-pull BEFORE generation | AGREED |
| P9 | When sources disagree, surface both with source tags; never auto-resolve | AGREED |
| P10 | Every scaffolded claim carries a provenance badge (bead/SHA/learning-key) | AGREED |
| P11 | Iteration (5–10 edit cycles) is the unit of work, not publish | AGREED |
| P12 | Content quality outranks format routing (~30s vs hours) | AGREED |
| P13 | Audience-literacy filter is distinct from privacy filter | AGREED |

## Context Required

**From the user (collected at invocation, 5 inputs):**

| Input | Values |
|-------|--------|
| **project** | slug (resolved by Probe 1 — see Project Context Read Protocol; confirm if ambiguous; multi-select if multi-repo) |
| **audience** | `self`, `partner`, `internal`, `investor`, `trainer`, `client`, `public` |
| **distribution** | `link-shareable`, `attach-to-email`, `present-live`, `archival` |
| **content-shape** | `architecture`, `demo`, `metrics`, `process`, `status`, `strategic-pivot`, `technical-walkthrough`, `retrospective` |
| **sensitivity** | `public`, `unlisted`, `password`, `private-local` |

Use `AskUserQuestion` with `multiSelect: true` for audience (can be `partner + self`) and never single-select unless truly mutually exclusive.

**From the environment (resolved by Probe Protocol — see Project Context Read Protocol below):**

- Probe 1 — Identity (slug, beads prefix, repo paths)
- Probe 2 — Audiences + handoffs (from `.claude/project-update.yaml`)
- Probe 3 — Brand (path reference to `DESIGN.md`)
- Probe 4 — Deploy infrastructure (4-level detection ladder)
- Probe 5 — Instance patterns + past updates

Each probe returns structured data; missing data → user prompt, never a crash.

## Workflow

The skill runs as a numbered phase machine. Phases 2.5 / 4.5 / 6.5 are insertions from the Fulcrum pilot — skip them and you re-hit a near-miss.

### Phase 0 — Run Probe Protocol, synthesize project context

Execute the five probes documented in **Project Context Read Protocol** (below). Output: a structured context object with `{identity, audiences, brand_source_path, deploy_pathways, instance_patterns, last_updates}`. Surface probe results to the user before proceeding. Flag ambiguities (e.g., gstack slug ≠ git remote slug) and ask for confirmation only when probes can't resolve.

If `.claude/project-update.yaml` has `instance_patterns` entries, run `bin/validate-project-update-yaml.py` on the file; surface any `UNVERIFIED` warnings before proceeding.

### Phase 1 — Collect 4 routing inputs

Ask via `AskUserQuestion`. Defaults:

- Base defaults: `link-shareable` for `partner`/`client` audiences; `archival` for `self`/`internal`; `attach-to-email` for `investor`.
- **Probe 2 overrides base defaults** via `default_distribution_by_audience` in `.claude/project-update.yaml`.
- When the user names a human ("update for Adam"), resolve via Probe 2's `audiences.<key>.audience` map rather than asking — but always confirm the resolved audience back before proceeding.

### Phase 2 — Resolve route

**Probe 5 overrides checked first.** If a pattern in `instance_patterns` matches the requested audience + content-shape, use its deploy config and skip the shared table below. Otherwise fall through to the routing table.

Match against the routing table below. **First match wins.** If no row matches, fall back to `long-form-doc` and append a row to `~/.gstack/projects/<project-slug>/project-update-router/decisions-log.md` (user-state, append-only per-project log — NOT the plugin's immutable seed at `references/decisions-log-seed.md`) with `{timestamp, inputs, fallback_taken, instance_pattern_matched}`. Print the matched row + reasoning to the user before proceeding (include whether match came from an instance pattern or the shared table).

### Phase 2.5 — Audience-relative reframing (from pilot)

Before any scaffold assembly, answer three prompts out loud:

1. **What does this audience already know?** → strip re-statement of known facts.
2. **What are they being asked to do?** → front-load the ask.
3. **What would they misunderstand if shown raw?** → flag terms + frame build-state.

This is a comprehension check, NOT a privacy check.

### Phase 3 — Auto-pull, sensitivity-filtered and literacy-filtered

Run auto-pull commands scoped to the project per the **Auto-pull Protocol** below. Before content lands in the scaffold, run two filters:

- **Sensitivity (P8):** If `sensitivity ∈ {public, password}`, exclude beads/learnings without `share:external` marker. Default assumption is internal — err toward excluding.
- **Audience-literacy (P13):** Run sources through a token filter seeded from Probe 2's `literacy_blocklist[<audience>]` (project-specific jargon like `Mentat`, `voice-agent`, `Megaformer`, `INP-*` ID forms). Augment — don't replace — with any tokens the filter surfaces. Surface flagged tokens to user for rewrite or removal.

Each surviving claim gets a **provenance badge** (bead ID, commit SHA, or learning key) that persists into the review surface.

### Phase 4 — Conflict surfacing (P9)

If two sources contradict each other on the same section (e.g., bead says "in progress" but latest commit closes it; or design doc has `Supersedes:` chain; or same-day revisions disagree), render **both** in the scaffold with source tags:

```
[from bead-575] wedge = existing pairs only
[from design-doc 2026-04-14 midnight rev] wedge includes discovery AND reinforcement
→ RESOLVE BEFORE PUBLISH
```

Never auto-merge. The Fulcrum pilot confirmed: design doc self-contradiction is a real class, not hypothetical.

### Phase 4.5 — Pre-publish validation (from pilot)

For web-based generator output, hard-gate:

- `npx tsc --noEmit` (TS projects)
- `npm run lint` (if script exists)
- `npm run build` (framework-specific dry run)

No push with errors. Pilot missed a TS `as const` tuple narrowing, cost 18s Vercel build + retry.

### Phase 5 — Review surface (iteration-first, P11)

Write the scaffold to `/tmp/project-update-<slug>-<ts>.md` and open in `$EDITOR`. Fallback if `$EDITOR` unset: write to the path and instruct user to edit manually.

**For microsite updates** (v1.1+), use the `$D serve` pattern from `~/.claude/skills/gstack/design/src/serve.ts`:

- Localhost HTTP server serving the scaffold rendered as a form
- Per-claim provenance badges with a "suppress this source from this run" toggle (seeds v2 suppression-rules — see `workshop-gaw`)
- POST back on submit; stay alive across regeneration rounds
- State machine: `SERVING → (submit) → DONE` or `SERVING → (regen) → RELOADING → SERVING`

Assume 5–10 edit cycles. Preserve state across re-entry.

### Phase 6 — Route-destination prompt (for web generators)

Ask: **new sub-route** (non-destructive) / **overwrite** (destructive) / **refactor-to-index** (ambitious).

If `overwrite`, auto-archive prior content to `~/.gstack/projects/<slug>/updates/<timestamp>-archive.<ext>` BEFORE writing. Fulcrum pilot destroyed the prior `/partner` page (Apr-2 hub) with no archive — recoverable only via git.

### Phase 6.5 — Deploy-protection-aware verification (from pilot)

After push, check response headers:

- If `x-vercel-challenge-token` or `x-vercel-mitigated: challenge` is present, look for the env var named by the pattern's `deploy.automation_bypass_env` (default: `VERCEL_AUTOMATION_BYPASS_SECRET`) in `~/.gstack/projects/<slug>/.env` or repo `.env.local` and retry with headers `x-vercel-protection-bypass: <secret>` + `x-vercel-set-bypass-cookie: true`.
- If no secret available, fall back to `vercel ls` build-status check — don't assume 403 == failure.

Fulcrum pilot burned 40min on 403 Security Checkpoint pages before wiring the bypass secret.

### Phase 7 — Handoff

Output exactly one concrete line: **"Your update is at `<URL>` / `<path>`. Next step: `<paste-target>`."** Also append a row to `last-updates.jsonl`: `{project, audience, timestamp, format, url}`.

**Optional dogfood loop (v0.3.0 manual):** prompt the user to hand-append a learning entry to `.claude/project-update-learnings.jsonl` (schema in references). Router does NOT auto-write in v0.3.0. See v0.4 commitment in CHANGELOG.

## Project Context Read Protocol

**Replaces** the v0.2.0 Extension Consumer Protocol (reverted — see CHANGELOG migration note). The plugin is singular and contextually dynamic. At invocation it runs **five probes** to read project state from conventional locations on disk. No per-project extension plugin needed; project-local data lives in `.claude/project-update.yaml` at the project's repo root.

### Probe 1 — Identity

Resolves project slug, beads prefix, git remote, repo path, monorepo subdir.

**Reads, in order of priority:**

1. `.claude/project-update.yaml → project.slug` — **authoritative override** if present.
2. `~/.gstack/sessions` via the `gstack-slug` helper, or the `SLUG` environment variable if set.
3. `git remote -v` → parse owner/repo for the git-remote-derived name.
4. `.beads/*.db` filename, or `ls .beads/` output, for the beads prefix.

**Outputs:** `{slug, beads_prefix, git_repo, repo_path, subdir_for_app}`.

**Collision rule.** gstack slug and git-remote-derived name frequently differ (e.g., gstack slug `brian-odyssey-fulcrum-fitness` vs git remote `Odyssey-Mercantile/fulcrum-fitness`). Router uses:
- **gstack slug** for `~/.gstack/projects/<slug>/` paths
- **git-remote slug** for repo-level operations

`.claude/project-update.yaml → project.slug` overrides the gstack-slug detection only.

`subdir_for_app` is set from `.claude/project-update.yaml → project.repo_path_suffix` (e.g., `platform` for `intension-pilates`'s Next.js app living in `platform/` subdir). Probe 4 looks in this subdir for `package.json` / `vercel.json`.

### Probe 2 — Audiences + handoffs

Reads `.claude/project-update.yaml → audiences:`.

**Outputs:** list of `{key, audience_enum, role, handoff, context_notes, disambiguation}` plus `default_distribution_by_audience` and `literacy_blocklist` maps.

**Missing file or missing `audiences:` key** → empty list. Router prompts user to name audiences interactively for this update.

Phase 1 ("update for Adam") resolves via the `audiences.<key>.audience` map; Phase 3 (literacy filter) is seeded from `literacy_blocklist[<audience>]`; Phase 7 (handoff) uses `audiences.<key>.handoff.template`.

### Probe 3 — Brand

Reads **`DESIGN.md` at repo root** (or at `project.repo_path_suffix` if a monorepo).

**Outputs:** `{brand_source_path}` — a path reference only. Content is **NOT parsed** in v0.3.0. Generators that need brand tokens read DESIGN.md directly at generation time.

**Missing DESIGN.md** → `brand_source_path: null`, router notes "no brand source" and generator uses framework defaults. Project-specific anti-slop reminders from `.claude/project-update.yaml → anti_slop_supplement` augment the brand pass.

### Probe 4 — Deploy infrastructure

Four-level detection ladder. Router reports detected `deploy_pathways` to user and asks to pick when multiple apply.

**Level 1 — CLI-only / no web app.**
- Triggers: no `package.json`, OR no `next.config.*` and no `vercel.json`.
- Output: `deploy_pathways: [local-file-only, obsidian]`.
- Microsite patterns become unavailable; router recommends `long-form-doc`.

**Level 2 — Local dev only.**
- Triggers: `package.json → scripts.dev` exists; no `vercel.json`, no `.vercel/project.json`.
- Output: `deploy_pathways: [local-spin-up]` with the dev command + port parsed from `scripts.dev`.

**Level 3 — Vercel preview available.**
- Triggers: `vercel.json` OR `.vercel/project.json` exists, but no custom domain (`vercel.json → alias` empty, no `project.production_domain` in yaml).
- Output: `deploy_pathways: [local-spin-up, vercel-preview-unlisted]`.
- Bypass secret availability checked via `VERCEL_AUTOMATION_BYPASS_SECRET` (or env var named by the matched pattern's `deploy.automation_bypass_env`) in `~/.gstack/projects/<slug>/.env` or repo `.env.local`.

**Level 4 — Vercel production with custom domain.**
- Triggers: `.vercel/project.json` + custom domain in Vercel config, OR `project.production_domain` explicitly set in `.claude/project-update.yaml`.
- Output: `deploy_pathways: [local-spin-up, vercel-preview-unlisted, vercel-prod-secure-route]`.

**Monorepo note.** If Probe 1 resolved `subdir_for_app`, Probe 4 looks for `package.json` / `vercel.json` inside that subdir (e.g., `intension-pilates/platform/package.json`).

### Probe 5 — Instance patterns + past updates

Reads `.claude/project-update.yaml → instance_patterns:` for known pattern-to-deployment mappings.
Reads `~/.gstack/projects/<slug>/project-update-router/last-updates.jsonl` for prior update timestamps.
Reads `~/.gstack/projects/<slug>/updates/` directory for archived artifacts (freshness-window computation).

**Outputs:** `{known_patterns_for_project, last_update_dates_by_audience, archive_base_path}`.

Phase 2 consults this before the shared routing table. Phase 3 uses `last_update_dates_by_audience` for the `git log --since=<window>` diff.

`bin/validate-project-update-yaml.py` runs during Probe 5 and surfaces any `UNVERIFIED: <pattern> first_used=<date> has no corresponding update artifact.` warnings — advisory only, does not block.

### Load order summary

1. Built-in router defaults (this SKILL.md)
2. Probe outputs (Probes 1–5)
3. User response at invocation (highest priority)

**No extension-plugin layer.** `.claude/plugins/*-update/` is **not scanned.** If any such directory exists, it is residue from the v0.2.0 Extension Consumer Protocol and should be migrated per the CHANGELOG v0.3.0 deprecation note, then deleted.

## Pattern Library

Patterns are first-class, generic shapes that the router instantiates per project via Probe outputs + `.claude/project-update.yaml → instance_patterns:`. v0.3.0 ships **exactly the two patterns with observed real instances**.

**No stub patterns.** New patterns get added when an actual update needs them — not before. Declaring speculative patterns in SKILL.md is the failure mode the v0.3.0 reshape corrects.

### Pattern 1 — `partner-update-hub-microsite`

**Shape** (content sections in order):

1. Hero (project name + tagline + date stamp)
2. Thesis prose (2–4 paragraphs, verbatim from latest approved design doc or user draft)
3. Interactive diagram (SVG — Pattern E: flywheel / matrix / curve / progress)
4. Foundation-vs-new-work (Pattern A — emerald shipped, amber not-started, "YOU ARE HERE" boundary)
5. Premises (AGREED) vs Still open (Pattern B split)
6. Risks with severity (Pattern C)
7. Asks (Pattern D — numbered, named, deadlined)

**Generator:** `document-skills:web-artifacts-builder` + `vercel:deploy`.

**Deployment-probe strategy:**

- Probe 4 returns `deploy_pathways`.
- If `vercel-prod-secure-route` available AND `.claude/project-update.yaml → instance_patterns` has a prior `partner-update-hub-microsite` entry with matching `deploy.target`, reuse that instance (same route, same archive dir, same bypass env).
- If only `vercel-preview-unlisted` available, deploy to preview with `noindex` header.
- If only `local-spin-up` available, run locally and hand the URL to the user to share via tunnel (e.g., `ngrok`, `tailscale funnel`).

**Expected `instance_patterns` fields** (when project has used this pattern before):

```yaml
- pattern: partner-update-hub-microsite
  first_used: YYYY-MM-DD
  last_used: YYYY-MM-DD
  use_count: <int>
  deploy:
    target: vercel-prod-secure-route | vercel-preview-unlisted | local-spin-up
    production_url: <url>
    route: <path>
    repo_path: <abs-path>
    app: next-existing | next-scaffold
    write_mode: overwrite-with-archive | new-subroute
    archive_dir: <path>
    archive_filename_pattern: "{timestamp}-archive.tsx"
    sensitivity_default: unlisted
    automation_bypass_env: <env var name>
  handoff_template: <str>
```

**Reference implementation:** Fulcrum `/partner` shipped 2026-04-15 to `https://fulcrum-fitness.vercel.app/partner`. That deployed artifact is the canonical instance this pattern's documentation references. Do not regenerate — the artifact is fine; the path that produced it is what's formalized here.

### Pattern 2 — `self-retro-long-form`

**Shape** (content sections in order):

1. Header (project + date + content-shape subtitle)
2. TL;DR (3 sentences max)
3. What shipped (from git log + Pattern A emerald framing)
4. What's next (from beads + Pattern A amber framing)
5. Decisions / lessons (from gstack learnings, literacy-filtered)
6. Premises (AGREED) vs Still open (Pattern B)
7. Risks (Pattern C) and Asks (Pattern D — typically self-asks here)

**Generator:** `obsidian-cli create` + mirror to `gstack-updates-dir`.

**Deployment-probe strategy:**

- Always Level 1 / Level 2 — no web deploy required.
- Writes to Obsidian vault folder specified in `instance_patterns.<entry>.deploy.vault_folder` (default: `Compiled/<Project>-Retros/`).
- Also archives to `~/.gstack/projects/<slug>/updates/<date>-<content_shape>.md`.

**Expected `instance_patterns` fields:**

```yaml
- pattern: self-retro-long-form
  first_used: YYYY-MM-DD
  last_used: YYYY-MM-DD
  use_count: <int>
  deploy:
    target: obsidian
    vault: ObsidianVault
    vault_folder: Compiled/<Project>-Retros
    filename_pattern: "{date}-{content_shape}.md"
    also_archive_to: ~/.gstack/projects/<slug>/updates/
```

**Reference implementation:** Fulcrum self-retro at `ObsidianVault/Compiled/Fulcrum-Retros/2026-04-15-retrospective.md`, mirrored to `~/.gstack/projects/brian-odyssey-fulcrum-fitness/updates/2026-04-15T00-self-retro.md`.

### Patterns NOT shipped in v0.3.0

- `staff-announcement`
- `location-launch-page`
- `investor-update-hybrid`
- `technical-walkthrough`
- `hybrid-pptx-plus-artifacts`
- `trainer-conversation-prep-page`

All were declared or speculated in earlier iterations without a real instance. They'll be added when an actual update needs one. If you find yourself writing one of these from scratch, note the instance in the project's `.claude/project-update.yaml → instance_patterns:` with a real `first_used` date, then propose the pattern for promotion into this SKILL.md in the project's `.claude/project-update-learnings.jsonl` with `applies_to: plugin`.

## Routing Table

First-match semantics. `sensitivity` does NOT change format — it changes deploy target (e.g., `unlisted` → Vercel with `noindex`, `private-local` → local preview only).

| audience | distribution | content-shape | → format | generator |
|----------|--------------|---------------|----------|-----------|
| `partner`, `client` | `link-shareable` | `strategic-pivot`, `architecture`, `status`, `technical-walkthrough` | **microsite** (Pattern: `partner-update-hub-microsite`) | `document-skills:web-artifacts-builder` + `vercel:deploy` |
| `self`, `internal` | `archival` | any | **long-form-doc** (Pattern: `self-retro-long-form` when `retrospective`) | `obsidian-cli create` |
| `internal` | `link-shareable` | `retrospective`, `status` | **long-form-doc** | `obsidian-cli create` (shared vault) |
| `investor` | `attach-to-email` | any | **hybrid** (v2 — not shipped) | `board-update` + `web-artifacts-builder` |
| `investor`, `internal` | `present-live` | `technical-walkthrough`, `demo` | **Slidev** (v2 — not shipped) | `presentation-forge` |
| `internal`, `partner` | `link-shareable` | `metrics` | **shadcn dashboard** (v2 — not shipped) | `frontend-design` + `vercel:deploy` |
| `internal`, `trainer` | `link-shareable` | `process` | **playground** (v2 — not shipped) | `playground:playground` |
| `public` | `link-shareable` | any | **microsite** or **long-form-doc** (depends on content depth) | per content |
| *(no match)* | — | — | **long-form-doc** + log miss | `obsidian-cli` + append `DECISIONS-LOG.md` |

**v0.3.0 patterns with real instances:** `partner-update-hub-microsite`, `self-retro-long-form`.
**v2 format slots deferred** (build when a real update demands it, promote via learnings log): hybrid, Slidev, shadcn dashboard, playground.

**Pilot reference row (Fulcrum, 2026-04-15):** `audience=[partner, self] + distribution=link-shareable + content-shape=strategic-pivot + sensitivity=unlisted → microsite`. Deployed to Vercel unlisted URL via existing Next.js app at `/partner`.

## Content Patterns

These run as post-processors on scaffolded content, regardless of format.

### Pattern A — Foundation-vs-new-work block

**Trigger:** project has BOTH shipped commits AND open roadmap items.
**Generates:** two blocks + a progress bar.

- **Foundation — shipped** (emerald): items marked Complete, framed as *reused*.
- **Real build ahead — [scope estimate]** (amber): items with rough scope, framed as *not started*.
- **Visual:** horizontal progress bar with "YOU ARE HERE" marker at the boundary.

Prevents NM-1 from Fulcrum pilot (git log made it look 80% shipped when only scaffolding was done).

### Pattern B — "Still open" vs "Premises"

**Trigger:** source material has both committed decisions AND open decisions.
**Generates:** two separate blocks.

- **Premises:** load-bearing bets, each AGREED or status-tagged.
- **Still open:** decisions NOT yet committed, each with context on what they block.

Prevents papering over uncertainty as premise. Pilot surfaced this when a premise ("wedge = existing pairs") couldn't be defended because source material had superseded itself.

### Pattern C — Severity-tagged risks

**Trigger:** Risks section has 3+ items.
**Generates:** each risk gets `high | med | low`, colored left-edge bar, corner severity tag, `→` mitigation.

Flat lists all read equally. Severity forces prioritization.

### Pattern D — Audience-relative asks

**Trigger:** audience includes a named decision-maker (partner, investor, manager).
**Generates:** numbered asks in priority order with specific language.

> ✅ "Name three trainers by Friday"
> ❌ "Help recruit trainers"

Updates without specific asks read as informational and don't drive action.

## SVG Diagram Library (Pattern E)

The microsite generator auto-proposes a diagram template based on content shape. All four are parameterized SVG; live in the plugin at `skills/router/references/templates/svg/` (installed path under the Claude plugins cache; resolve at runtime relative to this SKILL.md).

| Trigger | Template | File | Rationale |
|---------|----------|------|-----------|
| Compounding / growth narrative | Curve + flat dashed competitor | `curve.svg` | Shows gap vs. cold-match competitors over time |
| Competitive positioning | 2×2 matrix, thesis quadrant highlighted | `matrix.svg` | "Every failure lived on one side of this grid" in one glance |
| Multi-layer flow / system | Nodes + arrows + glowing hub + feedback loop | `flywheel.svg` | Concrete mechanism, not metaphor |
| Status / build state | Segmented progress bar + "YOU ARE HERE" | `progress.svg` | Forces foundation-vs-new-work framing (Pattern A's visual) |

Each template exports a single function `render(params) → string` for injection into microsite HTML. v1 can hand-build these; v2 parameterizes further.

## Output Format

### Microsite

Next.js app (reuse existing project app if present, e.g., `fulcrum-fitness.vercel.app`) at a chosen route. Sections laid out per content-shape:

- `strategic-pivot`: timeline → new-thesis-prose → interactive diagram → premises (Pattern B) → still-open → asks (Pattern D)
- `status`: foundation-vs-new-work (Pattern A) → progress bar → asks
- `architecture`: interactive diagram (Pattern E flywheel or nodes) → component breakdown → decisions made → open questions
- `technical-walkthrough`: diagram → narrative per layer → code links → risks (Pattern C)

Deploy: `vercel:deploy` → unlisted URL with `noindex` headers (sensitivity `unlisted`) OR local preview (`private-local`). Deploy pathway is picked from Probe 4's output.

### Long-form doc

Markdown, written via `obsidian-cli create name="<project>-update-<ts>" vault="ObsidianVault"`. Sections:

```
# <Project> update — <date>

## TL;DR
<3 sentences: current state, major event, next direction>

## What shipped
<from git log + provenance badges>

## What's next
<from beads + foundation-vs-new-work if applicable>

## Decisions / lessons
<from gstack learnings, literacy-filtered>

## Premises (AGREED) / Still open (Pattern B split)
## Risks (Pattern C severity-tagged)
## Asks (Pattern D — numbered + specific)
```

### Handoff (every format)

```
Your update is at <URL | path>.
Next step: paste into <email | Slack DM | shared vault | calendar invite pre-read>.
Archived prior version (if overwrite): <archive path>.
Logged: last-updates.jsonl row added.
```

## Frameworks & Best Practices

### The 5-input routing decision

Format = f(audience, distribution, content-shape, sensitivity) with project as a side input that influences auto-pull scope and deploy target. When any of the four is ambiguous, ASK. Don't guess.

### The iteration budget

Estimate 2–3 hours per update post-skill. A 45-min one-shot is a fantasy (P11). Review UI must survive 5–10 cycles; state persistence is not optional.

### The two filters (P8 + P13)

Before generation:

1. **Sensitivity (privacy):** Can this audience SEE this data?
2. **Audience-literacy (comprehension):** Will this audience UNDERSTAND this term?

Both. Always. They run on the same sources and produce different cuts.

### Conflict surfacing (P9)

When sources disagree, render both. Never auto-merge. The skill surfaces; the human resolves. Applies to: bead-vs-git status drift, design doc `Supersedes:` chains, same-day revisions, bead notes vs. learnings.

### Foundation-vs-new-work framing

Default-on for any in-flight project. Auto-pull *always* overstates progress — git log looks like product, when it's usually scaffolding. Pattern A is the counterweight.

### Observed-vs-speculative discipline

Every `instance_patterns:` entry in `.claude/project-update.yaml` MUST have a `first_used:` date corresponding to a real past update. `bin/validate-project-update-yaml.py` cross-checks these against `~/.gstack/projects/<slug>/updates/` + `last-updates.jsonl` archives. A speculative entry surfaces as an `UNVERIFIED:` warning. Do not stuff `instance_patterns` with "what we might do" — only with "what we have done."

### No-match → extend the table via learnings log, not stubs

The routing table will be wrong sometimes. When it is, the skill falls back to `long-form-doc` and logs the miss. After 3 misses with the same shape, add a row. After 3+ successful uses, re-examine the whole table (P6). New patterns are proposed via a learnings-log entry with `applies_to: plugin` — not by declaring stubs in SKILL.md.

## Common Mistakes

1. **Defaulting to PPTX because that's what you always send** — that's the muscle memory this skill exists to break.
2. **Skipping Phase 2.5** (audience-relative reframing) — leads to internal shorthand in partner docs (NM-2).
3. **Treating auto-pull as ground truth** — git log implies shipped features; Pattern A corrects for it.
4. **Letting the source material's self-contradictions pick a side for you** — Phase 4 surfaces them, you choose.
5. **One-shot publish** — real updates iterate 5–10 times. Design the review loop for that, not for "submit and done."
6. **Verification based on HTTP 200** — 403 Security Checkpoint is a false negative without deploy-protection awareness (Phase 6.5).
7. **Overwriting without archive** — destructive route-destination choices need auto-archive to `~/.gstack/projects/<slug>/updates/`.
8. **Asks without names** — "help recruit" vs. "name three trainers by Friday" — the latter drives action.
9. **Re-introducing per-project extension plugins.** `.claude/plugins/*-update/` wrappers are deprecated as of v0.3.0 — the substance lives in `.claude/project-update.yaml`. If you catch yourself scaffolding `plugin.json` + `LICENSE` + `README.md` for a per-project router extension, STOP and re-read the CHANGELOG v0.3.0 migration note.
10. **Speculative `instance_patterns`.** Don't add a pattern entry because "we'll probably do this." Add it after the first time an actual update routes through the pattern, with the real `first_used:` date.

## Examples

### Example 1 — Partner sync (Fulcrum pilot, 2026-04-15)

**Inputs:**
```
project: brian-odyssey-fulcrum-fitness
audience: [partner, self]
distribution: link-shareable
content-shape: strategic-pivot
sensitivity: unlisted
```

**Probe outputs (illustrative):**
- Probe 1: slug `brian-odyssey-fulcrum-fitness`, beads prefix `ff`, repo at `~/Workshop/projects/fulcrum-fitness`, no monorepo subdir.
- Probe 2: audiences include `adam_eby` (audience=`partner`, handoff=`slack_dm`), `self` (Brian), literacy_blocklist for `partner` includes `Mentat`, `voice-agent`, `Paperclip`, `beads`.
- Probe 3: `DESIGN.md` at repo root.
- Probe 4: Level 4 — Vercel prod with `fulcrum-fitness.vercel.app`; `VERCEL_AUTOMATION_BYPASS_SECRET` present in gstack env.
- Probe 5: `instance_patterns` has `partner-update-hub-microsite` (first_used 2026-04-15, deploy route `/partner`) and `self-retro-long-form` (first_used 2026-04-15).

**Route:** Pattern 1 `partner-update-hub-microsite`, matched via Probe 5 instance lookup.

**Auto-pull:** beads `ff-*` in_progress; git log 14d in `fulcrum-fitness` repo; gstack learnings `--project=brian-odyssey-fulcrum-fitness`.

**Filters flagged:** `Mentat`, `voice-agent` (literacy); no sensitivity issues.

**Conflicts surfaced:** design doc had morning/evening/midnight revisions on wedge question → rendered all three with source tags in review surface.

**Sections generated:** thesis pivot timeline, new thesis prose, interactive flywheel (Pattern E), foundation-vs-new-work (Pattern A), premises vs open (Pattern B), risks (Pattern C), asks (Pattern D, 2 numbered).

**Route-destination:** overwrite `/partner`; auto-archived Apr-2 hub to `~/.gstack/projects/brian-odyssey-fulcrum-fitness/updates/2026-04-15T00-archive.tsx`.

**Verification:** hit BotID → retry with `VERCEL_AUTOMATION_BYPASS_SECRET` → 200.

**Handoff:** `https://fulcrum-fitness.vercel.app/partner — paste into Slack DM to Adam with: "open before our next call"`.

### Example 2 — Self retrospective (dogfood)

**Inputs:**
```
project: workshop
audience: [self]
distribution: archival
content-shape: retrospective
sensitivity: private-local
```

**Route:** Pattern 2 `self-retro-long-form` (row 2 of shared table; matches content-shape `retrospective`).

**Generator:** `obsidian-cli create` → `ObsidianVault/Compiled/Weekly-Retros/2026-04-W15.md`; mirrored to `~/.gstack/projects/workshop/updates/`.

**No deploy, no Phase 6.5.** Phase 4.5 runs as markdown lint only.

## Auto-pull Protocol

Phase 3 auto-pull runs four sources. All scoping keys come from Probe outputs (**Probe 1** for slug/beads_prefix/repo_path, **Probe 5** for the `last_update_dates_by_audience` diff window). Each source is optional: missing data → `(no data)` placeholder, never a hard fail.

### Source 1 — Beads

```bash
# scope: beads_prefix from Probe 1
cd <Probe 1: repo_path>
bd list --status=in_progress --json --limit 200 \
  | jq -r '.[] | select(.id | startswith("<prefix>-"))'
bd list --status=open --json --limit 100 \
  | jq -r '.[] | select(.id | startswith("<prefix>-"))'
# for each in_progress: bd show <id> --json → capture notes + design fields
```

Output: list of `{id, status, title, notes_summary, updated_at}`. Pipe to the "What's next" / "Real build ahead" (Pattern A) sections.

### Source 2 — Git log

```bash
# scope: repo_path from Probe 1 (or the subdir if a monorepo — Probe 1's subdir_for_app)
cd <Probe 1: repo_path>/<subdir_for_app or .>
# window: Probe 5's last_update_dates_by_audience[<audience>], fallback 14 days
git log --since="<window>" --pretty=format:"%h %ad %s%n%b" --date=short
git log --since="<window>" --numstat --pretty=format:"%H"
```

Output: list of `{sha, date, subject, body, churn}`. Feeds "What shipped — foundation" (Pattern A, emerald) — but **assume overstate**: Pattern A's whole job is the counterweight to `git log ≈ shipped features`.

### Source 3 — gstack learnings

```bash
gstack-learn --search --project=<Probe 1: slug> --limit 20 2>/dev/null \
  || rg -l "<slug>" ~/.gstack/projects/*/learnings.jsonl
```

Output: list of `{key, observation, tags, date}`. Feeds "Decisions / lessons" + Pattern B premises-vs-open split.

### Source 4 — gstack design docs

```bash
ls -1t ~/.gstack/projects/<slug>/brianlopez-*-design-*.md 2>/dev/null | head -3
# Read most recent; grep for "Status:" to find APPROVED; grep for "Supersedes:" for chain.
```

Output: 1–3 most-recent design docs. Feeds thesis prose + premises + open-decisions lists. Supersedes chains feed Phase 4 conflict surfacing.

### Filters (both run on every source before any content lands)

1. **Sensitivity (P8)** — see Phase 3.
2. **Audience-literacy (P13)** — seeded from **Probe 2**'s `literacy_blocklist[<audience>]`.

### Provenance badges

Every surviving claim carries a provenance badge (inline pill or source tag):

- Bead: `[<beads_prefix>-<id>]`
- Git: `[<sha-7>]`
- Learning: `[learn:<key>]`
- Design doc: `[design-<date>]`

Badges persist through the review surface (Phase 5) so the human can suppress a source if it's wrong.

## Files & State

### Plugin (read-only, ships with the install)

```
odyssey-plugins/.claude/plugins/project-update-router/
├── .claude-plugin/plugin.json
├── README.md
├── CHANGELOG.md
├── LICENSE
├── bin/
│   └── validate-project-update-yaml.py       # v0.3.0 — advisory validator
└── skills/router/
    ├── SKILL.md                               # this file
    └── references/
        ├── decisions-log-seed.md              # Fulcrum pilot findings (immutable)
        ├── project-update-yaml-schema.md      # v0.3.0 — `.claude/project-update.yaml` schema
        ├── project-update-learnings-jsonl-schema.md  # v0.3.0 — learnings log schema
        └── templates/svg/
            ├── curve.svg                      # v0.4+ (not yet written)
            ├── matrix.svg                     # v0.4+
            ├── flywheel.svg                   # v0.4+
            └── progress.svg                   # v0.4+
```

### User state (per-project, append-only, lives outside the plugin)

```
~/.gstack/projects/<project-slug>/project-update-router/
├── decisions-log.md                          # routing misses + user-specific evolution
└── last-updates.jsonl                        # {project, audience, ts, format, url} per publish
```

### Per-project context (lives in each project's repo, version-controlled)

```
<project-repo>/.claude/project-update.yaml           # audiences + literacy + instance_patterns + deploy hints
<project-repo>/.claude/project-update-learnings.jsonl  # optional; hand-edited in v0.3.0
```

Neither file is required. Missing → router probes what it can and asks for the rest. Both are conventional — no manifest, no plugin wrapper, no registration step. The router discovers them by filename.

**Deprecated (v0.2.0):** `<project-repo>/.claude/plugins/*-update/` per-project extension plugins. Migrate substance to `.claude/project-update.yaml` per CHANGELOG v0.3.0, then delete the plugin wrapper. Archived extensions live at `~/.gstack/projects/<slug>/extension-archive/2026-04-16-pre-shape-revert/` for Fulcrum + InTension.

## Success Criteria

- Routing decision + scaffold produced in **<5 min** of interactive prompts.
- Pilot case (Fulcrum) reproducible end-to-end in **<2 hours** post-skill.
- Subsequent updates in **<2–3 hours** (P11 — iteration is the unit).
- After 3+ real uses, routing table reviewed; if >1 ended up re-routed, table evolves.
- Router runs in ANY project repo and degrades gracefully: probes what it can from filesystem, asks for the rest; no crash on missing `.claude/project-update.yaml`.

## Related Skills

- `board-update` — delegated target for the hybrid (v2) path; investor/board PPTX with bad-news protocol.
- `document-skills:web-artifacts-builder` — microsite generator backend.
- `presentation-forge` — Slidev generator (v2).
- `playground:playground` — process/config walkthrough generator (v2).
- `frontend-design` — dashboard + microsite styling.
- `impeccable:teach-impeccable` — run once per project before first microsite to seed brand context.

## Follow-up Beads

- `workshop-575` — v1 build scope (generators + auto-pull + review UI + SVG templates); ships as v0.3+ releases in this plugin. Noted 2026-04-16: Extension Consumer Protocol reverted; Project Context Read Protocol shipped. Generators still pending for v0.4+.
- `workshop-gaw` — suppression-rules promotion (per-claim "suppress source" → v2 rule system).
- `workshop-zpn` — sensitivity marker convention (`share:external` back-fill on beads/learnings).
- `workshop-hz1` — extract `gstack-local-review-ui` helper from `$D serve` pattern (reusable review surface).

**Closed as of v0.3.0 reshape:**

- `workshop-3ra` — per-project extension plugins. Reframed: `.claude/project-update.yaml` replaces the extension-plugin unit; audience/literacy/instance-pattern data migrates per-update, not preemptively.

## v0.4 Commitment (CHANGELOG)

v0.3.0 ships the **foundation** for an automated cross-project learning-promotion flywheel:

- Probes → consistent project-context read from disk
- `.claude/project-update.yaml` → flat config, version-controlled with the project
- `.claude/project-update-learnings.jsonl` → hand-edited learning log with `applies_to: project | plugin`

v0.4 closes the flywheel: automated query of all projects' learnings logs to surface `applies_to: plugin` entries as promotion candidates, then propose edits to this SKILL.md or new Pattern Library entries for human review. v0.3.0 is entirely manual — Brian reviews learnings and promotes by hand. The flywheel the user described is the v0.4 end-state; v0.3.0 is the scaffolding it stands on.
