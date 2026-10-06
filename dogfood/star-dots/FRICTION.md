# Friction log: isoform-animate star (rounded-left)

1. Concept step: nobody to ask; took "Brand" (star drops on plate, ring, hot-metal glow, cools): most physical. concepts.md has no entry for a symbol-with-physics; "heat" one-liner in "Other answers" was the only hook.
2. inspect.mjs printed "sweep  3 zero-size faces: leave them out of parts". I did. Result: three stray specks stayed fixed on stage while the star lifted (visible in the zoomed effect shot). Advice is wrong for a moving part; putting 5,6,7 inside the star part fixed it. SKILL.md/inspect should say "put them in the part".
3. Faces 0-4 are all one object; no cut needed, no after(), no facet. Whole-object moves were easy. Good: no axes warning, `axes ... (measured)` fine.
4. look.mjs's `answer`/`effect` shots hold the pointer, which takes over the story: with my first version heat stayed 0, so every effect shot showed NO effect (looked like a broken effect). Nothing in SKILL.md/look.md warns that hover must itself drive the effect channel. Fixed by live heat = hand*0.7. Cost one iteration.
5. Consequently the `answer` (lines only) picture shows no ring trace, only a lift: Q8 is weak for hover; ring only appears in story shots.
6. `sed -i` on macOS: "sed: 1: "star.js ... unterminated substitute pattern" (my shell, not the skill), used python instead.
7. story-25 reads "rest" though the lift beat should be underway: unclear what `?t=` fraction maps to (intro included?). Docs don't say.
8. The `--zoom effect` flag is mandatory-in-spirit but the sheet is 1888x4102 and hard to judge; zoom png was what I actually judged.
Worked well: examples/bolt.js was an adequate template; build+validate+look in one command; the "no warnings" path was smooth; effect shader compiled first time.
