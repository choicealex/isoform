# Friction log (radio-button-checked, rounded-left)

1. inspect.mjs printed `axes   NOT measured: the kernel falls back to true isometric. Read two edge directions off the corners and pass icon(svg, src, { u: [x, y], v: [x, y] })`. No guidance on how to read them, nor what units/length u,v take (unit vectors? stage px?). I guessed unit vectors: u=[0.866,0.5] (from the ellipse bbox half-width/height ratio, sanity-checked against isometric) and v=[-0.94,0.33] (from the extrusion edge between face centres, (31,-11)). Worked, but it was a guess I verified only by looking.
2. inspect lists 3 faces all "curved", no corners to read; the "corners" the skill mentions do not exist for round icons.
3. Face 1 (the dot) is a crescent, not a disc: the shipped drawing only has the visible part. Moving it reveals a pocket with nothing behind (rule 06), so I added `icon.face(1, 0, -12, 0, 0)` as a floor. The skill never says which `before` to use for this; I guessed path index 0 so the ring front covers it.
4. No tool prints a face's tangent points, so the travel "rails" were placed by eye (fractions of the rest box, 0.29/0.72). First attempt (an ellipse model from a computed radius) floated off the dot.
5. look.mjs piped through `tail` hides its exit code; had to rerun with a redirect to get EXIT 0.
6. Concept step: nobody to ask; concepts.md abstract-symbols section covered radio-button-checked directly ("a disc seats into a ring") - very helpful.
7. Worked well: look.mjs is one command, passes first run; `--zoom story-50` essential, the sheet is too small to judge traces.
8. The sheet is huge (1888x3851), mostly the bench UI chrome; the actual drawings are small.
9. Check "effect" shots are pointless for a no-effect figure but still produced; fine.
10. Hover reach: range [14,24,34] drives max, but poster/story uses out=1 so the story is 24 at default; the slider changes the story size, which is a bit odd.
