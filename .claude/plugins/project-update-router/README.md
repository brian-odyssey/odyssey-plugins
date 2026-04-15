# project-update-router

Routes project-update authoring to the right format — interactive microsite, long-form doc, Slidev deck, shadcn dashboard, playground, or hybrid PPTX+linked-artifacts — based on **audience + distribution + content-shape + sensitivity**. Scaffolds content from beads + git log + gstack learnings. Replaces the default PPTX-for-everything muscle memory with format choice that matches message.

## Status

- **v0.1.0 — interpreter-mode.** The `SKILL.md` guides Claude through the workflow manually: prompts, routing table, content patterns, pre-publish validation, deploy-protection awareness. Works today for real update authoring with a human in the loop.
- **v0.2+ — automated generators** (microsite + long-form) land as separate releases. Tracked in `workshop-575`.
- **Companion plugins** (per-project extensions) tracked in `workshop-3ra`.

## Install

```bash
claude plugin marketplace add github:brian-odyssey/odyssey-plugins
claude plugin install project-update-router@odyssey-plugins
```

## Invocation

Any of these phrases load the skill:

- "write the Fulcrum update"
- "draft a partner update / client status / board update / investor update"
- "I need to send Adam a note on where [project] is"
- "architecture walkthrough", "retrospective", "strategic pivot note"
- "turn this into a deck / one-pager / microsite"

The skill collects five inputs (project, audience, distribution, content-shape, sensitivity) then resolves against a routing table with first-match semantics. No-match falls back to long-form-doc and logs the miss so the table can evolve.

## What's inside

- `skills/router/SKILL.md` — the routing logic + 8-phase workflow
- `skills/router/references/decisions-log-seed.md` — Fulcrum pilot findings (immutable; user-specific misses go to `~/.gstack/projects/<slug>/project-update-router/decisions-log.md`)
- `skills/router/references/templates/svg/` — parameterized SVG diagram templates (v0.2+)

## User state

Per-project runtime state lives at `~/.gstack/projects/<project-slug>/project-update-router/` — never inside the installed plugin. Keeps the plugin read-only; reinstalls don't stomp user history.

## Related

- `board-update` — investor/board PPTX with bad-news protocol; delegated target for the hybrid path
- `document-skills:web-artifacts-builder` — microsite generator backend
- `presentation-forge` — Slidev generator (v2)
- `impeccable:teach-impeccable` — run once per project before first microsite to seed brand context
- `ux-patterns` — domain UX pattern library (sibling plugin on this marketplace)

## License

MIT © Brian Lopez
