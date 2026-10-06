# Friction log (isoform-animate, credit-card rounded-top)

1. Nobody to ask: took "swipe past a reader head" (most physical effect) instead of concepts.md's effect-less "Credit card" arcs story. Said so.
2. concepts.md "Credit card" example assumes a chip face; the rounded-top icon has no chip: it is a slab with a stripe groove (faces 1,2). I had to infer faces from the parts picture; worked well once I looked at the PNG (numbered tint over a stage-unit grid is great).
3. inspect.mjs printed `axes   u 0.87, 0.48   v -0.86, 0.52   (measured; ...)`. Measured and agreed with corners (stripe edge (300,161)->(267,180) is v); I did NOT pass {u, v}. SKILL.md wording "if it says they were not measured" is clear.
4. Paint order trap: a part paints at its LAST face, so body [0,3] would hide the stripe [1,2]; needed {paint:"first"}. SKILL.md "What goes wrong" only hints (after()); the paint option is only in the kernel index/rule 06. Not obvious which of the two to use for an unmoving-relative pair.
5. First look.mjs run exited 0 but the answer/effect pictures showed no head trace and no effect: my head channel was story-only, so hover (held) never drove it. look.mjs checks did not catch it (it only prints readouts); only reading the sheet did (rule 11 / Q8, Q11). Worth a self-check: "does the answer shot show the phenomenon".
6. The sheet is 1888x4219; displayed at ~47%, effect is unreadable there, --zoom effect was needed (SKILL.md says so for effects; good).
7. Hover slide channel `slide` is multiplied by max (reach) while story uses same scale: story swipe at default 18 units is bigger than "a few units" (rule 03) but fine for a travel story; rule vs examples slightly inconsistent.
8. Which is "ic.u": unit vector per stage unit? Inferred from bolt.js (`(seam[0]-140)/ic.u[0]`) that move(a) = a*ic.u screen px. Not stated in the index.
9. Effect colour: rule 12 only allows a physical colour; a magnetic read has no light. I used a blue-white "read signal" and said so in a comment: judgement call, arguably decoration. Concept guide says card story needs no effect; honest alternative would be none.
10. look.mjs --edge guidance fine; used same point for both ends. Exit 0 on first run, ran in ~seconds; first-run playwright install silent and fine.
11. My own slip: BSD sed -i without '' broke my chain; unrelated to the skill. Used Edit.
Worked well: find/inspect/parts png, example bolt.js as template (copied structure almost 1:1), readout line, "still: every picture came to rest".
