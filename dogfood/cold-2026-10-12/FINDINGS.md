# Cold run 2026-10-12: apps · delete · token

Setup: `npx skills add choicealex/isoform` (pushed `14165bb`) into a clean folder. Three fresh Sonnet
agents ran in parallel, each given a one-line user request, barred from the repo/dogfood, with no hints
about the new options.

| Icon | Concept | look.mjs | lines | Time | Verdict (owner-side review) |
|---|---|---|---|---|---|
| delete | X punched out of its plate along v, path line | 0, first try | ok | 2.5 min | Passes, but too small to read (0.30% of stage changes); weak at 240px |
| apps | 9 drums slide out like drawers, in reading order | 0 | ok | 3.3 min | Sound. RETRACTED: first read as a paint-order fault (order-fault.jpg), but the drums are parallel cylinders sliding along their own axis, so the nearer side-neighbour correctly still hides the pulled drum's back end |
| token | the chip lifts out of its seat and drops home | 0 | ok | 5 min | Unsure: the chip may rise through the overhanging slab, or pass in front of it (lift-through-slab.jpg). Can't be settled by eye from a flat drawing |

What worked: install from GitHub, find → inspect → build → look, and the line check. No false alarms on 3
unseen icons. `{free: true}` was found from the docs alone (delete). None had an effect, so `fallback` was
untested.

Gaps found (all passed every check, as in 3 earlier rounds: taste/physics is the weak point):
1. ~~Paint-order check~~ DROPPED: the apps "fault" was correct physics. A depth-from-motion heuristic would
   have flagged it: the flat drawings carry no depth, so motion alone can't decide occlusion.
2. Clearance (token) is unproven for the same reason: there's no depth in the data to test against.
3. No "big enough to see" check: delete's answer changes 0.30% of the stage.
4. CORRECTED: concepts.md was right, `delete` IS a bin (lid = faces 0, 1, 9, 10; X = 3 to 7). The agent missed
   the lid. Fixed by naming the faces in the example.
5. Docs: abstract symbols get "a path line", but lines must land on the drawing, so token skipped its
   trace. Say how a path line lands (start on the part, end on its rest seat).
6. Docs: which axis a cylinder extrudes along (apps had to infer it); inspect/concepts output floods context
   (40KB); inspect.mjs on a second variant overwrites the first variant's parts.png.
