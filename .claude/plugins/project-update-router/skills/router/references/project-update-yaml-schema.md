# `.claude/project-update.yaml` — Schema

Per-project context file read by `project-update-router` v0.3.0+ during Phase 0 (Probe Protocol). Lives in each project repo at `.claude/project-update.yaml`, version-controlled with the code it describes.

**All fields are OPTIONAL.** Missing file → router probes what it can from filesystem + prompts user. Missing subfields → router falls back to defaults or asks.

## Schema

```yaml
# .claude/project-update.yaml

# -------------------------------------------------------------
# project — identity overrides. Probes fill in missing values.
# -------------------------------------------------------------
project:
  slug: <str>                 # OPTIONAL. Authoritative override for gstack slug.
                              # Example: "brian-odyssey-fulcrum-fitness"
                              # If absent, Probe 1 infers from gstack-slug → git remote → .beads.

  beads_prefix: <str>         # OPTIONAL. Override for beads issue prefix.
                              # Example: "ff", "INP". Case-sensitive.

  # git_repo and repo_path are PROBED from `git remote -v` and `$PWD`.
  # Listed here only when the probe is wrong and you need to override:
  git_repo: <str>             # OPTIONAL. e.g. "Odyssey-Mercantile/fulcrum-fitness"
  repo_path: <path>           # OPTIONAL. e.g. "~/Workshop/projects/fulcrum-fitness"

  repo_path_suffix: <str>     # OPTIONAL. Subdir where the Next.js / web app lives in a monorepo.
                              # Example: "platform" for intension-pilates.
                              # Probe 4 looks HERE for package.json / vercel.json when set.

  production_domain: <str>    # OPTIONAL. Override for Probe 4 Level-4 custom-domain detection
                              # when .vercel/project.json is missing the alias.
                              # Example: "intensionpilates.com"

# -------------------------------------------------------------
# audiences — named humans → router audience enum + handoff.
# Consumed by Probe 2. Used in Phase 1 (resolve "update for <name>"),
# Phase 2.5 (context_notes), Phase 3 (literacy filter seed), Phase 7 (handoff line).
# -------------------------------------------------------------
audiences:
  <key>:                                   # any snake_case key, e.g. "adam_eby", "self", "tennille"
    full_name: <str>                       # REQUIRED within audience entry. Human's display name.
    audience: <enum>                       # REQUIRED. One of:
                                           #   self | partner | internal | investor | trainer | client | public
    role: <str>                            # OPTIONAL. Short description of their relationship to the project.
    handoff:
      primary: <enum>                      # OPTIONAL. One of:
                                           #   slack_dm | email | obsidian_archival | in_app_announcement
                                           #   | marketing_email | link_shareable_unlisted | link_shareable_public
                                           #   | in_person_meeting | attach-to-email
      template: <str>                      # OPTIONAL. Handoff-line template used in Phase 7.
    context_notes:                         # OPTIONAL. Bullet-style hints for Phase 2.5 audience-reframing.
      - <str>
      - <str>
    disambiguation: <str>                  # OPTIONAL. Note for cross-project collisions
                                           # (e.g., two people with the same first name in different projects).

# -------------------------------------------------------------
# default_distribution_by_audience — overrides router base defaults.
# Consumed by Probe 2; used in Phase 1.
# -------------------------------------------------------------
default_distribution_by_audience:
  partner:   <enum>          # OPTIONAL. Base default: link-shareable.
  self:      <enum>          # OPTIONAL. Base default: archival.
  internal:  <enum>          # OPTIONAL.
  investor:  <enum>          # OPTIONAL. Base default: attach-to-email.
  trainer:   <enum>          # OPTIONAL.
  client:    <enum>          # OPTIONAL.
  public:    <enum>          # OPTIONAL.
  # Enum values: link-shareable | attach-to-email | present-live | archival

# -------------------------------------------------------------
# literacy_blocklist — tokens to strip / substitute per audience.
# Consumed by Probe 2; seeds Phase 3 literacy filter.
# -------------------------------------------------------------
literacy_blocklist:
  <audience-enum>:           # one of: partner | internal | investor | trainer | client | public
    - <token>                # literal or glob (workshop-*, INP-*)

# -------------------------------------------------------------
# locations — project-specific data (inTension uses this for studios).
# Not consumed by router v0.3.0 directly; available for generator pattern use.
# -------------------------------------------------------------
locations:
  <slug>:
    mt_id: <int>
    duda_page_id: <int>
    status: <str>            # free-text; e.g. "open", "opening-2026-04-18"

# -------------------------------------------------------------
# instance_patterns — OBSERVED pattern instances.
# Each entry MUST have first_used that corresponds to a real past update.
# Validator bin/validate-project-update-yaml.py cross-checks against
# ~/.gstack/projects/<slug>/updates/ + last-updates.jsonl.
# Speculative entries = UNVERIFIED warning.
# -------------------------------------------------------------
instance_patterns:
  - pattern: <str>                                 # REQUIRED. Must match a known pattern name in SKILL.md Pattern Library.
                                                   # v0.3.0 patterns: partner-update-hub-microsite, self-retro-long-form
    first_used: <YYYY-MM-DD>                       # REQUIRED. Past date, not future.
    last_used: <YYYY-MM-DD>                        # OPTIONAL.
    use_count: <int>                               # OPTIONAL.
    deploy:                                        # REQUIRED shape depends on pattern. Common fields below.
      target: <enum>                               # REQUIRED. One of:
                                                   #   vercel-prod-secure-route | vercel-preview-unlisted
                                                   #   | local-spin-up | obsidian | local-file-only
      production_url: <url>                        # OPTIONAL. For Vercel targets.
      route: <path>                                # OPTIONAL. For microsite patterns.
      repo_path: <path>                            # OPTIONAL.
      app: <enum>                                  # OPTIONAL. next-existing | next-scaffold
      write_mode: <enum>                           # OPTIONAL. overwrite-with-archive | new-subroute
      archive_dir: <path>                          # OPTIONAL. Where to archive prior content before overwrite.
      archive_filename_pattern: <str>              # OPTIONAL. Default: "{timestamp}-archive.tsx"
      sensitivity_default: <enum>                  # OPTIONAL. public | unlisted | password | private-local
      automation_bypass_env: <str>                 # OPTIONAL. ENV VAR NAME ONLY, not the value.
                                                   # Router resolves at runtime from ~/.gstack/projects/<slug>/.env
                                                   # or repo .env.local.
      # For target: obsidian:
      vault: <str>                                 # e.g. "ObsidianVault"
      vault_folder: <path>                         # e.g. "Compiled/Fulcrum-Retros"
      filename_pattern: <str>                      # e.g. "{date}-{content_shape}.md"
      also_archive_to: <path>                      # e.g. "~/.gstack/projects/<slug>/updates/"
    handoff_template: <str>                        # OPTIONAL. Multi-line string; overrides audience default.

# -------------------------------------------------------------
# anti_slop_supplement — project-specific anti-slop reminders
# that DESIGN.md does not cover (e.g., capitalization rules).
# Consumed by Phase 4.5 (pre-publish validation), v0.4+.
# -------------------------------------------------------------
anti_slop_supplement:
  - <str>
```

## Validation

Run `bin/validate-project-update-yaml.py` (Python stdlib-only, advisory — exit 0 with stderr warnings):

```
python3 ~/.claude/plugins/marketplaces/odyssey-plugins/.claude/plugins/project-update-router/bin/validate-project-update-yaml.py
# Defaults: reads ./.claude/project-update.yaml relative to cwd.
```

**Checks performed:**

1. File parses as YAML.
2. If `instance_patterns` present:
   - Each entry has `pattern:` (string) and `first_used:` (YYYY-MM-DD, not future).
   - `first_used` corresponds to an entry in `~/.gstack/projects/<slug>/updates/` archive OR `~/.gstack/projects/<slug>/project-update-router/last-updates.jsonl` OR a file in `~/.gstack/projects/<slug>/updates/` whose filename includes `first_used`. If no match → warning `UNVERIFIED: <pattern> first_used=<date> has no corresponding update artifact.`
   - `deploy.target` is one of the enum values.
3. If `default_distribution_by_audience` present: values are enum-valid.
4. `audiences.<key>.audience` values are enum-valid.
5. `literacy_blocklist` keys are audience-enum-valid.

The validator does not enforce shape — it surfaces warnings. The router prints any warnings during Probe 5 before proceeding. A project can ship with warnings.

## Example

See `~/Workshop/projects/fulcrum-fitness/.claude/project-update.yaml` (two observed instance_patterns) and `~/Workshop/projects/intension-pilates/.claude/project-update.yaml` (no instance_patterns — nothing observed yet).
