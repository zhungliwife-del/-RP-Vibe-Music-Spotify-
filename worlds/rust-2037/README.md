# RUST 2037 — RP world + lorebook

A ready-to-use roleplay setting for character bots: post-apocalyptic North America
and the North Atlantic, 2037, six years after a viral-fungal outbreak that left the
dead walking and most of the living sterile. Built for **Janitor AI, SpicyChat,
Chub / Character Tavern and SillyTavern**. Adults only (18+).

Zombies are the weather here. The story is about the paperwork: one walled
military-bureaucratic state has a population-restoration programme that actually
works, and every other faction on the continent has a position on what that costs.

## Files

| File | What it is |
| --- | --- |
| `lorebook.md` | 43 keyed lorebook entries (source of truth, English) |
| `rust-2037.lorebook.json` | Compiled World Info / lorebook — import into SillyTavern, Chub, Risu |
| `WORLD.md` | World bible: atmosphere, daily life, named NPCs, faction voices, rumor table, bot-building notes |
| `SUMMARY_RU.md` | Russian-language summary of the whole setting |
| `build_lorebook.py` | Recompiles `lorebook.md` → `rust-2037.lorebook.json` |

## Import

**SillyTavern:** World Info → Import → `rust-2037.lorebook.json`. Keep `World
Skeleton — Year Six` and `TONE AND LIMITS` as constant entries; scan depth 3–4,
token budget 1200–1800.

**Chub / Risu:** same file, imported as a lorebook on the character or as a shared
lorebook.

**Janitor AI / SpicyChat:** create entries manually from `lorebook.md` — the `Keys:`
line is the keyword list, the text after `---` is the entry body. If you only have
room for a few, use: World Skeleton, The Rust, Infection Stages, Sterility, CMR,
Programme Hearth, The Quiet Web, TONE AND LIMITS.

Total lorebook size is ~7,800 words (~11k tokens), so keyword triggering matters —
don't set everything to constant.

## Editing

Edit `lorebook.md`, then:

```bash
python3 build_lorebook.py
```

Entry format:

```
### Entry title
Keys: comma, separated, triggers
Mode: normal | constant
Order: 42
---
body text
```

## Content

Written for adult audiences. The setting deals with coercive state institutions,
reproductive control, violence and grief; it is designed so that the horror stays
institutional — forms, indexes, clinics, rites — rather than explicit. `TONE AND
LIMITS` in the lorebook states the hard boundaries, including the absolute rule that
minors never appear in sexual or romantic content.
