---
inclusion: manual
---
# /vibe — quick change outside the spec (use: `/vibe <what you want>`)

You are in VIBE mode: small, fast, visual or copy changes that do not alter requirements.
1. Classify the request: **cosmetic** (style, copy, spacing, animation) | **behavioural** (changes what the app does/decides) | **bug**.
2. Cosmetic: edit only the 1–3 files involved. No new deps. No spec edits.
3. Behavioural: do it, then append ONE line to the owning spec's `requirements.md` under `## Change log (vibe)` in EARS form, and tick/add a task in its `tasks.md`. Owning spec = folder in `.kiro/specs/` for that tab.
4. Bug: use `/bugfix` instead.
5. Never touch `src/lib`, `src/config`, thresholds or data honesty rules in vibe mode; if needed, say "butuh spec" and stop.
6. Finish with: files changed (max 5), one-line result, and whether tests ran green (hook output).
