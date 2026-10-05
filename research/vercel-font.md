# vercel.com/font — design direction notes (owner pointed at it, 2026-10-05)

Seen first-hand in the browser, three viewports.

## What it is
A light Swiss-style type specimen. Page #fafafa → #fff, Geist throughout, Geist Mono caps for labels.

## Signature moves
1. **Visible structure as decoration**: the hero sits on a ruled cell grid (≈120px squares, 1px very light lines),
   with **crosshair marks** (+) at the outer corners of the grid block. Below the hero the page runs on **three ruled
   columns**: thin vertical lines top to bottom; content sits inside the columns.
2. **Huge wordmark hero**: one word, black, ~260px, with a full stop; nothing else in the hero but the grid.
3. **Centred pill switcher** in the header (Geist Sans · Geist Mono · Geist Pixel; active = black filled pill) and a
   black pill CTA top-right ("Get It ⊕"); logo top-left. No nav links.
4. **Stats table**: small line icon · label (36px) · big number, in the three columns.
5. **Specimen with construction**: glyphs on dotted baselines, a **circular loupe** drawn over the detail that differs
   between the three faces, a mono label under each.
6. **Glyph inspector**: left half = one big glyph with labelled metric lines (dotted, caps mono label at left, a
   black value tag at right: CAP HEIGHT 710, X-HEIGHT 530, BASELINE 0, DESCENDER -150) and **Solid / Anchors** tabs
   (underline-active); right half = a ruled grid of every glyph (≈80px cells, 1px lines), the catalogue as cells.

## Why it suits Isoform
Isometric line figures are technical drawings; this page is a technical sheet. Direct mappings:
- glyph inspector → **figure inspector**: one big figure, **Solid / Parts** tabs (Parts = the numbered faces from
  inspect.mjs), the icon's own axes (u, v, up) and the reach drawn as labelled metric lines with value tags.
- loupe → a circle that magnifies the moment that matters (the arc in the bolt's gap, the rim mark on the key).
- glyph grid → the catalogue as ruled cells, each figure playing in its cell.
- stats → figures · icons to draw from (1,007) · rules (12) · lines per figure.
