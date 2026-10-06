1. concepts.md says radio-button-checked is "a disc seats into a ring", but the icon has no disc: 3 faces (ring front, bore wall, side). My first build lifted "the dot" (face 1) and it was only the bore wall (a sliver). Had to re-concept to a whole-puck press. Docs are wrong for this icon.
2. First build: `TypeError: at.before is not a function`. icon.face's `before` is documented "a part or a path"; I passed an index (1). Used ic.paths[1]. (Also, the guessed face copy turned out unnecessary.)
3. inspect axes line: "u 0.87, 0.50 v -0.88, 0.47 (v measured...; the other is true isometric)" plus a "sweep" line saying axes could not be measured. SKILL says pass {u,v} if "not measured"; unclear whether one-axis-measured counts. I did not pass them (only moved along v).
4. No face-by-face description of what a face IS (bore wall vs dot); only a PNG with a hidden label 0 under the pink.
5. look.mjs exit 0 with "lines change 0.19%" of the stage on answer (first draft): a near-invisible answer passed. No fail.
6. Concept step: nobody to ask, wrote three, struck two by the A weak concept list. Worked.
7. A sed -i in a heredoc call failed ("sed: -I or -i may not be used with stdin"); used Edit/python. Env quirk, not skill.
Worked well: look.mjs one-command sheet, readout line, story-N pictures, examples as format bar.
