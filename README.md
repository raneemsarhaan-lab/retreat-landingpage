# retreat-landingpage

## Skills

This repository bundles the [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
Claude Code skill at `.claude/skills/ui-ux-pro-max/` (MIT, v2.13.0). It provides a searchable
local database of UI styles, palettes, font pairings, UX guidelines, icons, GSAP presets,
chart types, and per-stack implementation guidance.

Query it from the repository root (requires Python 3.x, no external dependencies):

```bash
# Full design system for a new page/project
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "wellness retreat booking" --design-system -p "Retreat"

# Focused lookup
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "focus visible keyboard" --domain ux

# Stack-specific guidance
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack html-tailwind
```

See `.claude/skills/ui-ux-pro-max/SKILL.md` for the full workflow and domain list.
