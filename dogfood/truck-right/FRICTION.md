# Friction log (isoform-animate, local-shipping rounded-right)

1. SKILL.md says `--edge x,y` "give it twice for a point per end"; with a single --edge it silently ran (low/high used the same point). Fine, but the SKILL step 4.1 example shows one --edge only.
2. `look.mjs` reported `every picture came to rest` and exit 0 while my rim marks were visibly in the wrong place (see 3). The automated checks cannot catch misplaced traces; only the sheet did.
3. Docs unclear: `part.trace` says it "moves with the part", but it does NOT: my rim arcs stayed at the rest position while the part moved (rocket.js subtracts lift for its hull trace, which is the hint). Fixed by adding the part's offset myself. Wasted one iteration.
4. `inspect.mjs` labels both big faces "curved", no hint which is side/end. The parts PNG was needed; it worked well.
5. Axes were measured (u 0.90,0.44 v -0.86,0.52) and matched the corners; I did not pass {u,v}. Nothing slid off its edges.
6. `ic.u`/`ic.v` as vectors are not documented in the index (only "icon.u runs down-right"); I guessed they are [dx,dy] and it worked.
7. Wheels are tiny hub ellipses, not tyres; my R=8.7 came from guessing a circle in the (v, up) plane. It matched the box, but the skill gives no helper for ellipse on a face plane.
8. Dust effect is faint at the `effect` shot (pointer nudge, dust channel low); only visible in story-50/poster. Not tuned further.
9. Worked well: find.mjs, inspect picture with stage grid, look.mjs sheet with story shots, rocket.js as template, zero kernel edits needed.
10. Parts moving as one unit means no holes and no paint-order issues; no after() needed.
