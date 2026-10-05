# The look

The validator reads text. This is what only eyes can check. Do it every time the figure changes.

## One command

From the person's working directory:

`node <skill folder>/look.mjs <name>.js --at x,y --edge x,y`

It builds `isoform-<name>.html`, validates it (and stops there if the validator rejects it), opens nine pictures in one browser, waits for each drawing to hold still, and writes them on one sheet: `isoform-<name>-look.png`. It prints every picture's read-out and the checks it can make itself. It exits 1 when one fails, 2 when it cannot run a browser, 0 otherwise.

- `--at x,y` is a stage point (400 × 320, from the top-left) where the answering pictures hold the pointer: a point on the part that should answer, or the height that opens it. Take it from `part.rest` or from `inspect.mjs` (through `icon.pt` if you moved the icon).
- `--edge x,y` is the point for the slider's two ends; give it twice for a point per end. Without it, the ends use `--at`.
- `--zoom <shot>` also writes that picture's stage at full resolution, for a crease or a thin arc.
- In place of `<name>.js` it takes a built page.

The first run installs `playwright-core` once into a cache folder of yours, never into the skill or the working directory. It drives your Chrome, or Playwright's Chromium.

## The pictures

Five address parameters make them, and work in any browser for a look by hand: `?at=x,y` (hold the pointer), `?w=240` (thumbnail width), `?intensity=` (the slider), `?theme=light|dark`, and `?gl=1` (effects on; they are off by default).

| Shot | Picture |
| --- | --- |
| `rest` | full size, nobody touching it |
| `answer` | full size, the pointer at `--at` |
| `small` · `small-answer` | 240px, at rest and answering |
| `low` · `high` | the slider at 0 and at 1, the pointer at `--edge` |
| `dark` · `light` | both themes, answering |
| `effect` | answering with the WebGL effect on |

By hand, keep the window at least 800 × 900 and wait 1.5 seconds before each picture: springs take about a second.

## What to see

Answer each yes or no. A no is fixed before anything is handed over. `look.mjs` answers 3, 9 and 12 and part of 4; the rest are yours, from the sheet.

1. **It is the icon at rest** (rule 05). The `rest` picture is the Isocons icon, recognisable, with one bright part; any seam from a cut lies on an edge the object really has.
2. **The silhouette reads at 240px.** In `small` and `small-answer` you can say what the object is and what is happening to it.
3. **The read-out** says `rest` at rest and names the state in a few characters when answering.
4. **Nothing flickers** (rule 01). Every picture's drawing comes to rest; an effect may keep running while the pointer holds the object in a running state, never at rest.
5. **No holes** (rule 06). Where a part moved away, the surface it was hiding is drawn: no empty outline, no see-through gap, no far edge across a near face.
6. **The faces are Isocons'** (rule 09). Parts move along the icon's own edges; nothing is scaled, skewed or turned far enough to look flat.
7. **One highlight** (rule 04). One bright place, and it is a stroke.
8. **What happens is what the object does** (rule 11). Cover the name and the sentence: would someone who sees `answer` (lines only) say what physical thing is happening? Would it make as much sense on another icon? (If yes, it is decoration.)
9. **Nothing leaves the frame** (rule 03), in `low` and `high` — the drawing is checked; check the effect by eye.
10. **Both themes** (rule 12). In `dark` and `light` the effect neither vanishes nor glares; a white core on the white plate still reads.
11. **The two versions look alike.** Put `answer` and `effect` side by side: the same drawing, the same traces; the effect only adds material under them (water, light, heat), never edges of its own.
12. **The page is clean.** No error line under the stage, nothing on the console.

If you are unsure what good looks like, look at an example the same way: `node <skill folder>/look.mjs <skill folder>/examples/bolt.js --at 200,70 --edge 200,40`.

## Without a browser

Answer the same twelve from the code, each with the line that makes it true: the rest offsets for 1, the hit test for 4, the `face` / `facet` calls for 5, the clamps for 9, the traces the effect sits under for 11. Then say at hand-over, in these words, that the figure was **not looked at in a browser**.
