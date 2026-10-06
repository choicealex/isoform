# Friction log, isoform-animate "flight"

1. `node find.mjs airplane` / `plane` both: "no match: Isocons may not have this object." Only `flight` worked. Message hint (what it is made of) did not help; no synonym list.
2. Step 1 says "Ask which view" but also gives default; fine. No one to ask, took rounded-left.
3. inspect.mjs prints `axes u 0.60, 0.80  v -0.89, 0.45 (measured; check them against the corners above)`. Checked: big edges of faces 1/9/10 agree; face 4's sliver (wing, swept) has dy/dx -0.24 vs v's -0.5, which looks like disagreement but is a swept edge not an axis edge. Docs don't say how to tell. No warnings printed. Left axes alone.
4. The icon is a plane in plan view extruded along v: nose points "up" screen, tail bottom. Not obvious from the parts png; I had to reason which face is nose/tail from the picture. No orientation hint in inspect output.
5. concepts.md has a "Flight takeoff" entry for `flight-takeoff` and rocket.js, so the nearest example is almost a copy; useful but I mostly adapted rocket.js.
6. SKILL.md says "Read the index down to var IF" - worked well, the index is complete. `trace(svg,{under:true})` vs `part.trace` clear.
7. First look.mjs run exit 0 but plane tail origin was guessed (205,262) and contrail started beside the fuselage, not at it. Nothing in look.mjs checks that a trace is anchored to a part; only my eye on the zoom did. Moved to (214,264).
8. `--edge` given twice with same point; docs fine. The sheet is 1888x4102, shrunk to ~half: hard to judge details; --zoom effect was essential.
9. Effect on a white plate: pale vapour was invisible until I raised alpha and tinted blue-grey. No guidance on a light "vapour" colour (rule 12 says palette or physical colour; contrail is white/grey which fails on white).
10. Worked well: build/look single command, "every picture came to rest" line, clear readout line.
11. (my own error, not the skill) BSD sed -i failed; fixed with python. look.mjs also gave no warning that a trace sat inside the plane (exhaust stub started above the tail end); only the zoom showed it.
