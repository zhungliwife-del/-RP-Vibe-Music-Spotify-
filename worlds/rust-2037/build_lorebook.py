#!/usr/bin/env python3
"""Compile lorebook.md into a SillyTavern / Chub / Risu compatible World Info file.

Usage:
    python3 build_lorebook.py [source.md] [output.json]

Source format (see lorebook.md):

    ### Entry title
    Keys: comma, separated, keys
    Mode: normal | constant
    Order: 10
    ---
    body text until the next '### ' heading
"""

import json
import re
import sys
from pathlib import Path

HEADING = re.compile(r"^### (.+?)\s*$")
FIELD = re.compile(r"^(Keys|Mode|Order):\s*(.*)$", re.IGNORECASE)


def parse(text):
    entries = []
    current = None
    body = []
    in_body = False
    in_fence = False

    for line in text.splitlines():
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            if in_body:
                body.append(line)
            continue
        if in_fence:
            if in_body:
                body.append(line)
            continue

        heading = HEADING.match(line)
        if heading:
            if current:
                current["content"] = "\n".join(body).strip()
                entries.append(current)
            current = {"comment": heading.group(1), "keys": [], "mode": "normal", "order": 100}
            body, in_body = [], False
            continue

        if current is None:
            continue

        if not in_body:
            field = FIELD.match(line)
            if field:
                name, value = field.group(1).lower(), field.group(2).strip()
                if name == "keys":
                    current["keys"] = [k.strip() for k in value.split(",") if k.strip()]
                elif name == "mode":
                    current["mode"] = value.lower()
                elif name == "order":
                    current["order"] = int(value)
                continue
            if line.strip() == "---":
                in_body = True
                continue
            continue

        if line.strip() == "---" and body and not line.startswith("  "):
            # closing separator between entries
            continue
        body.append(line)

    if current:
        current["content"] = "\n".join(body).strip()
        entries.append(current)

    return [e for e in entries if e["keys"] and e["content"]]


def to_world_info(entries):
    out = {}
    for uid, entry in enumerate(entries):
        constant = entry["mode"] == "constant"
        out[str(uid)] = {
            "uid": uid,
            "key": entry["keys"],
            "keysecondary": [],
            "comment": entry["comment"],
            "content": entry["content"],
            "constant": constant,
            "vectorized": False,
            "selective": True,
            "selectiveLogic": 0,
            "addMemo": True,
            "order": entry["order"],
            "position": 0 if constant else 1,
            "disable": False,
            "excludeRecursion": False,
            "preventRecursion": False,
            "delayUntilRecursion": False,
            "probability": 100,
            "useProbability": True,
            "depth": 4,
            "group": "",
            "groupOverride": False,
            "groupWeight": 100,
            "scanDepth": None,
            "caseSensitive": False,
            "matchWholeWords": None,
            "useGroupScoring": None,
            "automationId": "",
            "role": 0,
            "sticky": 0,
            "cooldown": 0,
            "delay": 0,
            "displayIndex": uid,
        }
    return {"entries": out}


def main():
    here = Path(__file__).parent
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else here / "lorebook.md"
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else here / "rust-2037.lorebook.json"

    entries = parse(src.read_text(encoding="utf-8"))
    if not entries:
        sys.exit("no entries parsed — check the source format")

    dst.write_text(
        json.dumps(to_world_info(entries), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"{len(entries)} entries -> {dst}")
    total = sum(len(e["content"].split()) for e in entries)
    print(f"~{total} words, ~{int(total * 1.4)} tokens total")


if __name__ == "__main__":
    main()
