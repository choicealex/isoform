# overflow.design/isometric — styles, hover and play (owner pointed at it, 2026-10-05)

Seen first-hand: every style toggled in the browser; hover recorded as frames (8 illustrations × 9 frames, 220ms apart,
real pointer, headless) — sheets in the scratchpad (`ovA.png`, `ovB.png`).

## The set
71 isometric line drawings (20 illustrations, 51 icons), "one grid, one stroke weight". Tiles are `<figure>` with one
inline SVG each; the motion is SVG, like ours.

## Style toggles (three groups)
- **Stroke · Plain · Colour · Yours** — Stroke: heavy black outline on white, no fills. Plain: greyscale fills, the acting
  part filled solid black. Colour: the acting part in coral, the ground slab sage, the rest cream. Yours: own colours.
- **Glass · Dashed** — Glass: the acting part becomes translucent, so the edges behind it show through (crate lid shows
  the rim; briefcase shows its back edge). Dashed: ghost / hidden outlines become dashed.
- **Hover · Autoplay** — the animation runs on hover, or loops by itself.

## Signature moves
1. **Every object stands on one ground slab** — a rounded isometric plate with thickness, same in every illustration.
   It is what makes 71 drawings read as one set.
2. **Ghost outlines** — a faint copy of where a part was or will go (the slot a card left, the hidden cube underneath).
3. **The filled part is the one that matters** — in Plain/Colour the acting part is the only solid/tinted one.
4. **Motion is arrangement**: layers lift and spread, blocks shuffle into a row (the empty slot shows as a ghost), cards
   fan, a block multiplies into a cross and merges back, a lid drops shut, a panel floats. Small, ~1–2s, eased.

## For Isoform (owner to choose)
- Ground slab under every figure (a kernel feature, so the skill draws it too): the strongest set-wide unifier.
- Fill styles as palettes: Line (now) · Plain · Colour · Glass — the acting part filled; Glass shows edges through it.
- Ghost outline of a part's rest place when it moves (solid and faint; the owner ruled out dashed add-ons).
- A Hover / Autoplay switch on the site.
