#!/usr/bin/env python3
"""
validate-project-update-yaml.py — advisory validator for project-update-router v0.3.0

Default mode: validates ./.claude/project-update.yaml relative to cwd.
  python3 validate-project-update-yaml.py [PATH_TO_YAML]

Learnings mode:
  python3 validate-project-update-yaml.py --learnings PATH_TO_JSONL

Advisory. Exit code is 0 even when warnings are emitted (to stderr). Exit 2 only
for hard failures (unparseable file, bad CLI args).

Python stdlib only. Parses a JSON-compatible YAML subset: quoted scalars, flow
lists [a, b], mappings with 2-space indent. Falls back to PyYAML if available
for richer parsing but doesn't require it.
"""

import argparse
import json
import os
import re
import sys
from datetime import date, datetime
from pathlib import Path

AUDIENCE_ENUM = {
    "self", "partner", "internal", "investor", "trainer", "client", "public",
}
DISTRIBUTION_ENUM = {
    "link-shareable", "attach-to-email", "present-live", "archival",
}
DEPLOY_TARGET_ENUM = {
    "vercel-prod-secure-route", "vercel-preview-unlisted", "local-spin-up",
    "local-file-only", "obsidian",
}
APPLIES_TO_ENUM = {"project", "plugin"}
KNOWN_PATTERNS_V030 = {
    "partner-update-hub-microsite", "self-retro-long-form",
}

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def warn(msg: str) -> None:
    print(f"WARN: {msg}", file=sys.stderr)


def try_pyyaml_load(text: str):
    try:
        import yaml  # type: ignore
    except ImportError:
        return None
    try:
        return yaml.safe_load(text)
    except Exception:
        # Fall through silently to the minimal parser. PyYAML chokes on some
        # valid-looking lines with em-dashes or mid-line colons; the minimal
        # parser is more permissive.
        return None


def parse_yaml_minimal(text: str) -> dict:
    """
    Minimal YAML subset parser. Handles:
      - top-level mappings with 2-space indent
      - lists of strings under a key
      - lists of mappings (each item a nested mapping)
      - quoted + unquoted scalars
      - ignores comments (# to end of line) and blank lines

    Not a full YAML parser. If this fails, the PyYAML fallback catches it.
    Returns a dict, or raises ValueError with a line number.
    """
    lines = text.splitlines()
    root: dict = {}
    stack = [(0, root)]
    list_stack: list = []  # list of (indent, list_ref)
    i = 0
    while i < len(lines):
        raw = lines[i]
        # strip comments
        if "#" in raw:
            in_str = False
            strip_at = None
            for idx, ch in enumerate(raw):
                if ch in ('"', "'"):
                    in_str = not in_str
                if ch == "#" and not in_str:
                    strip_at = idx
                    break
            if strip_at is not None:
                raw = raw[:strip_at]
        line = raw.rstrip()
        if not line.strip():
            i += 1
            continue
        indent = len(line) - len(line.lstrip())
        content = line.strip()
        # pop stacks deeper than current indent
        while stack and stack[-1][0] > indent:
            stack.pop()
        while list_stack and list_stack[-1][0] > indent:
            list_stack.pop()

        if content.startswith("- "):
            # list item
            item_body = content[2:].strip()
            if not list_stack or list_stack[-1][0] != indent:
                raise ValueError(f"line {i + 1}: list item without parent list")
            parent_list = list_stack[-1][1]
            if ":" in item_body and not (item_body.startswith('"') or item_body.startswith("'")):
                k, _, v = item_body.partition(":")
                new_map: dict = {}
                new_map[k.strip()] = _scalar(v.strip()) if v.strip() else None
                parent_list.append(new_map)
                stack.append((indent + 2, new_map))
            else:
                parent_list.append(_scalar(item_body))
            i += 1
            continue

        if ":" in content:
            k, _, v = content.partition(":")
            key = k.strip()
            val = v.strip()
            parent = stack[-1][1]
            if not isinstance(parent, dict):
                raise ValueError(f"line {i + 1}: expected mapping context, got {type(parent).__name__}")
            if val == "":
                # peek next non-empty line to decide list vs dict
                j = i + 1
                while j < len(lines) and not lines[j].strip():
                    j += 1
                if j < len(lines):
                    next_line = lines[j]
                    next_stripped = next_line.lstrip()
                    next_indent = len(next_line) - len(next_stripped)
                    if next_indent > indent and next_stripped.startswith("- "):
                        new_list: list = []
                        parent[key] = new_list
                        list_stack.append((next_indent, new_list))
                        i += 1
                        continue
                    if next_indent > indent:
                        new_map2: dict = {}
                        parent[key] = new_map2
                        stack.append((next_indent, new_map2))
                        i += 1
                        continue
                # fall through — treat as null
                parent[key] = None
            elif val.startswith("[") and val.endswith("]"):
                inner = val[1:-1].strip()
                parent[key] = [_scalar(p.strip()) for p in inner.split(",") if p.strip()]
            else:
                parent[key] = _scalar(val)
            i += 1
            continue

        # bare line — skip
        i += 1
    return root


def _scalar(s: str):
    if s == "":
        return None
    if (s.startswith('"') and s.endswith('"')) or (s.startswith("'") and s.endswith("'")):
        return s[1:-1]
    if s.startswith("|") or s.startswith(">"):
        return s
    low = s.lower()
    if low == "true":
        return True
    if low == "false":
        return False
    if low in ("null", "~"):
        return None
    try:
        if "." not in s and "e" not in low:
            return int(s)
        return float(s)
    except ValueError:
        return s


def load_yaml(path: Path) -> dict:
    text = path.read_text()
    # prefer PyYAML if available — it handles the full grammar
    data = try_pyyaml_load(text)
    if data is not None:
        if not isinstance(data, dict):
            raise ValueError(f"{path}: top-level must be a mapping")
        return data
    # fallback — minimal subset parser
    return parse_yaml_minimal(text)


def resolve_slug(yaml_data: dict, yaml_path: Path) -> str | None:
    project = yaml_data.get("project") or {}
    if isinstance(project, dict) and project.get("slug"):
        return str(project["slug"])
    # fallback: read gstack sessions or cwd name
    cwd = yaml_path.parent.parent  # from .claude/project-update.yaml to repo root
    return cwd.name


def gstack_updates_dir_for(slug: str) -> Path:
    return Path.home() / ".gstack" / "projects" / slug / "updates"


def last_updates_jsonl_for(slug: str) -> Path:
    return Path.home() / ".gstack" / "projects" / slug / "project-update-router" / "last-updates.jsonl"


def artifact_exists_for(slug: str, first_used: str) -> bool:
    """Check if anything in gstack archive matches the date."""
    updates_dir = gstack_updates_dir_for(slug)
    if updates_dir.exists():
        for f in updates_dir.iterdir():
            if first_used in f.name:
                return True
    last_jsonl = last_updates_jsonl_for(slug)
    if last_jsonl.exists():
        try:
            for line in last_jsonl.read_text().splitlines():
                if not line.strip():
                    continue
                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    continue
                ts = str(obj.get("timestamp") or obj.get("ts") or "")
                if ts.startswith(first_used):
                    return True
        except Exception:
            pass
    return False


def validate_yaml(path: Path) -> int:
    if not path.exists():
        warn(f"{path}: file not found (not-an-error — skipping validation)")
        return 0
    try:
        data = load_yaml(path)
    except Exception as e:
        print(f"ERROR: {path}: parse failed: {e}", file=sys.stderr)
        return 2
    warnings = 0
    slug = resolve_slug(data, path)

    # audiences
    audiences = data.get("audiences") or {}
    if isinstance(audiences, dict):
        for key, entry in audiences.items():
            if not isinstance(entry, dict):
                continue
            aud = entry.get("audience")
            if aud and aud not in AUDIENCE_ENUM:
                warn(f"audiences.{key}.audience='{aud}' not in enum {sorted(AUDIENCE_ENUM)}")
                warnings += 1

    # default_distribution_by_audience
    ddba = data.get("default_distribution_by_audience") or {}
    if isinstance(ddba, dict):
        for k, v in ddba.items():
            if k not in AUDIENCE_ENUM:
                warn(f"default_distribution_by_audience.{k} — '{k}' not an audience enum")
                warnings += 1
            if v and v not in DISTRIBUTION_ENUM:
                warn(f"default_distribution_by_audience.{k}='{v}' not in distribution enum {sorted(DISTRIBUTION_ENUM)}")
                warnings += 1

    # literacy_blocklist
    blocklist = data.get("literacy_blocklist") or {}
    if isinstance(blocklist, dict):
        for aud_key in blocklist:
            if aud_key not in AUDIENCE_ENUM:
                warn(f"literacy_blocklist.{aud_key} — '{aud_key}' not in audience enum")
                warnings += 1

    # instance_patterns
    patterns = data.get("instance_patterns") or []
    if isinstance(patterns, list):
        today = date.today()
        for idx, entry in enumerate(patterns):
            if not isinstance(entry, dict):
                continue
            pname = entry.get("pattern")
            if not pname:
                warn(f"instance_patterns[{idx}]: missing 'pattern' field")
                warnings += 1
                continue
            if pname not in KNOWN_PATTERNS_V030:
                warn(f"instance_patterns[{idx}].pattern='{pname}' is not a v0.3.0 known pattern ({sorted(KNOWN_PATTERNS_V030)}). Proposed-pattern? Log via learnings.jsonl applies_to:plugin.")
                warnings += 1
            first_used = entry.get("first_used")
            if not first_used:
                warn(f"instance_patterns[{idx}] ({pname}): missing 'first_used' — all entries MUST have a date")
                warnings += 1
            else:
                fu_str = str(first_used)
                if not DATE_RE.match(fu_str):
                    warn(f"instance_patterns[{idx}] ({pname}).first_used='{fu_str}' is not YYYY-MM-DD")
                    warnings += 1
                else:
                    try:
                        fu = datetime.strptime(fu_str, "%Y-%m-%d").date()
                        if fu > today:
                            warn(f"instance_patterns[{idx}] ({pname}).first_used={fu_str} is in the future")
                            warnings += 1
                        elif slug and not artifact_exists_for(slug, fu_str):
                            warn(f"UNVERIFIED: {pname} first_used={fu_str} has no corresponding update artifact in ~/.gstack/projects/{slug}/updates/ or last-updates.jsonl")
                            warnings += 1
                    except ValueError:
                        warn(f"instance_patterns[{idx}] ({pname}).first_used='{fu_str}' is not a parseable date")
                        warnings += 1
            deploy = entry.get("deploy") or {}
            if isinstance(deploy, dict):
                target = deploy.get("target")
                if target and target not in DEPLOY_TARGET_ENUM:
                    warn(f"instance_patterns[{idx}] ({pname}).deploy.target='{target}' not in {sorted(DEPLOY_TARGET_ENUM)}")
                    warnings += 1

    msg_path = os.path.relpath(path) if path.is_absolute() else path
    if warnings == 0:
        print(f"OK: {msg_path} (slug={slug}) — no warnings", file=sys.stderr)
    else:
        print(f"DONE: {msg_path} (slug={slug}) — {warnings} warning(s)", file=sys.stderr)
    return 0


def validate_learnings(path: Path) -> int:
    if not path.exists():
        warn(f"{path}: file not found (not-an-error — skipping)")
        return 0
    warnings = 0
    for lineno, raw in enumerate(path.read_text().splitlines(), start=1):
        if not raw.strip():
            continue
        try:
            obj = json.loads(raw)
        except json.JSONDecodeError as e:
            warn(f"line {lineno}: not valid JSON — {e}")
            warnings += 1
            continue
        for req in ("date", "pattern", "deploy_target", "audience"):
            if req not in obj:
                warn(f"line {lineno}: missing required field '{req}'")
                warnings += 1
        dt = obj.get("date")
        if dt and not DATE_RE.match(str(dt)):
            warn(f"line {lineno}: date='{dt}' not YYYY-MM-DD")
            warnings += 1
        dtarget = obj.get("deploy_target")
        if dtarget and dtarget not in DEPLOY_TARGET_ENUM:
            warn(f"line {lineno}: deploy_target='{dtarget}' not in {sorted(DEPLOY_TARGET_ENUM)}")
            warnings += 1
        aud = obj.get("audience")
        if aud is not None:
            if not isinstance(aud, list):
                warn(f"line {lineno}: audience must be a list")
                warnings += 1
            else:
                for a in aud:
                    if a not in AUDIENCE_ENUM:
                        warn(f"line {lineno}: audience '{a}' not in {sorted(AUDIENCE_ENUM)}")
                        warnings += 1
        applies = obj.get("applies_to")
        if applies and applies not in APPLIES_TO_ENUM:
            warn(f"line {lineno}: applies_to='{applies}' not in {sorted(APPLIES_TO_ENUM)}")
            warnings += 1
    if warnings == 0:
        print(f"OK: {path} — no warnings", file=sys.stderr)
    else:
        print(f"DONE: {path} — {warnings} warning(s)", file=sys.stderr)
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="Advisory validator for project-update-router v0.3.0+")
    ap.add_argument("yaml_path", nargs="?", default=".claude/project-update.yaml",
                    help="Path to .claude/project-update.yaml (default: ./.claude/project-update.yaml)")
    ap.add_argument("--learnings", metavar="JSONL_PATH",
                    help="Validate a .claude/project-update-learnings.jsonl file instead")
    args = ap.parse_args()
    if args.learnings:
        return validate_learnings(Path(args.learnings).expanduser())
    return validate_yaml(Path(args.yaml_path).expanduser())


if __name__ == "__main__":
    sys.exit(main())
