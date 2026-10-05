# Motion fine-tune plan (2026-10-05)

Synthesis of `heroicons-animated.md` (Aniket-508/heroicons-animated, MIT, 317 icons) and `starred-repos.md` (21 new stars; pqoqubbw/icons, ai-iso-skill, interface-polish, jakubkrehel/skills — all MIT). Proposed, not yet applied.

| # | Change | Source | Where |
|---|---|---|---|
| 1 | Traces draw on: `pathLength=1`, dash `1 1`, offset 1→0, 0.4–0.6s ease-out, with a 0.1s opacity pre-roll so the round cap's dot never shows; 0.1s stagger between multiple traces | heroicons (74/317), pqoqubbw `bookmark-x`, `check`, `zap` | kernel `trace` → `t.reveal()` / `t.hide()` |
| 2 | Exit softer than enter: return-to-rest ~0.6× the distance/time, ease-out, no stagger, no overshoot on the way back | interface-polish, jakubkrehel/skills | kernel: `spring` presets `enter` / `exit`; rule 08 |
| 3 | Spring vocabulary: `settle` 200/25 (no overshoot, the default for the whole icon's small gesture), `hero` 400/10 (one meaningful part only), `float` 50/10 (water, ambient) | heroicons counts, pqoqubbw counts | kernel `SPRING` presets; rule 08 |
| 4 | Whole-icon nudge + one hero part: the icon makes a 1–1.5 unit gesture, the part that carries the meaning moves on the hero spring | heroicons trash/lock | rule 05/08, examples |
| 5 | Decaying keyframes for hinged/struck things: `[0,-10,10,-10,0]`·amp over 0.5s; anticipation pop `[1,.9,1.2,1]`; kick-and-settle `[0,2,0]` times `[0,.4,1]` | heroicons bell, star, paper-airplane | kernel `keys(values, times, dur)` on the tween clock |
| 6 | Fast tier: a press is 60ms ease-out (`translateY 4`), next to the 700ms tween | ai-iso-skill | rule 08 third clock |
| 7 | Hairlines stay sharp in motion: snap part translations to device pixels when at rest | harvest-research `snapToDevicePixel` | kernel `part.move` |
| 8 | Reduced motion: already in kernel; keep; neither upstream has it | — | — |
| 9 | Handle API for the future package: `startAnimation()/stopAnimation()` + controlled mode, so one pointer value can drive many icons (site catalogue, hover on a card) | heroicons architecture | later, with the npm/site work |

Licences: all MIT (verified LICENSE files). We reuse patterns and numbers, no code verbatim; credit in NOTICE.md.
