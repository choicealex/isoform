# FRICTION log: isoform-animate shield-lock
- Worked well: find.mjs / inspect.mjs parts picture clear; SKILL.md order of steps clear.
- Concept chosen (nobody to ask): Latch. Shackle pops up out of the lock body and snaps back; no WebGL effect (nothing physical to add that wouldn't be decoration). 
- look.mjs exits 0 even when the figure visibly fails (hole under lifted shackle, no legs); exit 0 is not the look, as docs say. SKILL.md has no guidance on which leg points to use: read corners off a zoom by eye (px/3.2).
- look.mjs run 4 total, all exit 0. Run 1 piped through tail so exit code was hidden (my error; doc could say "echo $?" not pipe).
- Legs: lifted shackle leaves a gap, rule 06 needs a trace, but no doc says how to find the shackle's rest feet; I read them off a lifted frame and had to subtract iso(0,0,9) (2nd attempt). inspect.mjs lists face boxes, not vertices.
- Tiny part (shackle ~20 units) lifts subtly; at 240px the lift is hard to read. concepts.md has no guidance for small-part icons. story-25/50 look identical (both open); doc says story-25/50/75 should show a story, beat timing choice is on the author.
- No effect: skill says optional, but look.md says always add --zoom effect for effect figures; ok.
