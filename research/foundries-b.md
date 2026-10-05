# Foundry / specimen sites, batch B (2026-10-05)

Screenshots: `/private/tmp/claude-501/-Users-mac-Documents-Claude-code-Workspce/304878bb-499f-4002-b4b2-77ea9c475244/scratchpad/foundry-b/` (prefix below = file stem, `-0/-1/-2` = scroll 0/900/1800px). Headless Chrome, 1512x982.

Load status: berkeleygraphics.com returned a Cloudflare 403 challenge (not judged). departuremono.com loaded on retry. futurefonts.xyz home loaded, its font detail page timed out. fontshare detail page rendered blank (lazy, no scroll content captured). Geist's `geist-font.vercel.app` is a stock Next template, nothing to read; `vercel.com/font/mono` is the same page as the already-studied vercel.com/font. Swapped in: commitmono.com, jetbrains.com/lp/mono.

## Per-site notes

**Inter (rsms.me/inter)** (`inter-0/1/2`, `inter_glyphs`, `inter_glyphs_click`)
- Home: white page, one 2-line headline (~190px, weight 700, tight tracking), then a 3-column text row, black pill "Download" button sits in column 1 directly under the tagline. No imagery at all.
- Specimen rows: faint grey weight label left ("Thin") + number right ("100"), one huge line of sample text per weight, 1 row per axis value.
- `#glyphs` is the best mechanic: full-bleed saturated green block (rgb 119,221,134), huge white "Glyphs" title, then a control bar (toggles "Optical size" slider, "Details" switch) + selected-glyph name and `U+0041` codepoint in mono, then a 2-column split (grid `755.5px 755.5px`, 1px gap): left = ONE glyph at ~380px black, with 3 hairline metric rules and 11px labels (Cap height, x-height, Baseline) at left edge; right = grid of ~75x70px cells, 1px black borders, glyph 34.8px, 2,812 cells. Selected cell inverts to solid black with white glyph. Click a cell -> left side swaps, name/codepoint update, no transition.

**Departure Mono (departuremono.com)** (`departure-0/1/2`)
- Light grey ground (#eee-ish), text rgb(68,68,68), 11px caps mono body, h1 88px with a pale-grey highlight block behind the wordmark (`DEPAR7URE_MONO`, version "v1.500" at 11px superscript beside it), nav = three stacked lines with glyph bullets (↓ DOWNLOAD / > GITHUB / ♥ DONATE).
- It demonstrates the face with fake artefacts (typed letter with highlighter marks, torn receipt, boarding pass, tag, departures table with 3px black column rules) layered and overlapping at different rotations/offsets. Between artefacts: tiny 11px caption (dither-texture glyph + 2-line uppercase caption, e.g. "IT'S GREAT FOR WORKING WITH TABULAR DATA") set 160-280px in from the left edge, pointing at the next object.
- Faint thin-line geometric drawings (a marker pen outline, large arcs) run behind everything in 1px olive-grey: a line-art object sitting beside real content.

**Commit Mono (commitmono.com)** (`commit-0/1`, `commit_k3`, `commit_k8`, `commit_dark`)
- Whole site is a terminal: 12px mono, body #111 / text rgb(170,170,170) in dark (toggle `M`), grey in light. Nav = `01 Home 02 Concept ... 10 About`, active = inverted block (black bg, light text).
- Sections are whole-screen "pages", switched with number keys 1-10 or arrows; a persistent footer lists every shortcut as boxed key caps: `↑↓←→ Navigate · 1 2 3 To section · W A S D scroll · + - zoom · ENTER ESC edit text · R reset · B L I weight/italic · M light/dark · C high contrast · H hide keys`.
- Specimen section: horizontal timeline with square tick markers and years (1896 ... 2023, current ringed), then the character set as four lines at ~72px.
- Install: a numbered `#1 ... #5` list, plain, with a "Customize download" link beside "Download (default settings)". The CTA is just a link, staged as step 1.

**JetBrains Mono (jetbrains.com/lp/mono)** (`jb-0/1/2`) - the best dark technical product page
- Ground #1a1b1f-ish, white text, hero is the product name in the product's own face (mono, ~105px/110px line height) ending in a blinking-cursor block `_`. Bottom of hero: `v2.304`, "Updated 1,357 days ago", release-notes link, big blue pill CTA (about 250x70, #087cfa), "It's free & open source" beside it.
- Sticky top bar: caps mono nav, thin 1px rule under it, small blue pill CTA repeated top-right (CTA stays visible the whole page).
- Language tabs (Kotlin/Java/Go/...) with a 2px blue underline on the active one, live code panel beneath with line numbers, a small "default editor font in GoLand" side note behind a 1px left rule.
- Feature list is a ruled bento: 1px rules (#444) divide a 1 / 2 / 2 grid, each cell has a number label `1.` `2.` ... top-left, a huge numeral or glyph pair (`An`, `Se`, `120`, `117`, `8`) at ~200px, a 2-line claim at ~36px, and a blue caps mono link bottom-right ("EXPLORE ↓", 12px, letter-spaced).

**Typotheque (typotheque.com)** (`typotheque-0/1`, `ty_fedra-1`)
- Hero is a full-bleed black photo/video tile with the face name huge top-left and **four vertical hairline sliders** (Weight 888, Width 30, Rounding 77, Slant 0): 1px white vertical line, dot handle at a different height on each, label + value in white 14px beside the dot. The wordmark animates as the axes move. Closest thing to "live feature toggles shown as drawn instruments".
- Below: a 4-up row of saturated pastel tiles (orange, black, pink, cyan, 10px gaps, ~20px radius), each with a small line-art diagram of one feature (stacked layers, colour wheel). Edge-to-edge, tile label top-left at 14px/600.
- Font pages: ruled specimen blocks with dotted corner marks (small dots at grid intersections) and "Expand" / "Learn more →" links under each; a cyan "Buy" pill on every style row.

**Fontshare (fontshare.com)** (`fontshare-0`, `fs_satoshi-0`)
- Pale cream ground (#ffffe5-ish) and near-black #111. Header is a ruled cell strip: logo cell, then tabs `Fonts 100 / Pairs 59 / Licenses` as 180px-wide cells with 1px dividers; active cell fills solid black with white text, count in 11px at the bottom-left of the cell.
- Control bar: search, "Your Text" input, size slider (value `120px` + circle thumb), alignment icons, theme dots. Specimen rows: 1px outer border, tiny meta (style count, Variable, licence) at top-right, name at ~120px, designer line bottom-left at 11px grey.

**Future Fonts (futurefonts.xyz)** (`futurefonts-0/1`)
- Hero is a scrolling wall of oversized specimen lines (`35.1186° N, 120.5907° W`, `{Quags}`) in dark charcoal on #ecece8, with a single small white centred card ("TYPE IN PROGRESS" + blue pill) floating over the middle. A CTA staged on a card over a wall of content. Then a flat yellow (#ffd84f) band with 3 small hand-drawn icons, 3 columns, one row of mono body copy; below, a 4-column tile row of specimens, each tile its own colour.
- Mono UI face throughout (Space-Mono-like) so even navigation reads as a spec sheet.

## Ranked moves for the Specimen+Wall site

1. **Instrument-line toggles, not buttons** (Typotheque). Intensity / speed / effect / parts as vertical 1px hairlines, ~290px tall, dot handle 8px, label 14px + live value beside the dot (`Speed 0.8`). Drag moves the dot and the figure re-plays. CSS: `width:1px; height:290px; background:rgba(255,255,255,.85)`, dot `8px` circle, labels 14px/1.1 weight 500, dot x-offsets spaced ~360px. Place across the hero or inspector, over the playing figure.
2. **Glyph inspector grid, exact split** (Inter). `grid-template-columns: 1fr 1fr; gap:1px`; left pane = one figure at ~380px with 3 labelled hairline rules (Cap height / x-height / Baseline become: top reach / u / v axis) with 11px labels at the left edge; right pane = cells ~75x70px with 1px borders, figure rendered in each cell, **selected cell inverts to solid** (light bg, dark ink in dark mode). Click swaps the left figure and updates a name + codepoint-style ID (`ISO-0041`) in 12px mono. 2,800 cells is fine because they are static until selected.
3. **Persistent keyboard footer** (Commit Mono). Footer row with boxed key caps (`1px` border, 4px radius, 11px mono, 18x18) for `← →` figure, `1-9` effect, `Space` replay, `M` light/dark, `H` hide hints. Costs nothing, gives the "instrument" feel, and every toggle gets a shortcut. Active nav item = inverted block (`background:#ccc; color:#111`).
4. **Numbered ruled bento for features** (JetBrains Mono). Cells `1.`..`6.` (12-14px, grey) top-left, a huge numeral/figure ~200px, 36px/1.2 claim, blue caps link bottom-right (12px, `letter-spacing:.08em`). Rules 1px rgba(255,255,255,.25) on #1a1b1f. Pattern 1 / 2 / 2 columns. Feed the stats row (figures, icons, rules, lines) in as the numerals.
5. **CTA staged three times** (JetBrains + Inter + Commit). (a) sticky small pill in the top bar, (b) large pill in the hero bottom row beside a version line (`v0.x, updated N days ago`, 12px mono) and one-line licence note, (c) the install section as a numbered `#1 #2 #3` list where step 1 is the download link. Hero pill ~250x70, radius 999px, solid accent.
6. **Highlight-block wordmark + cursor** (Departure, JetBrains). Wordmark with a pale block behind it (`background:rgba(255,255,255,.12)`, padding 0 8px) or a trailing `_` cursor block `0.55em x 0.1em` in mid-grey, blinking `steps(1) 1s infinite`. Cheap dark-mode terminal cue that matches a pixel/hairline drawing.
7. **Wall tile = ruled cell with name tag** (Fontshare). Tile = 1px outer border, meta tiny top-right (11px, 40% white: `3 parts · 2.1s`), figure centre, name bottom-left at 11px. Hover: tile bg flips to #111 / ink flips (Fontshare nav cell active state), no scale. Dark tiles for rhythm = the same cell with inverted palette.
8. **Floating CTA card over a wall** (Future Fonts). A small 325x170 card with 1 line + 1 pill, centred over the Wall, `background:rgba(255,255,255,.9)` (or dark card + hairline in dark mode). Keeps the wall edge-to-edge while still staging the action.
9. **Section scale: saturated accent block for the inspector** (Inter). Give the inspector one full-bleed band in the single accent colour (Isoform's blue at low saturation) with a 2px darker rule above the control bar (`border-top:1px solid #000` on Inter). Use only once so the rest of the page can stay near-monochrome hairlines.
10. **Micro caption between objects** (Departure). 11px caps mono, `letter-spacing:.04em`, 2 lines, max-width 190px, with a 14px dithered/dotted glyph left of it, offset 160-280px from the left edge, one per figure group ("PLAYS ONCE ON ENTER"). Gives a numbered/captioned flow without headings. Pair with Commit's `01 Home`-style numbering in the header for the nav (`01 Figures 02 Inspect 03 Install`).

## Dark-mode legibility values to reuse
- JetBrains: bg #1a1b1f, text #fff, rules #444 (1px), secondary text ~#9a9a9a, accent #087cfa, body 12px caps mono for nav, `letter-spacing` ~.08em.
- Commit Mono dark: bg #111, text rgb(170,170,170), 12px; inversion (not colour) marks active/selected.
- Rule: hairlines at 20-25% white on dark, selected state = full inversion, one accent used for links and CTAs only.

## Caveats
- Berkeley Graphics was not viewed (Cloudflare challenge). Future Fonts' individual font page and Fontshare's font detail page were not captured. Motion on Typotheque's hero (axes moving) and Inter's glyph-click transition were inferred from static frames plus the instant swap seen after a click, not frame-captured.
