---
name: fitness
description: Fitness and wellness domain UX patterns. Use when building, generating, or reviewing any fitness-studio, gym, or wellness booking interface — class booking flows, schedule grids, capacity indicators, instructor selection, kiosk check-in, intro-offer funnels, membership pricing, multi-location selectors, or waitlist UX. Covers Pilates, Lagree, reformer, barre, spin, CrossFit, yoga, HIIT, strength, and adjacent wellness verticals. Invoke during /gstack-design-review on fitness pages, during UI generation prompts targeting fitness features, or any time the page being worked on shows studio schedules, class cards, booking CTAs, instructor lists, or fitness pricing tiers.
---

# Fitness UX Patterns

Domain-specific UX conventions for fitness and wellness applications. Encoded so `/gstack-design-review` catches fitness-domain anti-patterns that generic reviewers structurally cannot — and so UI generation bakes conventions in from the start instead of shipping generic e-commerce forms dressed up with gym photography.

## When to use this skill

Invoke this skill any time you are working on a fitness or wellness interface. Concrete triggers:

- **Reviewing a fitness page.** `/gstack-design-review` against `/classes`, `/schedule`, `/memberships`, `/join`, `/locations/[studio]`, `/instructors`, `/book/[class]`, or any studio-branded page.
- **Generating a new fitness UI.** "Build a class booking card." "Design a schedule grid for Sandy." "Create an intro-offer landing page." Load this skill before the generator decides what the component looks like.
- **Auditing booking flows.** Any flow that takes a user from "I want to work out" to "I'm on the waitlist" or "I have a confirmed reservation."
- **Reviewing capacity indicators, waitlist UX, or sold-out states.** Fitness loss-aversion patterns are different from e-commerce scarcity.
- **Reviewing membership pricing or intro-offer funnels.** Boutique (inTension, Barry's) and franchise (Orangetheory, F45) differ structurally and should not be confused.

## Pattern index

The twelve patterns covered in this skill. Each links to a deep-dive reference in `references/<pattern>.md`. Only load references that apply to the page or task at hand — progressive disclosure.

1. **Single-class booking flow** · `references/booking-flow.md` — Tap → time slot → confirm → calendar add. Why it differs from generic e-commerce checkout.
2. **Recurring membership signup** · `references/recurring-membership.md` — Autopay, pause, cancel paths. Pause is not cancel. Cancel must not be buried.
3. **Waitlist and cancellation policy** · `references/waitlist-cancellation.md` — Late-cancel fees, auto-promote, waitlist count as social proof.
4. **Capacity and availability signal** · `references/capacity-signal.md` — "Filling up" without panic. Red-at-80%-is-wrong. Qualitative vs numeric thresholds.
5. **Instructor affinity** · `references/instructor-affinity.md` — Users pick instructors emotionally. Favorite-instructor, founder signals, instructor-first browsing.
6. **Schedule grid patterns** · `references/schedule-grid.md` — Weekly, daily, calendar. When to use which. Density tradeoffs. Day-of-week affordances.
7. **Kiosk check-in** · `references/kiosk-checkin.md` — Large tap targets, zero auth, in-studio context. Not a mobile app, not a desktop interface.
8. **Intro-offer funnel** · `references/intro-offer-funnel.md` — "First class free" placement. Friction moments. Conversion-to-paid handoff.
9. **Package and credit purchase** · `references/package-credits.md` — Boutique credit model. Credit expiry UX. Stacking credits with memberships.
10. **Multi-location selection** · `references/multi-location-selection.md` — Franchise vs multi-studio. Pre-launch locations. Location affinity vs travel convenience.
11. **Mobile-first defaults** · `references/mobile-first-defaults.md` — Most fitness traffic is phone-based and in-studio. Desktop is the edge case, not the default.
12. **Pricing tier presentation** · `references/pricing-tier-presentation.md` — Boutique vs franchise. Single tier vs three tiers. Autopay anchor. Intro offer as on-ramp.

## Decision tree — which references to load

Match the page or task to the relevant references. Do not load all twelve — load only what applies.

| Page / task | Primary references | Secondary |
|---|---|---|
| `/classes`, `/schedule`, studio schedule page | `schedule-grid.md`, `capacity-signal.md`, `waitlist-cancellation.md` | `instructor-affinity.md`, `mobile-first-defaults.md`, `multi-location-selection.md` |
| Booking flow / `/book/[class]` | `booking-flow.md`, `capacity-signal.md` | `waitlist-cancellation.md`, `intro-offer-funnel.md` |
| `/memberships`, pricing page | `pricing-tier-presentation.md`, `recurring-membership.md` | `intro-offer-funnel.md`, `package-credits.md` |
| `/join`, intro-offer landing | `intro-offer-funnel.md`, `booking-flow.md` | `pricing-tier-presentation.md`, `mobile-first-defaults.md` |
| `/instructors`, instructor bio | `instructor-affinity.md` | — |
| `/locations`, `/locations/[slug]` | `multi-location-selection.md`, `schedule-grid.md` | `mobile-first-defaults.md` |
| Kiosk / in-studio check-in screen | `kiosk-checkin.md`, `mobile-first-defaults.md` | — |
| Generation: "build a class booking card" | `booking-flow.md`, `capacity-signal.md` | `instructor-affinity.md` |
| Generation: "build a schedule grid" | `schedule-grid.md`, `capacity-signal.md` | `instructor-affinity.md`, `mobile-first-defaults.md` |

## Cross-pattern precedence rules

When two patterns' guidance conflicts, these rules decide which wins:

1. **Mobile-first beats schedule-grid density.** If a dense weekly grid is unreadable on a 375px viewport, collapse to daily-list on mobile. Desktop-first grid density is an anti-pattern even when desktop is a supported breakpoint.
2. **Instructor-affinity beats capacity-signal on featured rows.** If a featured founder or beloved instructor is teaching a class with 1 spot remaining, lead with the instructor badge, not the scarcity indicator. Scarcity still shown, just not the primary visual.
3. **Intro-offer-funnel beats pricing-tier-presentation on first visit.** On a new-visitor landing, the $ amount is a conversion blocker. Intro-offer language wins the top of the page; full pricing tiers appear below the fold or on a secondary /memberships page.
4. **Waitlist-cancellation beats capacity-signal for sold-out state.** "Waitlist" with a count (social proof) wins over "FULL" as a dead-end label.
5. **Booking-flow beats kiosk-checkin on web surfaces.** Kiosk patterns are for in-studio touch devices, never for the public-facing website. If you find yourself wanting kiosk patterns on the web, you are building the wrong thing.

If a conflict arises that these rules do not cover, flag it as a finding and ask the user — do not guess.

## Review protocol (invoked by /gstack-design-review)

When this skill is loaded during a design review:

1. **Identify which patterns the page exposes.** Scan the rendered page (via `/browse` snapshot or DOM text) for fitness-domain surface area — class cards, schedule rows, capacity labels, booking CTAs, instructor names, pricing tiers, intro-offer banners, location selectors.
2. **Load only the references that apply.** Use the decision tree above. Loading all 12 is wasteful and dilutes attention.
3. **For each loaded reference, evaluate the page against its anti-patterns and measurable checks.**
   - Anti-patterns are named violations; if the page exhibits one, cite it by name.
   - Measurable checks are prose heuristics; apply them as pass/fail judgments with reasoning, not as programmatic assertions.
4. **Apply precedence rules** when two references disagree about the same element.
5. **Report findings in this exact format (the dogfood rubric):**
   - **Pattern:** which reference (e.g. `capacity-signal.md`)
   - **Anti-pattern violated:** exact name from the references/ file (e.g. "red-at-80%")
   - **Real-world citation:** brand + URL from the references/ citations list
   - **File:line:** the source file and approximate line causing the issue (use `/browse` DOM → file-search to trace visual finding back to source)
   - **Suggested fix:** one sentence, actionable
6. **Drop findings that cannot be cited by all four attributes.** "This button looks generic" is not a fitness-domain finding. If you cannot cite an anti-pattern name from the references, the finding is generic and should be surfaced by the base `/gstack-design-review` rubric, not attributed to this skill.

## Generation protocol (invoked during UI generation)

When this skill is loaded during generation:

1. **Identify which patterns the target UI involves.** "Build a class booking card" → `booking-flow.md` + `capacity-signal.md`.
2. **Load those references. Read the anti-patterns section first** — these become negative constraints. Do NOT generate code that violates them.
3. **Read the reference implementation snippet.** Use it as a starting point. Adapt to the target brand's color palette, typography, and component library. Do not ship the reference snippet verbatim — it is a template, not a production drop-in.
4. **Apply precedence rules** when patterns overlap.
5. **Do NOT apply measurable checks during generation** — they are evaluation heuristics for rendered output, not generation constraints. Measurable checks activate only during review.

## Citation and currency discipline

- Every real-world brand citation in a `references/<pattern>.md` file must link to a URL the reference author actually visited. Do not cite brands from memory — fitness brands redesign quarterly and memory is stale.
- Every reference file includes a `last_verified: YYYY-MM-DD` note next to each citation. When a citation is over 180 days old, flag it as a staleness risk during review.
- If a reviewer or generator encounters a citation that 404s or points to a page where the cited pattern no longer appears, surface it as a meta-finding and offer to update the reference.

## Non-goals (v1)

- **This skill does not generate UI by itself.** It is a lens and a library, not a codegen tool. `/frontend-design` + this skill is the generation pattern.
- **This skill does not enforce checks programmatically.** Measurable checks are LLM-evaluated heuristics. If you want programmatic enforcement (CI-time lint, visual regression), promote a check to a separate ESLint rule or Playwright test — outside this skill's scope.
- **This skill does not cover non-fitness verticals.** Hospitality, legal, SaaS, healthcare patterns are planned as sibling skills inside the same `ux-patterns` plugin. They are not part of v1.
- **This skill is not stack-neutral in v1.** Reference snippets assume shadcn + Tailwind. Adapting to other stacks is adapter work the caller does, not built-in.

## Reference file structure exceptions

The canonical reference file structure is: What it is / Why it matters in fitness / Anti-patterns / Real-world references / Reference implementation / Measurable checks / Cross-pattern notes.

Approved structural exceptions (any future reference may adopt these):

- **Regulatory context** — optional section between "Real-world references" and "Reference implementation." Use only when the pattern touches binding law (FTC rules, state negative-option laws, class-action precedent, consumer-protection statutes). `recurring-membership.md` uses this pattern. Do not add this section for patterns that only touch convention or industry norms — those belong in "Why it matters in fitness" or "Anti-patterns."

## Versioning and scope changes

- Pattern set is stable at 12 for v1. Adding a 13th pattern bumps to v0.2.0.
- Changing an anti-pattern name is a breaking change — consumers cite names verbatim in review output. Bump to v0.2.0 and document in CHANGELOG.
- Updating citations (adding, removing, refreshing) is a patch release.
- Changing precedence rules is a minor release — flag in release notes.
