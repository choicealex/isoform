# Friction log (toggle-on sharp-right)

1. SKILL.md says "Ask which view the person wants" and "offer two or three concepts, wait". Nobody to ask: took the default-physical rule; the only concept in concepts.md for toggle-on has no effect at all ("most physical" is a null choice), so I used the Slide-and-land worked example.
2. `inspect.mjs` prints every face as `curved` for toggle-on sharp-right. The `facing` column is useless here; also sharp-right of this icon is a rounded pill, so "sharp" vs "rounded" tells you nothing about the drawing.
3. Docs/concepts say the toggle knob "slides along u". In this view the pill's long axis is v (u is the thickness direction). The printed `axes u 0.90,0.44 v -0.86,0.52 (measured; ...)` was right; I only learned which axis to slide by reading the parts PNG. Docs should say "find the long axis on the PNG".
4. Unclear whether I must pass {u,v}: line said "(measured; check them against the corners)". I first passed them, then removed them; the result was identical. Passing them was not needed.
5. `icon.ink` / `story` ordering and `trace.draw(lines, reveal)` were clear from the index; bolt.js was a good template. The `hi` / `rest` / `poster` docs worked well.
6. look.mjs exited 0 even though the first sheet showed a ghost ring (the seat the knob left, a hole outline in face 0). The script cannot see rule 06; only the eyes did. Fixed with `ic.face(2,0,0,0,knob)` copying the knob face to its seat. Not documented for a hole in a coplanar face; I guessed it would work and it did, leaving a dim socket ring.
7. `--at`/`--edge` need a point for "nearness"; with no effect I still had to supply `--edge`. `--zoom answer` worked and wrote isoform-toggle-answer.png.
8. look.md items 10/11 (effect, both themes) have no answer for a figure with no effect; skill says "optionally" an effect but the twelve questions assume one.
9. Several look.mjs readouts "slide 24 / slide 64" are numbers; fine. Read-out `story-25=slide 24` shows the story's 25% is mostly hold; sheet frames are not very telling.
10. Worked well: parts PNG with a stage-unit grid, build.mjs, the one-command look sheet, the kernel index.
