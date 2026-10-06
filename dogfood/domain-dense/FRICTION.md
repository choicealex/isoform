# Friction log: /isoform-animate domain (rounded-left)

1. `find.mjs office building` -> "no match: Isocons may not have this object." Had to guess `domain` from the Business & Payments category; `find.mjs building` also no match. The `--all` hint was no help; synonyms (building -> domain) are missing.
2. inspect.mjs lists 33 faces and its "sweep" line says "group them into a few parts"; the labels "left/right/top" do not say which direction a face's plane runs. I mis-derived level-line slope (v instead of u) at first and only caught it by checking window tops numerically. Docs should say: left faces run along u, level lines on them have slope u[1]/u[0].
3. The 8 windows are each TWO faces (reveal pairs), found only by staring at the parts PNG. A pairing hint would help.
4. concepts.md has Business&Payments "buildings" in a category blurb but no building story; had to invent one. Fine, but nothing on lit windows / lamp colour.
5. First look.mjs run: "physics   the effect has no trace: draw what happens in hairline first, the effect only adds material under it (rule 11)" / "validate  fix these first; no pictures taken". Good, clear. But SKILL says trace via `trace` / `part.trace`; the top-level `trace(svg,...)` isn't shown in any example I read. I guessed from the kernel index.
6. My sash pop (move along +v) left a ghost outline of the window at rest; fixed with `ic.face(i,0,0,0,part)` per face. SKILL's table says "draw what it hid: icon.face" - worked, but the `before` arg must be a part so the part must be made first. Not stated.
7. look.mjs low and high shots are indistinguishable for a small range (2..7 units); readouts identical, easy to miss that the slider does little.
8. Effect halo renders blocky (~16px cells) in the zoom, even with 24 taps; looks like the mask is sampled at low resolution. Could not fix from the figure.
9. `--at 160,150` held the pointer so every answering shot showed all 4 floors; no way to see partial hover states in the sheet.
10. Worked well: look.mjs exit codes, per-shot readouts, one sheet, the validator's rule-11 catch, `story` with beats, `u`/`v` axes measured correctly (no override needed).
