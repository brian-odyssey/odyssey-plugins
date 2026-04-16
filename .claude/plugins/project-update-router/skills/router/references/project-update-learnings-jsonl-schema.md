# `.claude/project-update-learnings.jsonl` — Schema

Per-project learnings log, append-only, **hand-edited in v0.3.0**. Lives in each project repo at `.claude/project-update-learnings.jsonl`, version-controlled with the code. Router does NOT auto-write in v0.3.0.

One JSON object per line.

## Schema

```json
{
  "date": "YYYY-MM-DD",
  "pattern": "<pattern-name>",
  "deploy_target": "<enum>",
  "audience": ["<enum>", "..."],
  "what_worked": "<str>",
  "what_surprised": "<str>",
  "applies_to": "<enum>"
}
```

### Fields

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `date` | **required** | `YYYY-MM-DD` | The date the learning was observed (usually the update date). Past, not future. |
| `pattern` | **required** | string | Must match a known pattern name. v0.3.0: `partner-update-hub-microsite` or `self-retro-long-form`. Novel pattern? Use a short-slug name (e.g., `staff-announcement-drafted-first-time`) and flag `applies_to: plugin` to propose promotion. |
| `deploy_target` | **required** | enum | One of: `local-spin-up`, `vercel-preview-unlisted`, `vercel-prod-secure-route`, `local-file-only`, `obsidian` |
| `audience` | **required** | array of enums | Each element is one of: `self`, `partner`, `internal`, `investor`, `trainer`, `client`, `public` |
| `what_worked` | optional | string | Short — what was worth repeating. |
| `what_surprised` | optional | string | Short — what the prior mental model got wrong. |
| `applies_to` | optional | enum | One of: `project`, `plugin`. Default (if absent): `project`. `plugin` = candidate for promotion into router SKILL.md. v0.4 surfaces these automatically. |

## Example

```json
{"date":"2026-04-15","pattern":"partner-update-hub-microsite","deploy_target":"vercel-prod-secure-route","audience":["partner","self"],"what_worked":"archive-before-overwrite caught a deleted Apr-2 hub","what_surprised":"403 Security Checkpoint on initial verification — needed VERCEL_AUTOMATION_BYPASS_SECRET","applies_to":"project"}
{"date":"2026-04-15","pattern":"self-retro-long-form","deploy_target":"obsidian","audience":["self"],"what_worked":"mirror to gstack-updates-dir kept freshness window intact","applies_to":"project"}
```

## Validation

Run the validator with `--learnings`:

```
python3 ~/.claude/plugins/marketplaces/odyssey-plugins/.claude/plugins/project-update-router/bin/validate-project-update-yaml.py \
  --learnings ./.claude/project-update-learnings.jsonl
```

**Checks performed:**

1. File is line-delimited JSON (each line parses).
2. Each line has required fields: `date`, `pattern`, `deploy_target`, `audience`.
3. `deploy_target` is enum-valid.
4. `audience` values are enum-valid.
5. `applies_to` (if present) is enum-valid.

Advisory only (exit 0 with stderr warnings). Missing file = not-an-error.

## When to log a learning

- After publishing an update (Phase 7 handoff).
- When you notice a small decision that future-you would want to remember (archive-before-overwrite, bypass-secret-needed, don't-use-term-X-for-this-audience).
- When a pattern gets used in a new way worth promoting (`applies_to: plugin`).

Don't log everything. Log the things a future author of a similar update would thank you for.

## v0.4 commitment

v0.4 will query `.claude/project-update-learnings.jsonl` across all projects and surface `applies_to: plugin` entries as promotion candidates — proposed edits to this SKILL.md's Pattern Library or Routing Table for human review. v0.3.0 is manual promotion. See CHANGELOG.
