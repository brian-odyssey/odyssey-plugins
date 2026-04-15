---
name: project-update-router
description: When the user needs to write or ship a project update (partner sync, client status, architecture walkthrough, strategic-pivot note, retrospective, investor update). Routes to the right artifact format (interactive microsite, long-form doc, Slidev, dashboard, playground, hybrid PPTX) based on audience + distribution + content-shape + sensitivity, then scaffolds content from beads + git log + gstack learnings. Replaces the default PPTX-for-everything muscle memory.
related: [board-update, web-artifacts-builder, presentation-forge, playground, frontend-design]
reads: [beads, git, gstack-learnings]
---

# Project Update Router

## When to Use

Activate whenever the user says any of:

- "write the [Fulcrum / Resmark / InTension / Odyssey / …] update"
- "draft a partner update / client status / board update / investor update"
- "I need to send Adam / my partner / the team a note on where [project] is"
- "architecture walkthrough", "retrospective", "strategic pivot note"
- "turn this into a deck / one-pager / microsite"

**Do NOT** activate for:

- Single-issue status comments (use `bd update <id> --notes`)
- Git commit messages (use `/commit`)
- Blog posts / marketing copy (no routing logic — just write)

## Core Premise

**PPTX is not the default.** Format is a function of audience + distribution + content-shape + sensitivity. The skill runs the routing, surfaces the reasoning, and scaffolds the first draft from real project signals so the human edits instead of starts cold.

Thirteen premises govern behavior:

| # | Premise | Status |
|---|---------|--------|
| P1 | PPTX-as-default is wrong for systems/AI/tooling updates | AGREED |
| P2 | Format is routable from 4 inputs (audience, distribution, content-shape, sensitivity) | AGREED |
| P3 | Auto-pull from beads/git/learnings compounds value | AGREED |
| P4 | Single-user v1, no plugin packaging | AGREED |
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
| **project** | slug (auto-detect from `cwd + git remote + beads prefix`; confirm if ambiguous; multi-select if multi-repo) |
| **audience** | `self`, `partner`, `internal`, `investor`, `trainer`, `client`, `public` |
| **distribution** | `link-shareable`, `attach-to-email`, `present-live`, `archival` |
| **content-shape** | `architecture`, `demo`, `metrics`, `process`, `status`, `strategic-pivot`, `technical-walkthrough`, `retrospective` |
| **sensitivity** | `public`, `unlisted`, `password`, `private-local` |

Use `AskUserQuestion` with `multiSelect: true` for audience (can be `partner + self`) and never single-select unless truly mutually exclusive.

**From the environment (auto-pulled, each optional, missing data → `(no data)` placeholder):**

- `bd show <bead>` + `bd list --status=in_progress --prefix=<project>` → status + what's next
- `git log --since=<last-update-date> --oneline` per repo in project's repo list → changes shipped
- `gstack-learn --search --project=<slug> --limit 20` (verify CLI at runtime — may be `gstack-learnings-search`) → decisions + lessons
- `~/.gstack/projects/<project-slug>/project-update-router/last-updates.jsonl` → previous update timestamp, keyed by `(project-slug, audience)`; first run defaults to 14-day window. Created lazily on first run; auto-upgrades from the legacy `~/.claude/skills/project-update-router/last-updates.jsonl` location if present.

## Workflow

The skill runs as a numbered phase machine. Phases 2.5 / 4.5 / 6.5 are insertions from the Fulcrum pilot — skip them and you re-hit a near-miss.

### Phase 0 — Detect project + load extensions

Resolve `cwd`, git remote, `.beads/*.db` prefix. Propose project slug; confirm with user. Multi-repo projects: multi-select repos.

**Then load extension config.** Scan `cwd` (and, for multi-repo projects, each selected repo) for `.claude/plugins/*-update/config/`. If found, read `audiences.yaml`, `brand.yaml`, and `routing-overrides.yaml`. Extension's `project.slug` overrides the auto-detected slug (e.g., `brian-odyssey-fulcrum-fitness` beats inferred `fulcrum-fitness`). See **Extension Consumer Protocol** below for field-by-field semantics.

### Phase 1 — Collect 4 routing inputs

Ask via `AskUserQuestion`. Default distribution to `link-shareable` for `partner`/`client` audiences; `archival` for `self`/`internal`; `attach-to-email` for `investor`.

**If extension loaded,** extension's `default_distribution_by_audience` overrides these defaults. When the user names a human ("update for Adam"), resolve via extension's `people.<key>.audience` map rather than asking — but always confirm the resolved audience back before proceeding.

### Phase 2 — Resolve route

**Extension overrides checked first.** If extension's `routing-overrides.yaml` has a matching row, use it and skip the shared table. First-match semantics still apply within the override list. Otherwise, fall through to the shared routing table below.

Match against the routing table below. **First match wins.** If no row matches, fall back to `long-form-doc` and append a row to `~/.gstack/projects/<project-slug>/project-update-router/decisions-log.md` (user-state, append-only per-project log — NOT the plugin's immutable seed at `references/decisions-log-seed.md`) with `{timestamp, inputs, fallback_taken, extension_loaded}`. Print the matched row + reasoning to the user before proceeding (include whether match came from extension overrides or shared table).

### Phase 2.5 — Audience-relative reframing (from pilot)

Before any scaffold assembly, answer three prompts out loud:

1. **What does this audience already know?** → strip re-statement of known facts.
2. **What are they being asked to do?** → front-load the ask.
3. **What would they misunderstand if shown raw?** → flag terms + frame build-state.

This is a comprehension check, NOT a privacy check.

### Phase 3 — Auto-pull, sensitivity-filtered and literacy-filtered

Run auto-pull commands scoped to the project per the **Auto-pull Protocol** below. Before content lands in the scaffold, run two filters:

- **Sensitivity (P8):** If `sensitivity ∈ {public, password}`, exclude beads/learnings without `share:external` marker. Default assumption is internal — err toward excluding.
- **Audience-literacy (P13):** Run sources through a token filter that flags likely internal shorthand (project code names, prior-project names, internal tool names, team jargon). **Extension-aware:** if extension loaded, use `audiences.yaml` → `blocklist_tokens_for_audience[<audience>]` as the seed blocklist (project-specific jargon like `Mentat`, `voice-agent`, `entity intelligence`). Augment — don't replace — with any tokens the filter surfaces. Surface flagged tokens to user for rewrite or removal.

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

- If `x-vercel-challenge-token` or `x-vercel-mitigated: challenge` is present, look for `VERCEL_AUTOMATION_BYPASS_SECRET` in `~/.gstack/projects/<slug>/.env` and retry with headers `x-vercel-protection-bypass: <secret>` + `x-vercel-set-bypass-cookie: true`.
- If no secret available, fall back to `vercel ls` build-status check — don't assume 403 == failure.

Fulcrum pilot burned 40min on 403 Security Checkpoint pages before wiring the bypass secret.

### Phase 7 — Handoff

Output exactly one concrete line: **"Your update is at `<URL>` / `<path>`. Next step: `<paste-target>`."** Also append a row to `last-updates.jsonl`: `{project, audience, timestamp, format, url}`.

## Routing Table

First-match semantics. `sensitivity` does NOT change format — it changes deploy target (e.g., `unlisted` → Vercel with `noindex`, `private-local` → local preview only).

| audience | distribution | content-shape | → format | generator |
|----------|--------------|---------------|----------|-----------|
| `partner`, `client` | `link-shareable` | `strategic-pivot`, `architecture`, `status`, `technical-walkthrough` | **microsite** | `document-skills:web-artifacts-builder` + `vercel:deploy` |
| `self`, `internal` | `archival` | any | **long-form-doc** | `obsidian-cli create` |
| `internal` | `link-shareable` | `retrospective`, `status` | **long-form-doc** | `obsidian-cli create` (shared vault) |
| `investor` | `attach-to-email` | any | **hybrid** (v2) | `board-update` + `web-artifacts-builder` |
| `investor`, `internal` | `present-live` | `technical-walkthrough`, `demo` | **Slidev** (v2) | `presentation-forge` |
| `internal`, `partner` | `link-shareable` | `metrics` | **shadcn dashboard** (v2) | `frontend-design` + `vercel:deploy` |
| `internal`, `trainer` | `link-shareable` | `process` | **playground** (v2) | `playground:playground` |
| `public` | `link-shareable` | any | **microsite** or **long-form-doc** (depends on content depth) | per content |
| *(no match)* | — | — | **long-form-doc** + log miss | `obsidian-cli` + append `DECISIONS-LOG.md` |

**v1 generators shipped:** microsite, long-form-doc.
**v2 generators deferred** (build when a real update demands it): hybrid, Slidev, shadcn dashboard, playground.

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

Deploy: `vercel:deploy` → unlisted URL with `noindex` headers (sensitivity `unlisted`) OR local preview (`private-local`).

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

### No-match → extend the table

The table will be wrong sometimes. When it is, the skill falls back to `long-form-doc` and logs the miss. After 3 misses with the same shape, add a row. After 3+ successful uses, re-examine the whole table (P6).

## Common Mistakes

1. **Defaulting to PPTX because that's what you always send** — that's the muscle memory this skill exists to break.
2. **Skipping Phase 2.5** (audience-relative reframing) — leads to internal shorthand in partner docs (NM-2).
3. **Treating auto-pull as ground truth** — git log implies shipped features; Pattern A corrects for it.
4. **Letting the source material's self-contradictions pick a side for you** — Phase 4 surfaces them, you choose.
5. **One-shot publish** — real updates iterate 5–10 times. Design the review loop for that, not for "submit and done."
6. **Verification based on HTTP 200** — 403 Security Checkpoint is a false negative without deploy-protection awareness (Phase 6.5).
7. **Overwriting without archive** — destructive route-destination choices need auto-archive to `~/.gstack/projects/<slug>/updates/`.
8. **Asks without names** — "help recruit" vs. "name three trainers by Friday" — the latter drives action.

## Examples

### Example 1 — Partner sync (Fulcrum pilot, 2026-04-15)

**Inputs:**
```
project: Odyssey-Mercantile-fulcrum-fitness
audience: [partner, self]
distribution: link-shareable
content-shape: strategic-pivot
sensitivity: unlisted
```

**Route:** microsite (row 1 match).

**Auto-pull:** beads `fulcrum-*` in_progress; git log 14d in `fulcrum-fitness` repo; gstack learnings `--project=fulcrum-fitness`.

**Filters flagged:** `Mentat`, `voice-agent` (literacy); no sensitivity issues (all project-internal).

**Conflicts surfaced:** design doc had morning/evening/midnight revisions on wedge question → rendered all three with source tags in review surface.

**Sections generated:**
- Thesis Pivot Timeline (4-node horizontal, hover tooltips)
- The New Thesis (3 paragraphs, verbatim)
- Interactive Flywheel (Pattern E, 3-layer clickable)
- Foundation — shipped (Pattern A, emerald)
- Real build ahead — ~4–7 weeks (Pattern A, amber)
- Locked Premises (Pattern B, collapsible P1–P8)
- Still open (Pattern B)
- Risks (Pattern C, severity-tagged)
- The Assignment (Pattern D, 2 numbered asks)

**Route-destination:** overwrite `/partner`; auto-archived Apr-2 hub to `~/.gstack/projects/Odyssey-Mercantile-fulcrum-fitness/updates/2026-04-15T00-archive.tsx`.

**Verification:** hit BotID → retry with `VERCEL_AUTOMATION_BYPASS_SECRET` → 200.

**Handoff:** `https://fulcrum-fitness.vercel.app/partner — paste into Slack DM to Adam with: "open before our next call"`.

### Example 2 — Self retrospective (dogfood, planned)

**Inputs:**
```
project: workshop
audience: [self]
distribution: archival
content-shape: retrospective
sensitivity: private-local
```

**Route:** long-form-doc (row 2).

**Generator:** `obsidian-cli create` → `ObsidianVault/Compiled/Weekly-Retros/2026-04-W15.md`.

**No deploy, no Phase 6.5.** Phase 4.5 runs as markdown lint only.

## Extension Consumer Protocol (v0.2.0)

Project repos may ship a thin sibling plugin at `<repo>/.claude/plugins/<project>-update/` that layers project-specific audiences, brand, and distribution defaults onto this shared router. The router discovers, loads, and consumes extensions as follows.

### Discovery

In Phase 0, after resolving `cwd` + selected repos:

```
for repo in [cwd, *additional_repos]:
  for dir in glob(f"{repo}/.claude/plugins/*-update/"):
    if (dir / ".claude-plugin/plugin.json").exists():
      load_extension(dir)
```

Extension is valid when `plugin.json` has `keywords` containing `extends:project-update-router` (stringly-typed contract — upgrade to a formal `requires` field when Claude Code plugin system adds one). If multiple extensions match (unusual — only one `*-update/` dir per repo expected), prefer the one whose `name` matches the repo's git remote slug.

### Config schema

Three YAMLs under `<extension>/config/`. All fields optional; router uses what's present, falls through to defaults for missing.

**`audiences.yaml`** (consumed in Phase 0, 1, 3):

| Path | Type | Used by |
|------|------|---------|
| `project.slug` | string | Phase 0 — overrides auto-detected slug (becomes `<project-slug>` in state paths) |
| `project.beads_prefix` | string | Phase 3 — scopes `bd list`/`bd show` to `<prefix>-*` |
| `project.git_repo` | string | Phase 3 — scopes `git log` |
| `project.repo_path` | path | Phase 3 — cwd for git commands |
| `people.<key>.audience` | enum | Phase 1 — resolves named humans to audience enum |
| `people.<key>.handoff.*` | object | Phase 7 — handoff line template + channel |
| `people.<key>.context_notes` | list | Phase 2.5 — audience-reframing hints |
| `default_distribution_by_audience` | map | Phase 1 — overrides shared defaults |

**`brand.yaml`** (consumed in Phase 5 generators, v0.3+; Phase 2.5 tone hints today):

| Path | Type | Used by |
|------|------|---------|
| `identity.product_name`, `tagline`, `feel` | strings | Phase 5 — generator headline/copy |
| `voice.tone`, `avoid`, `emphasize` | lists | Phase 2.5 — tone reframing |
| `typography.*` | object | Phase 5 — generator CSS (v0.3+) |
| `color_dark.*`, `color_light.*` | color maps | Phase 5 — generator CSS (v0.3+) |
| `cta_style.*` | object | Phase 5 — CTA styling (v0.3+) |
| `layout.*` | object | Phase 5 — grid + radius tokens (v0.3+) |
| `deploy.*` | object | Phase 6 — route + production URL + local port; Phase 6.5 — `protection.automation_bypass_env` |
| `anti_slop` | list | Phase 4.5 — lint rules (v0.3+) |
| `status_color_semantics` | map | Pattern A — foundation-vs-new-work color mapping |

**`routing-overrides.yaml`** (consumed in Phase 2):

| Path | Type | Used by |
|------|------|---------|
| `overrides[].id` | string | Log in `decisions-log.md` when match |
| `overrides[].match.{audience,distribution,content_shape}` | list | Phase 2 — match logic (all three must match; list values = "any of") |
| `overrides[].format` | string | Phase 2 — resolved format |
| `overrides[].generator` | string | Phase 5 — generator selector |
| `overrides[].deploy.*` | object | Phase 5/6 — generator-specific deploy config |
| `overrides[].handoff_template` | string | Phase 7 — handoff line |
| `pattern_defaults.*` | object | Patterns A/B/C/D/E — per-project defaults (enable, labels, style) |

### Load order

1. Shared router defaults (hardcoded in SKILL.md)
2. Extension config (overlays on top — override not merge for scalars; merge-by-key for maps)
3. User responses at invocation (highest priority)

Extension absence is never an error — router falls back to shared defaults + asks the user for everything audience-map would have resolved.

### Extension staleness warning

Brand tokens duplicated from the project's `DESIGN.md` (if present) are a known drift source. If `brand.yaml` references a `design_doc` path, the router should (v0.3+) diff the two and warn — not block. v0.2.0 only reads; no drift detection yet.

## Auto-pull Protocol (v0.2.0)

Phase 3 auto-pull runs four sources, all scoped by extension's `project.*` fields when an extension is loaded. Each source is optional: missing data → `(no data)` placeholder, never a hard fail.

### Source 1 — Beads

```bash
# scope: prefix from extension audiences.yaml → project.beads_prefix (or inferred)
cd <project.repo_path>   # beads DB lives in the repo
bd list --status=in_progress --json --limit 200 \
  | jq -r '.[] | select(.id | startswith("<prefix>-"))'
bd list --status=open --json --limit 100 \
  | jq -r '.[] | select(.id | startswith("<prefix>-"))'
# for each in_progress: bd show <id> --json → capture notes + design fields
```

Output: list of `{id, status, title, notes_summary, updated_at}`. Pipe to the "What's next" / "Real build ahead" (Pattern A) sections.

### Source 2 — Git log

```bash
# scope: repo_path from extension or selected repo
cd <project.repo_path>
# window: since last update (from ~/.gstack/projects/<slug>/project-update-router/last-updates.jsonl)
# fallback: 14 days if no last-updates entry for this audience
git log --since="<window>" --pretty=format:"%h %ad %s%n%b" --date=short
# also: count LOC churn for "shipped" vs "scaffolding" classification (heuristic)
git log --since="<window>" --numstat --pretty=format:"%H"
```

Output: list of `{sha, date, subject, body, churn}`. Feeds "What shipped — foundation" (Pattern A, emerald) — but **assume overstate**: Pattern A's whole job is the counterweight to `git log ≈ shipped features`.

### Source 3 — gstack learnings

```bash
# Verify CLI at runtime — may be gstack-learn or gstack-learnings-search.
gstack-learn --search --project=<project.slug> --limit 20 2>/dev/null \
  || rg -l "<project.slug>" ~/.gstack/projects/*/learnings.jsonl
```

Output: list of `{key, observation, tags, date}`. Feeds "Decisions / lessons" + Pattern B premises-vs-open split.

### Source 4 — gstack design docs

```bash
# Latest APPROVED design doc for this project — highest-signal single source
ls -1t ~/.gstack/projects/<project.slug>/brianlopez-*-design-*.md 2>/dev/null | head -3
# Read most recent; grep for "Status:" to find APPROVED; grep for "Supersedes:" for chain.
```

Output: 1–3 most-recent design docs. Feeds thesis prose + premises + open-decisions lists. Supersedes chains feed Phase 4 conflict surfacing.

### Filters (both run on every source before any content lands)

1. **Sensitivity (P8)** — see Phase 3.
2. **Audience-literacy (P13)** — see Phase 3. Seeded from extension's `audiences.yaml → blocklist_tokens_for_audience[<audience>]`.

### Provenance badges

Every surviving claim carries a provenance badge (Pattern-A-style inline pill or Pattern-B-style source tag):

- Bead: `[<beads_prefix>-<id>]` — styled with extension's `pattern_defaults.provenance_badges.style` if set
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
└── skills/router/
    ├── SKILL.md                              # this file
    └── references/
        ├── decisions-log-seed.md             # Fulcrum pilot findings (immutable)
        └── templates/svg/
            ├── curve.svg                     # v0.2+ (not yet written)
            ├── matrix.svg                    # v0.2+
            ├── flywheel.svg                  # v0.2+
            └── progress.svg                  # v0.2+
```

### User state (per-project, append-only, lives outside the plugin)

```
~/.gstack/projects/<project-slug>/project-update-router/
├── decisions-log.md                          # routing misses + user-specific evolution
└── last-updates.jsonl                        # {project, audience, ts, format, url} per publish
```

### Per-project extension (optional, sibling plugins)

Projects with recurring update cadences (fulcrum-fitness, resmark-workspace, intension-pilates, odyssey-mercantile) may ship a thin sibling plugin at `<project-repo>/.claude/plugins/<project>-update/` that layers project-specific audiences, brand, and distribution defaults onto this shared router. See **Extension Consumer Protocol** (above) for the full schema and load order. Router discovers + loads automatically when cwd is a project repo with an extension installed.

First instance: `fulcrum-update` v0.1.0 at `<fulcrum-fitness>/.claude/plugins/fulcrum-update/` (shipped 2026-04-15). Bead `workshop-3ra` tracks replication to Resmark, InTension, Odyssey.

Generator scripts (microsite, long-form) are invoked via existing skills — this skill doesn't reimplement them. v0.1.0 ran pure interpreter-mode; v0.2.0 adds the Extension Consumer + Auto-pull protocols (still interpreter-executed but now formally scoped); v0.3+ ships automated generators.

## Success Criteria

- Routing decision + scaffold produced in **<5 min** of interactive prompts.
- Pilot case (Fulcrum) reproducible end-to-end in **<2 hours** post-skill.
- Subsequent updates in **<2–3 hours** (P11 — iteration is the unit).
- After 3+ real uses, routing table reviewed; if >1 ended up re-routed, table evolves.

## Related Skills

- `board-update` — delegated target for the hybrid (v2) path; investor/board PPTX with bad-news protocol.
- `document-skills:web-artifacts-builder` — microsite generator backend.
- `presentation-forge` — Slidev generator (v2).
- `playground:playground` — process/config walkthrough generator (v2).
- `frontend-design` — dashboard + microsite styling.
- `impeccable:teach-impeccable` — run once per project before first microsite to seed brand context.

## Follow-up Beads

- `workshop-575` — v1 build scope (generators + auto-pull + review UI + SVG templates); ships as v0.2+ releases in this plugin
- `workshop-3ra` — per-project update extension plugins (Fulcrum, Resmark, InTension, Odyssey), each layering project-specific audiences + brand onto this shared router
- `workshop-lvn` — `odyssey-plugin-creator` (P3, narrowed scope post-reframe); scaffolding + audit for plugins #5+
- `workshop-gaw` — suppression-rules promotion (per-claim "suppress source" → v2 rule system)
- `workshop-zpn` — sensitivity marker convention (`share:external` back-fill on beads/learnings)
- `workshop-hz1` — extract `gstack-local-review-ui` helper from `$D serve` pattern (reusable review surface)
