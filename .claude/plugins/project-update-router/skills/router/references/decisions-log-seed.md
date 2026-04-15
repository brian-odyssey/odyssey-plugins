# DECISIONS-LOG seed for project-update-router (workshop-575)

Seeded from the Fulcrum partner-page pilot on 2026-04-15.
Read by the skill on first build as the v1 routing table's starting datapoint
and as the pattern-library seed for generators.

---

## Pilot 001 — Fulcrum partner page

```yaml
date: 2026-04-15
project: Odyssey-Mercantile-fulcrum-fitness
audience: [partner, self]
content_shape: strategic-pivot        # masqueraded as "status" in the bead
distribution: link-shareable
sensitivity: unlisted                 # noindex, no auth
format_chosen: microsite
generator: web-artifacts-builder → Vercel (existing Next.js app)
route_destination: overwrite /partner (prior Apr-2 hub version lost to git)

inputs_that_mattered:
  - audience
  - content_shape
  - sensitivity (for content filtering, not format selection)

inputs_that_did_not_matter:
  - content_shape granularity
    (whether this was "strategic-pivot" vs "status" vs "architecture"
     did not change the format choice — all routed to microsite
     for partner+link+unlisted)

edit_cycles: ~7
wall_clock: ~2.5h
wall_clock_estimate: 0.9h
estimate_error: 2.7×

deploy_failures: 1 (TS `as const` tuple narrowed `highlight` prop)
deploy_verification_blockers: 1 (Vercel BotID; resolved with bypass secret)
```

---

## Near-misses (anti-patterns the skill must guard against)

### NM-1: Auto-pull implied the product was built
- **Source**: git log + bead status = "6 epics complete, 22 trainers seeded"
- **What happened**: initial draft showed section 05 as "Code ships, not slides" with 6 green-dot "Complete" cards, suggesting the product was ~80% shipped.
- **Reality**: those 6 epics are **marketplace scaffolding**, not the compounding-product. The real product (mobile app, synthesis worker, entity intelligence model, braided surfaces, two-sided subscription, privacy enforcement) is **~4-7 weeks of NEW build**, zero code today.
- **User intervention**: "im not sure most of this is true... it says tons is built, but didn't we decide yesterday we'd need a full build?"
- **Fix**: split the section into two blocks:
  - "Foundation — shipped" (emerald, reused)
  - "The real build — ~4-7 weeks ahead" (amber, not started)
  - Plus a build-state progress bar diagram with "YOU ARE HERE" marker at the boundary.
- **Generalized pattern**: ANY in-flight project update needs explicit foundation-vs-new-work framing. The skill should auto-generate this block whenever a project has shipped commits + open roadmap items.

### NM-2: Internal shorthand in partner-facing doc
- **Source**: design-doc premises (P7 referenced "Mentat + voice-agent as pattern references, not fork sources")
- **What happened**: scaffolded premises section contained project-internal code names that a partner reader has no context for.
- **Reality**: Adam would read "Mentat" and have no idea it's Brian's prior project. Reads as cryptic.
- **User intervention**: "we need to revisit the risks and premises"
- **Fix**: audience-literacy filter. Distinct from sensitivity/privacy — this is about comprehension, not policy. Run sources through a filter that flags tokens likely to be internal shorthand (project code names, internal tool names, team jargon).
- **Generalized pattern**: sensitivity filter (P8 — is this private data?) and audience-literacy filter (P13 — will this audience understand this term?) are two different checks. Both need to run before generation.

### NM-3: Contradictory source material silently merged
- **Source**: design doc at `~/.gstack/projects/Odyssey-Mercantile-fulcrum-fitness/brianlopez-main-design-20260414-110014.md` had internal contradictions from three same-day revisions:
  - Morning: "v0 is existing pairs only, matching is byproduct"
  - Evening: "doubled down on reinforcement-only"
  - Midnight: "v0 includes discovery AND reinforcement. Existing pairs are one entry path; matched pairs are another."
- **What happened**: I silently picked "wedge = existing pairs" as a premise for the partner page, inheriting the EVENING version and ignoring the midnight supersede.
- **User intervention**: "is p1 wedge existing pairs even true?"
- **Fix**: the skill must detect `Supersedes:` fields OR contradictory sections in version-chained design docs, and SURFACE the contradiction to the user rather than pick one side. When a source contradicts itself, render as "the source disagrees with itself — which do you mean?" or render both with source tags.
- **Generalized pattern**: Codex predicted this as P9 (surface conflicts, don't auto-resolve). The pilot confirmed: design doc self-contradiction is a real class, not hypothetical.

### NM-4: TypeScript error caught at Vercel, not locally
- **What happened**: `as const` tuple narrowing made `c.highlight` a type error on all rows except the one that had it. First push (`b46f840`) failed Vercel build at 18s. Fix push (`04678c8`) built clean.
- **Fix**: pre-push validation inside the generator. At minimum `npx tsc --noEmit` for TS projects, `npm run lint` if present, `npm run build` as a hard gate for the format-generator output.
- **Generalized pattern**: skill generators must assume their output will be type-checked / linted / built. Ship with validation hooks per stack.

### NM-5: Vercel BotID blocked automated verification
- **What happened**: `/partner` is behind Vercel BotID by default (plan/project setting). 40 minutes of automated curl-based verification returned 403 Security Checkpoint pages, until we wired a bypass secret.
- **Fix**: deploy-protection-aware verification.
  - Detect `x-vercel-challenge-token` or `x-vercel-mitigated: challenge` in response headers.
  - If `~/.gstack/projects/<slug>/.env` has `VERCEL_AUTOMATION_BYPASS_SECRET` set, include header `x-vercel-protection-bypass: <secret>` and optionally `x-vercel-set-bypass-cookie: true`.
  - If no secret, degrade gracefully: confirm HTTP 200 (including 403-challenge) + check Vercel dashboard build status via `vercel ls`.
- **Generalized pattern**: skill's post-deploy verification step cannot assume unprotected public URLs. Check for protection, use bypass if available, fall back cleanly.

---

## Patterns worth encoding (reusable across updates)

### Pattern A: Foundation-vs-new-work block
Triggers when: project has shipped commits AND open roadmap items.
Output:
- Two-column or two-row block
- Left: "Foundation — shipped" (emerald, reused items, each marked Complete)
- Right: "Real build ahead — [scope estimate]" (amber, each with rough scope)
- Visual: horizontal progress bar with "YOU ARE HERE" marker at the boundary

### Pattern B: "Still open" vs "Premises"
Triggers when: source material has committed decisions AND open decisions.
Output: two separate blocks.
- Premises = load-bearing bets, each AGREED (or with status tag)
- Still open = decisions NOT yet committed, with context on what they block
Honest. Prevents "papering over" uncertainty as premise.

### Pattern C: Severity-tagged risks
Triggers when: Risks section has 3+ items.
Output: each risk has severity (high/med/low), colored left-edge bar, severity label corner tag, mitigation paragraph prefaced with `→`.
Rationale: flat risk lists all read equally. Severity tagging forces prioritization and shows the author thought about it.

### Pattern D: Audience-relative asks section
Triggers when: audience includes a specific named decision-maker (partner, investor, manager).
Output: numbered actions the audience is asked to take, in priority order, each with specific language ("name three trainers", not "help recruit").
Rationale: updates without a specific ask are read as informational. Updates with specific asks drive action.

### Pattern E: Inline SVG diagram library
v1 diagrams that carried concept better than paragraphs:
- **Compounding curve** — gold rising curve vs flat dashed competitor line, Day 0 → Year 1
- **2×2 competitive matrix** — thesis quadrant in amber + star, failures scattered, caption "Every failure lived on one side of this grid"
- **Flywheel / multi-layer flow** — 3 input nodes → glowing synthesis hub → ranked output card, dashed feedback loop
- **Build-state progress bar** — emerald foundation + amber-striped build-ahead + "YOU ARE HERE" marker

All four are parameterized and should ship as SVG templates in the skill.

---

## Proposed new premises to add to the workshop-575 design doc

- **P11 — Iteration is the unit of work.** Assume 5–10 edit cycles per update, not 1 publish. Review UI (localhost form + POST-back) should be designed for state preservation and re-entry.
- **P12 — Content quality outranks format routing.** Format selection is ~30 seconds. Content curation is hours. Skill effort should follow.
- **P13 — Audience-literacy filter is distinct from privacy filter.** Privacy (P8) asks "can this audience see this data?" Literacy asks "will this audience understand this term?" Both run before generation.

## Proposed new phases

- **Phase 2.5 — Audience-relative reframing.** Three prompts before scaffold assembly:
  1. What does this audience already know? (→ skip re-stating known facts)
  2. What are they being asked to do? (→ front-load the ask)
  3. What would they misunderstand if shown raw? (→ frame the build-state, caveat the claims)
- **Phase 4.5 — Pre-publish validation.** Run `npx tsc --noEmit`, `npm run lint` (if present), framework-specific build dry-run on generator output. Hard gate: no push with errors.
- **Phase 6.5 — Deploy-protection-aware verification.** Detect protection headers; use bypass secret if `~/.gstack/projects/<slug>/.env` has one; fall back to dashboard build check.

## Proposed route-destination prompt

Current design: skill picks format, user edits content.
Missing: route/destination on the live app.
Add: skill asks "new sub-route / overwrite / refactor-to-index" for web-based generators, with auto-archive of overwritten content to `~/.gstack/projects/<slug>/updates/<timestamp>-archive.<ext>`.

---

## Recalibrated time estimate

| Operation | Old estimate | New estimate | Notes |
|-----------|-------------|--------------|-------|
| Skill v1 build | 12–14h | 14–18h | +2h for Phases 2.5 / 4.5 / 6.5 + SVG template library |
| Per-update authoring (after skill ships) | 45 min | 2–3h | Iteration is the unit of work; 45 min was 1-shot fantasy |
| First-run multi-repo setup | not estimated | ~15 min | auto-detect + confirm + project.yaml write |
