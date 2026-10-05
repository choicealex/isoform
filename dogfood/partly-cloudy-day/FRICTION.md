# Friction log: partly-cloudy-day

- Worked well: inspect.mjs parts picture + grid made faces identifiable; look.mjs first run exit 0 at first build (no validator errors).
- cwd trap: SKILL.md says "run scripts from there by their path"; no hint that the skill folder path has a space (quote it). Minor.
- inspect.mjs does not print icon.u / icon.v directions; I estimated them (30 degrees) from the picture. Doc should print them.
- inspect.mjs says "paint order" by index; unclear whether 3,4 (painted before disc 8) can be grouped with 14,15 into one part (part paints where last face did). Had to try.
- Needed disc ellipse axes for halo/glints: not available from inspect (only boxes incl. clipped), estimated.
- Attempt 1 (glints on an assumed ellipse): validator + look.mjs exit 0, yet the sheet showed tiny stray ticks in wrong places, no bright in `answer`. Exit 0 said nothing about the look. look.md says so; true.
- Attempt 2 (longer glints, bright moves to light): still strokes at wrong angles; cause = I guessed the disc's ellipse. inspect.mjs gives no ellipse/axis data for curved faces; icon.u/v not printed. Doc should give icon.u/v for the default placement and say how to measure a curved face.
- Attempt 3 (rays slide out, beams removed): reads better, but now the figure has NO trace of its own (rule 11) and look.mjs/validate did not complain. Rule 11 not machine-checked when traces are removed.
- `--at` in the story mapped to full cover (hover near sun = overcast); the --at/read-out in `answer` always shows the extreme; doc could say pick a point giving a mid state.
- Part highlight: splitting one hi part into many parts makes every part get its own bright silhouette ("Hairline way") only if hi; unclear which parts get bright silhouette by default. Rays unhi'd turned grey, so rule 04 "one bright" is by hi() only. Fine, but undocumented in SKILL.md.
- Disc-ellipse guess cost the most time (~2 iterations). Needed: a way to read an arbitrary path's geometry (getPointAtLength) without reading kernel code.
- Not finished to the bar: see final report.
