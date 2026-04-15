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

### Phase 0 — Detect project

Resolve `cwd`, git remote, `.beads/*.db` prefix. Propose project slug; confirm with user. Multi-repo projects: multi-select repos.

### Phase 1 — Collect 4 routing inputs

Ask via `AskUserQuestion`. Default distribution to `link-shareable` for `partner`/`client` audiences; `archival` for `self`/`internal`; `attach-to-email` for `investor`.

### Phase 2 — Resolve route

Match against the routing table below. **First match wins.** If no row matches, fall back to `long-form-doc` and append a row to `~/.gstack/projects/<project-slug>/project-update-router/decisions-log.md` (user-state, append-only per-project log — NOT the plugin's immutable seed at `references/decisions-log-seed.md`) with `{timestamp, inputs, fallback_taken}`. Print the matched row + reasoning to the user before proceeding.

### Phase 2.5 — Audience-relative reframing (from pilot)

Before any scaffold assembly, answer three prompts out loud:

1. **What does this audience already know?** → strip re-statement of known facts.
2. **What are they being asked to do?** → front-load the ask.
3. **What would they misunderstand if shown raw?** → flag terms + frame build-state.

This is a comprehension check, NOT a privacy check.

### Phase 3 — Auto-pull, sensitivity-filtered and literacy-filtered

Run auto-pull commands scoped to the project. Before content lands in the scaffold, run two filters:

- **Sensitivity (P8):** If `sensitivity ∈ {public, password}`, exclude beads/learnings without `share:external` marker. Default assumption is internal — err toward excluding.
- **Audience-literacy (P13):** Run sources through a token filter that flags likely internal shorthand (project code names, prior-project names, internal tool names, team jargon). Surface flagged tokens to user for rewrite or removal. Fulcrum pilot near-miss: `Mentat`, `voice-agent` — don't ship these to a partner.

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

Projects with recurring update cadences (fulcrum-fitness, resmark-workspace, intension-pilates, odyssey-mercantile) may ship a thin sibling plugin at `<project-repo>/.claude/plugins/<project>-update/` that layers project-specific audiences, brand, and distribution defaults onto this shared router. Tracked separately — see upstream docs.

Generator scripts (microsite, long-form) are invoked via existing skills — this skill doesn't reimplement them. v0.1.0 runs interpreter-mode (manual workflow execution); v0.2+ ships automated generators.

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
