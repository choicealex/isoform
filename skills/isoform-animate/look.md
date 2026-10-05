# The look

The validator reads text. This is what only eyes can check. Do it every time the figure changes.

## One command

From the person's working directory:

`node <skill folder>/look.mjs <name>.js --at x,y --edge x,y`

It builds `isoform-<name>.html`, validates it (and stops there if the validator rejects it), opens ten pictures in one browser, waits for each drawing to hold still, and writes them on one sheet: `isoform-<name>-look.png`. It prints every picture's read-out and the checks it can make itself. It exits 1 when one fails, 2 when it cannot run a browser, 0 otherwise.

- `--at x,y` is a stage point (400 × 320, from the top-left) where the answering pictures hold the pointer: a point on the part that should answer, or the height that opens it. Take it from `part.rest` or read it off `inspect.mjs`'s parts picture, whose grid is in stage units (through `icon.pt` if you moved the icon).
- `--edge x,y` is the point for the slider's two ends; give it twice for a point per end (`--edge 200,40 --edge 200,90`: `low`, then `high`). Without it, the ends use `--at`.
- `--zoom <shot>` also writes that picture's stage at full resolution, for a crease or a thin arc. The sheet shrinks every picture: for a figure with an effect, always add `--zoom effect` and judge the traces there.
- In place of `<name>.js` it takes a built page.

The first run installs `playwright-core` once into a cache folder of yours, never into the skill or the working directory. It drives your Chrome, or Playwright's Chromium.

## The pictures

Five address parameters make them, and work in any browser for a look by hand: `?at=x,y` (hold the pointer), `?w=240` (thumbnail width), `?intensity=` (the slider), `?theme=light|dark`, and `?gl=0` (effects off; they are on by default).

| Shot | Picture |
| --- | --- |
| `rest` | full size, nobody touching it |
| `answer` | full size, the pointer at `--at` |
| `small` · `small-answer` | 240px, at rest and answering |
| `low` · `high` | the slider at 0 and at 1, the pointer at `--edge` |
| `dark` · `light` | both themes, answering |
| `effect` · `effect-dark` | answering with the WebGL effect on, in both themes |
| `no-effect` | answering with the effect off (`?gl=0`): the figure must still read |
| `colour` · `fill-off` | answering in the Colour style (the bright part filled) and with Isocons' fill off (every edge shows) |
| `story-25` · `story-50` · `story-75` | a story held at a quarter, half and three quarters of its loop (`?t=`) |
| `poster` | under reduced motion: the poster frame |

By hand, keep the window at least 800 × 900 and wait 1.5 seconds before each picture: springs take about a second.

## What to see

Answer each yes or no. A no is fixed before anything is handed over. `look.mjs` answers 3, 9 and 12 and part of 4; the rest are yours, from the sheet.

1. **It is the icon at rest, and the story reads** (rule 05). The `rest` picture is the Isocons icon, recognisable, with one bright part. Read `story-25`, `story-50`, `story-75` in order: can you say what happens, without the read-out? `poster` is the telling moment, not the rest pose.
2. **The silhouette reads at 240px.** In `small` and `small-answer` you can say what the object is and what is happening to it.
3. **The read-out** says `rest` at rest and names the state in a few characters when answering.
4. **Nothing flickers** (rule 01). Every picture's drawing comes to rest; an effect may keep running while the pointer holds the object in a running state, never at rest.
5. **No holes** (rule 06). Where a part moved away, the surface it was hiding is drawn: no empty outline, no see-through gap, no far edge across a near face.
6. **The faces are Isocons'** (rule 09). Parts move along the icon's own edges; nothing is scaled, skewed or turned far enough to look flat.
7. **One highlight** (rule 04). One bright place, and it is a stroke.
8. **What happens is what the object does** (rule 11). Cover the name and the sentence: would someone who sees `answer` (lines only) say what physical thing is happening? Would it make as much sense on another icon? (If yes, it is decoration.)
9. **Nothing leaves the frame** (rule 03), in `low` and `high` — the drawing is checked; check the effect by eye.
10. **Both themes** (rule 12). In `dark` and `light` the effect neither vanishes nor glares; a white core on the white plate still reads.
11. **The effect counts, and the figure stands without it.** In `effect` the material and its light are unmistakable, saturated, glowing, the one colour in the scene; in `no-effect` the drawing and its traces still say what happens. The effect never draws edges of its own.
12. **The page is clean.** No error line under the stage, nothing on the console.

If you are unsure what good looks like, look at an example the same way: `node <skill folder>/look.mjs <skill folder>/examples/bolt.js --at 200,70 --edge 200,40`.

## Without a browser

Answer the same twelve from the code, each with the line that makes it true: the rest offsets for 1, the hit test for 4, the `face` / `facet` calls for 5, the clamps for 9, the traces the effect sits under for 11. Then say at hand-over, in these words, that the figure was **not looked at in a browser**.
