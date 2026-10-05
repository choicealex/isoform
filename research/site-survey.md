# Site survey for the Isoform redesign (2026-10-05)

Screenshots (1512x982, JPEG q70) in `S=/private/tmp/claude-501/-Users-mac-Documents-Claude-code-Workspce/304878bb-499f-4002-b4b2-77ea9c475244/scratchpad/survey/`.
All URLs below returned HTTP 200. animateicons.in excluded (studied separately). Not usable: isometric.online (domain for sale), rive.app/community (404).
Caveats: isocons.app renders blank until ~10s (React hydration errors #418/#423 in console), screenshot taken after 15s; streamline's home is covered by a blank modal in headless, so it is only noted, not judged.

## Per-site notes

### 1. itshover.com (animated icons) - `S/itshover.jpg`, `S/itshover-icons.jpg`
- Hero: centred monospace h1 ("icons that move with intent") with one word in orange; huge (150-200px) pale-grey icons scattered at the page edges as ambient decoration, plus a CTA pair. Catalogue page: left hero + a floating "terminal" install card, then a 6-col grid of white bordered cards, 24-48px glyph centred, copy/CLI buttons under each.
- Signature moves: (a) oversized ghost icons scattered around the hero at 5-10x real size, so you see the stroke character; (b) install snippet as a faux terminal card with traffic-light dots; faint warm gradient wash in the hero corner.
- Isoform fit: the scattered-giant-figure idea works only if our figures are the scattered things (they are big already). Card grid with 24px glyph does not fit. Mono type is characterful but orange accent clashes with our one blue.

### 2. lucide-animated.com (pqoqubbw icons redirects here) - `S/lucideanimated.jpg`
- Hero: light grey (#f2f2f2) page, centred two-line h1 with an orange asterisk, tabbed package-manager install box, a pull-quote with author avatar, then edge-to-edge grid of white tall rounded tiles (216px wide) with glyph + tiny mono label, no gutters on the page edge.
- Signature moves: full-bleed tile grid that touches the viewport edges (feels like a wall, not a "section"); grey page + white tiles gives soft figure/ground without borders; tabbed install box.
- Isoform fit: tall tiles are a good proportion for 300-450px figures if they were scaled up to 2-3 columns. Wall-of-tiles density is wrong for stories; right for an index below the hero.

### 3. animate-ui.com - `S/animateui.jpg`
- Hero: white, centred bold geometric-sans h1, two buttons, then four large soft-grey preview cards in a row, each with a script-font label ("Primitives", "Components", "Icons", "Soon...") above a ghosted miniature of the content.
- Signature moves: category cards as grey wireframe thumbnails with a handwritten label; a "Soon..." fade-out card that implies a growing library; tiny pill announcement above the h1.
- Isoform fit: handwritten label over a ghosted miniature is a lovely tone for "figure families". Page is otherwise generic. Thumbnails too small for our figures.

### 4. lordicon.com - `S/lordicon.jpg`, `S/lordicon-icons.jpg`
- Hero: white, centred h1 with one green phrase, big search field with popular-tag links, two tiny outline doodles (star, planet) floating beside the h1, then three large bordered "pack" cards each previewing a 2x2 or 3x3 cluster of 70-90px animated icons in different styles (thin, hand-drawn, outlined+accent).
- Signature moves: pack-preview cards that show the same icons in different style families; one accent colour used inside the icons (green stroke detail) not just on buttons; icons animate in the card on hover/loop.
- Isoform fit: "accent inside the drawing" is exactly our blue-accent idea; 70-90px clusters too small. Cookie banner and pricing nav = commercial clutter.

### 5. lucide.dev/icons - `S/lucide.jpg`
- Layout: app-like. Fixed left sidebar with a Customizer (colour, stroke width slider, size slider) and category list with counts; right: search + dense 16-col grid of 56px grey tiles; click opens a floating detail panel.
- Signature moves: live customiser (stroke width / size / colour change every icon on the page); category counts; detail panel instead of page nav.
- Isoform fit: a live "stroke width" slider and accent-colour swatch that re-tint the actual figure is very good for a line-art product. The 16-col grid is wrong; a 4-6 up grid of big figures is the equivalent.

### 6. phosphoricons.com - `S/phosphor.jpg`
- Hero: warm beige (#ece8e1) page, left-aligned large medium-weight sans h1 set in dark olive, outlined buttons with hard offset shadow, "arrow-corner" link list in two columns; right side is a rotated, cropped, full-colour illustration of a synth/UI mockup bleeding off the edge, with loose paperclips drifting.
- Signature moves: tinted paper background plus hard-edged outlined buttons (sticker feel); illustrations deliberately rotated and bleeding off the viewport edge; announcement banners are lime-green toasts with mono type.
- Isoform fit: the warm paper tone and bleed-off-edge crop are the strongest "not a generic SaaS page" cues in the whole survey. Colour illustration style is not ours, but the staging transfers.

### 7. iconoir.com - `S/iconoir.jpg`
- Hero: white, enormous (88px) tight-tracked bold h1 split in two weights/greys ("Say hello" dark, rest light grey-blue), five icons floating at the top inside coloured Figma-style selection boxes (handles at corners + coloured name tag), a 4-stat row, framework logos strip.
- Signature moves: the design-tool selection box with a coloured label as the frame around a figure (makes it feel like an object on a canvas); two-tone headline; big stat numerals.
- Isoform fit: selection-handle framing around the hero figure while it plays is a strong, on-brand "this is a drawing object" move. Stat row is a nice place for "N figures / 1 file each / 0 deps".

### 8. hugeicons.com - `S/hugeicons.jpg`
- Hero: two-column. Left: bold + grey two-tone h1, lime CTA, customer logos. Right: a framed grey "stage" showing a realistic UI mock using the icons, with pill tabs underneath (UI Component / Mobile App / Liquid Glass ...) to switch the stage; faint perspective grid in the background.
- Signature moves: one big stage + pill switcher to swap context (shows icons in use, not in a grid); perspective floor lines.
- Isoform fit: a single stage + pill tabs that swap the featured figure (instead of cards) is a great model for ours. Marketing-logo block and lime colour no.

### 9. hairline.lucasmarkes.com - `S/hairline.jpg`, `S/hairline-figures.jpg`  (closest competitor; our current design is near this)
- Hero: white, narrow centred column: h1 with one italic serif word, mono install pill + black CTA, one ~400px figure on a faint isometric dot/diamond grid floor with a soft shadow. Figures page: left filter rail grouped by what figures draw (7 shelves, counts), 3-up grid of white rounded cards each with a 200px figure and name bar.
- Signature moves: faint isometric floor-grid vignette under the figure; shelves by subject; "pick one to see it large" detail.
- Isoform fit: this is what we currently resemble. Distinguishing from it requires leaving the white card + italic-serif h1 formula.

### 10. isocons.app - `S/isocons.jpg`
- Layout: white, mono type (DM Mono), small left filter panel with a live cube preview (Left/Top/Right face toggle, Fill toggle, Edge, Stroke 1px slider), icon grid 5-up at ~110px icons in pale blue (#229eff-family) hairlines, hover state = outlined rounded tile with "Add to folder +", cart "Checkout" button, dark-mode FAB.
- Signature moves: customiser built around a live isometric cube; hover tile reveals an action chip; the icons themselves are the only colour on the page; dotted-grid cube preview.
- Isoform fit: shares our blue and parent library, so Isoform should feel like its animated big sibling. The dotted grid preview and face toggle are directly reusable ideas. Mono + white is a bit sterile and the page needs 10+ s to appear.

### 11. lottiefiles.com/featured-free-animations - `S/lottiefiles.jpg`
- Hero: white, big centred h1, search bar with tag chips, then a light-grey rounded "tray" containing 4-up cards whose preview windows swap between white, dark, green; each loops its animation; author + download count under each.
- Signature moves: preview windows with varied backgrounds in one grid (dark tiles break the rhythm); a rounded grey tray that frames the whole wall; loops play without hover.
- Isoform fit: mixing a few dark tiles in a light grid is a cheap, effective rhythm trick; an isometric cubes-on-grid animation appears as the first card, so there's a precedent.

### 12. useanimations.com - `S/useanimations.jpg`
- Hero: near-black (#121212) page, left-aligned h1 + blue button, five white 24px icons drifting randomly on the right half in empty space, 4-col feature row beneath with purple icons.
- Signature moves: dark canvas with a few self-playing icons floating in huge empty space.
- Isoform fit: the dark empty canvas is a good setting for light hairlines (blue accent reads brighter), but icons here are far too small; at 500px a single figure would own it.

### 13. rive.app - `S/rive.jpg`
- Hero: black, wide-tracked techno caps h1, CLI snippet card with green mono text, a left column of stacked labelled thumbnails (Product UI / Game UI / Mobile apps) scrolling beside the copy.
- Signature moves: vertical strip of live use-case windows with caps labels; install via curl in a code card.
- Isoform fit: caps-label-over-live-window strip is a viable catalogue spine. Gaming-engine tone no.

### (not judged) streamlinehq.com/icons - `S/streamline.jpg`
Left sets sidebar (30+ icon families as folders), big search bar with All/Free/Pro toggle, sets as preview cards. Obscured by a modal in headless. Pattern: catalogue organised by style family, not just subject.

## Moves worth stealing for Isoform (ranked)

1. **One huge stage, pill-switched.** A single ~640-720px figure playing its story on a framed canvas, with pill tabs to swap which figure is on stage; no card grid in the hero. [hugeicons, hairline hero]
2. **Dark stage option: pale hairlines + #229eff on near-black.** One figure on a dark canvas that owns the viewport; light mode secondary. [useanimations, rive, lottiefiles dark tiles]
3. **Live customiser that re-tints the real figure** (stroke width slider 0.5-2px, accent swatch, face/orientation toggle) on a dotted isometric preview. [lucide.dev, isocons.app]
4. **Figure framed as an object on a design canvas**: selection box with corner handles and a blue name tag around the playing figure. [iconoir]
5. **Warm paper or tinted ground instead of white/off-white; hard-edged outlined buttons; one figure rotated/cropped bleeding off the viewport edge.** [phosphor]
6. **Full-bleed tall-tile wall for the index** (no page gutters, grey ground, white 2-3-up tiles, 400px tall) as the secondary catalogue. [lucide-animated, lottiefiles tray]
7. **Accent colour lives inside the drawing**, not on the UI chrome: buttons stay black/white, the only blue on the page is the figure's accent stroke. [lordicon, isocons]
8. **Rhythm breaker: a few dark tiles/cards interleaved in a light grid.** [lottiefiles]
9. **Scattered oversized ghost figures as hero ambience** (pale, 5-10x, drifting at the edges, moving only when near the pointer). [itshover]
10. **Handwritten/script labels over ghosted miniatures for category cards**; "Soon..." faded card. [animate-ui]
11. **Install as faux-terminal card / tabbed package box + "or draw your own with the skill" aside.** [itshover, lucide-animated, hairline]
12. **Detail in a floating panel or slide-in instead of a full drawer; hover reveals action chip ("copy file", "open").** [lucide.dev, isocons]
13. **Browse by subject shelves with counts + filter rail** (also by style family). [hairline, streamline]

## Three direction proposals

### A. "Stage" (dark, one figure, nothing else)
A near-black (#0b0d10) full-viewport hero where one figure at ~680px draws itself in pale grey hairlines with the blue accent stroke glowing slightly brighter, on a faint isometric dotted floor that fades to the edges. Below the figure: a thin pill rail of figure names (the hugeicons stage/switcher idea) that swaps the figure on stage with a draw-out/draw-in transition. Headline is small and left-aligned in the bottom-left corner, not centred. Pointer hover takes over the figure live (this is the pitch). Scrolling down switches to a light index. Draws from: hugeicons (stage + pills), useanimations and rive (dark canvas), isocons (dotted floor), lottiefiles (dark/light rhythm).
- Page: #0b0d10 hero, #f4f3ef index below; Type: Geist for UI at 14px, a tight grotesk or mono (Geist Mono) for labels in caps; no serif. Headline <=40px, deliberately small versus figure.
- Layout: single column, 12px pill rail, figure centred 680px; index = 3-up tall tiles, 440px figures; detail opens in a bottom sheet.
- Figure framing: none (no card); floor grid + soft ground shadow only.

### B. "Drafting table" (paper ground, canvas objects, customiser)
A warm paper page (#efeae2) styled like a drafting desk: hard 1px ink outlines, offset-shadow buttons, a left control rail with live sliders (stroke 0.5-2px, accent swatch, orientation toggle, replay) that re-tint the actual figures. Each figure sits as an object on a dotted canvas, with Figma-like selection handles and a blue name tag appearing on hover/selection. One hero figure is cropped by the right viewport edge and slightly rotated for energy. Draws from: phosphor (paper, hard buttons, bleed), iconoir (selection box), lucide.dev + isocons (customiser rail), animate-ui (handwritten category labels).
- Page: #efeae2 paper, #1c1b19 ink, #229eff accent only on figures and the selection tag; Type: a grotesk with character (e.g. Bricolage Grotesque or Manrope) for headings at 56px medium, DM Mono for labels; handwritten script only for 3 category labels.
- Layout: 280px sticky left rail + 2-up grid of 560px canvases (no gutters inside, thin ink dividers); hero = the rail plus one oversized figure.
- Figure framing: dotted canvas square with corner handles; no rounded white cards.

### C. "Wall" (full-bleed tile wall that plays)
The page is an edge-to-edge wall of tall tiles on grey (#ededeb): white tiles, 2 or 3 across, 480px tall, each figure drawing itself in its own looping story; a few tiles are dark inverted (#101214) in a fixed rhythm. A very small top-left wordmark and a one-line statement float over the first row rather than a hero section; the first tile is double-width and carries the install/skill snippet as a terminal card. Hovering a tile enlarges it in place to take over, with a "copy file" chip. No drawer; a click expands a tile to full viewport (shared-element transition). Draws from: lucide-animated (full-bleed tiles), lottiefiles (tray + dark tiles), itshover (terminal card), isocons (hover chip), rive (caps labels).
- Page: #ededeb ground, white and #101214 tiles, 0 gutter at edges and 4px between tiles; Type: Geist 15px body, caps mono labels 11px with tracking; the statement in 28px medium.
- Layout: CSS grid, row-height 480px, double-width tile every 5th; sticky slim top bar with search and subject filter pills.
- Figure framing: tile edge is the frame; figure 420px centred; subject label bottom-left in caps.

Recommendation order for ambition vs. distance from hairline: A (most different, strongest first impression), B (most distinctive and most reusable as a product tool), C (cheapest to build).
