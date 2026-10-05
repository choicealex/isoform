# abc friction log
- start: SKILL.md says "read kernel index down to var IF"; index mentions `after(a, b)` only as "for a part that comes forward" - no way to put a part BEFORE another except after(other, it). Fine, but undocumented whether repeated calls toggle cleanly.
- Paint order: part paint position is the part's LAST face index (C 9 < B 14 < A 16), so default has A over B. Kernel `after(a,b)` is the only lever; it worked (after(B,A) once; after(C,B) when C clears B, after(A,C)+after(B,A) to go back). Toggling was clean, no pop visible in the sheet. No "before" call; had to express "C behind A" as after(A,C). Finding: undocumented that repeated after() toggles; no way to order faces within a part (a block passing between two faces of another).
- look.mjs warn "high still reads rest": --at on a part means hover = fully sorted = rest for this concept (nearness drives toward the END state). The warning heuristic assumes answer != rest.
- readout: story-25/50 shots use ?t= that includes the intro (4.2s), so the sheet's quarters are not loop quarters; first build I guessed wrong which beat they hit.
- hand-driven "sort" progress is a single channel, so rule 02 (spread by distance) not applied; judgment call.
- Track for C is drawn under the icon (under:true) and ends up hidden behind B/A while C is in the back lane: only A and B tracks read at poster.
- Hardcoded foot points for tracks read off inspect numbers by eye (mid of front-bottom edge); no helper for a part's footprint.
