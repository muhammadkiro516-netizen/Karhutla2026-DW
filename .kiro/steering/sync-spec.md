---
inclusion: manual
---
# /sync-spec — fold vibe changes back into specs (use after a vibe session)

1. Run `git diff --stat HEAD~5` (or since last tag) to list changed files; do not read full diffs unless a file's purpose is unclear.
2. For each behavioural change not yet in a spec, add one EARS line to the owning `requirements.md` → `## Change log (vibe)` and a ticked task in `tasks.md`.
3. Do not rewrite existing requirements; append only.
4. Output the list of lines appended (≤10).
