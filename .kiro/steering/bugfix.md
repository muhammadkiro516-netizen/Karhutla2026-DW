---
inclusion: manual
---
# /bugfix — minimal-token debugging (use: `/bugfix <symptom + where>`)

1. Restate the symptom in one line. Ask for the exact error text/screenshot only if none was given.
2. Form ≤2 hypotheses. Read ONLY the files on the stack trace or the component named (max 4 files).
3. If logic in `src/lib`: write a failing Vitest case first, then fix, then run `npx vitest run <file>`.
4. If UI/data: fix at the narrowest layer (hook > component > route). Keep the 6 data states intact.
5. Never "fix" by hiding data, adding fake values, or deleting tests.
6. Report: root cause (1 line), fix (1–2 lines), test proof.
