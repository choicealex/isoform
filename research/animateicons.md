# animateicons.in - design direction study (2026-10-05)

Measured with Playwright at 1512x982. Stack: Next.js (Turbopack), Tailwind v4, shadcn tokens, `motion` (framer-motion successor, bundled, `MotionIsMounted` global), Shiki code blocks, Microsoft Clarity.

## 1) Summary of design language

Pure-black, product-tool aesthetic: one near-white text tier ramp on #000, a single hot coral accent (#f45b48) used sparingly (hero word, primary pill CTA, hover icon colour, slider fills, trailing full-stop on every H2). Geist throughout, tight tracking on headings, monospace for labels/code. Soft rounded surfaces (cards 10px, pills fully round) with NO borders on cards; separation comes from tiny luminance steps (#000 / #0b0b0b / #161616). The hero is a faint "plus" dot grid fading out radially, with ~30 dim line icons bobbing in the lower half and a single coral one lit. The core idea is "the catalogue IS the demo": every surface (hero, search results, cards, docs examples) is live and animates on hover, and a playground with sliders sits on the home page itself. Developer ergonomics (npm/pnpm/bun, shadcn, CLI, MCP, "Open in AI") are first-class and framed as part of the product. Dark only, no theme toggle.

## 2) Per-page structure

**/ (home)** - sticky 64px top bar (logo, Icons, Docs, "Search icons" pill with cmd-K badge, Sponsor, GitHub star count). Sections, each `.home-section` with 64px vertical padding inside a `max-w-7xl` (1280) / px-6 container:
1. Hero (~918px tall, min-h 100dvh-4rem): H1 60/66 semibold, -1.5px tracking, one word in coral; 16/26 grey sub; command pill `$ npm install @animateicons/react` with copy button and a tab-tag above it ("shadcn"); coral pill CTA + ghost pill "Documentation". Below: plus-grid bg (34px tile, `rgba(148,163,184,.16)` plus marks, radial mask 70% 60%, 22%->72%) and scattered dim icons with CSS `heroBob` (translateY 0 -> -8px -> 0, linear, 5.9-6s, negative random delays; ~70 running animations).
2. "1170 icons. Find yours in a keystroke." - inline search field, "Try heart cart lock camera" chips, results grid, "See all" button.
3. "Tune it. Copy it." - big 112px icon centred on the plus grid, live JSX line `<Home01Icon size={112} color="#f45b48" duration={1} />` with Copy, Replay/Reset, an icon picker strip of 13 icons, 6 colour swatches + custom, Size and Duration sliders.
4. "Two libraries. One motion system." - two columns (Lucide 669 / Huge 501), each with a scatter of dim icons and a coral text link.
5. "Made for real interfaces." - 4 equal dark tiles (toolbar, product card, player, like button) showing icons in context.
6. Closing CTA repeating H1 + two buttons, scattered dim icons, footer link row, MIT/author line, then a 211px ghost wordmark "AnimateIcons" bleeding off the bottom edge.

**/icons/lucide and /icons/huge (catalogue)** - app shell: left sidebar 256px (NAVIGATION: Home, Installation, Examples, MCP, Supporters, Submit; ICON LIBRARIES with a "38 New" badge; CATEGORIES with count chips, 25+ categories), top bar 56px sticky (search with cmd + K badges, npm-command pill with package-manager dropdown and copy, Sponsor, stars). Content: 5-column grid of 232x152 cards, 12px gap, ~16px side padding (1256px grid width). Columns collapse: 1 / 2 (576+) / 3 (900+) etc. 669 icons in one long scroll page (22k px), no pagination visible. Card labels are lowercase kebab names in mono 13px.

**Icon detail** - no route; click a card opens a right Sheet 448px wide, full height, pure black, slide-in 0.5s `cubic-bezier(.4,0,.2,1)` (close 0.3s). Contents top to bottom: title "Eye" + library badge, one-line helper, preview stage (plus-grid bg, rounded, "Hover to play" chip), Replay / Reset pills, Size slider (shows 64px), Duration slider (1.00x), Colour swatches (white, coral, sky, green, amber, violet, custom "+"), Install segmented control (npm package | shadcn) with npm/pnpm/bun tabs + Copy and a note that the card's copy button follows this choice, then "Import & usage" code block with Copy showing `<EyeIcon size duration color />`.

**/icons/docs/** - three-column docs: left rail 256 (GETTING STARTED / EXAMPLES / INSTALLATION METHODS, with small "Hook" and "AI" tags), centred article 768px wide (H1 30/36 bold, 16px body in 28px-ish leading, breadcrumb, "Open in AI" dropdown top right), right "ON THIS PAGE" rail with active pill, plus CONTRIBUTE (Edit this page, Report an issue) and COMMUNITY (Star on GitHub chip). Install page opens with a 2x2 grid of method cards (icon tile in coral-tinted square, title, one line), a green "Recommended" chip, code blocks with titled header bar ("Terminal" + npm/pnpm/yarn/bun tabs, or "Example.tsx" + TSX chip) and copy button. Example pages (buttons, inputs, cards, navigation, hover-helper) pair a live demo panel on the plus grid with source below. /docs/mcp documents an MCP server for Claude Code/Cursor. /sponsors is a supporters page. No llms.txt (404).

## 3) Tokens

| Token | Value |
|---|---|
| Font sans | Geist (variable 100-900, self-hosted via next/font, plus "Geist Fallback") |
| Font mono | system stack `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas...` (labels, code, kebab names) |
| H1 hero | 60/66px, 600, -1.5px, #fafafa-ish (lab 98.26) |
| H2 section | 36/40px, 600, -0.9px, #e5e7eb (textPrimary) |
| Docs H1 | 30/36px, 700 |
| Body | 16/26px (home sub), 16/24 base, #b0b3b8 (textSecondary) |
| Buttons / chips | 12-14px, 500 |
| Rail section labels | 10/15px mono, 600, uppercase, wide tracking (0.05em), #7c7c7c |
| Code | 13-14px mono, Shiki, coral for `npm`, sky for package names |
| Card label | 13px mono, #7c7c7c |
| bgDark | #000 |
| surface | #0b0b0b (cards) |
| surfaceElevated | #161616 (card hover, code blocks) |
| border | #1f2933 / white at 10% (`--border`); topbar `border-border/60`, `bg-black/85` + blur |
| textPrimary / Secondary / Muted | #e5e7eb / #b0b3b8 / #7c7c7c |
| primary (coral) | #f45b48; glow `#f45b4840` |
| Swatches | white, #f45b48, #38bdf8 (info), #22c55e, #f59e0b, #a78bfa |
| Radius | --radius 6px base; cards 10px; pills/buttons fully round; stage/code ~16px |
| Layout | container max-w-7xl 1280 / px-6; catalogue grid 232x152, gap 12; sidebar 256; topbar 56 (catalogue) / 64 (home); drawer 448; docs article 768 |
| Section rhythm | 64px vertical padding per home section |
| Theme | dark only (`html.dark`, `color-scheme: dark`), no toggle |
| Transition default | 0.15s `cubic-bezier(.4,0,.2,1)`; cards 0.3s same curve |

## 4) Icon card + detail interaction spec

- **Card**: 232x152, #0b0b0b, no border, radius 10. Icon 32px (stroke 2, round caps) in a 48px box, label below with 16px gap. Focusable (`tabindex=0`).
- **Hover** (0.3s colour/background): bg -> #161616, icon colour -> coral, label is REPLACED by a floating action pill with 3 round 28px buttons: "Copy npm import", "Copy JSX Code", "Open in v0.dev"; plus a small round expand arrow (top right) = "Open in playground". Touch devices (`pointer-coarse`): taller card (200px), icon scaled 1.4, actions always shown.
- **Animation on hover**: plays the icon's own animation, JS-driven by `motion` (not CSS keyframes): inline `transform` per path/line (translateX, scaleY, rotate) with `transform-box: view-box|fill-box` and explicit px `transform-origin`. Measured on "eye": ~37 distinct frame states over ~930ms, then returns to `none`; so one-shot ~0.9-1.0s at duration=1, scaled by the Duration slider (0.x-Nx). Icons expose an imperative handle (`SparklesIconHandle`) so a parent container's hover can trigger the icon (docs: "play on the container's hover").
- **Click**: opens the 448px right sheet (above); no URL change, no deep link.
- **Search**: input (maxlength 100, "Search 669 icons..."), cmd+K focuses it (no command palette; verified: no dialog, input focused). Categories in sidebar with counts; hero search on home shows live results with "Try" chips.
- **Copy/install**: npm i pill in the topbar with package-manager dropdown; per-card copy follows the chosen install mode (npm vs shadcn); shadcn CLI, own CLI, MCP, v0.dev link, "Open in AI" menu on docs pages.
- **Customise**: Size slider (shown 64px default, 112px on home), Duration (1.00x), 6 colour swatches + custom; the JSX line updates live; Replay/Reset buttons.

## 5) Borrow for Isoform (ranked)

1. **Live customiser sheet/panel with Replay/Reset + Duration (speed) slider + colour swatches + live-updating snippet** - complements Hairline's right drawer (slider + code tabs): add Replay/Reset and a speed multiplier as first-class controls, and make the code line update as you change them.
2. **Hover-reveals-actions on the card (label swaps for round copy buttons + expand arrow)** - replaces Hairline's click-only card; gives one-click "copy HTML / copy prompt / open" without opening the drawer.
3. **"The catalogue is the demo": search results where every card already moves + "Try" chips** - complements Hairline's /figures grid; lets the home page host a real search.
4. **Home-page playground section ("Tune it. Copy it.")** with a big hero illustration, picker strip of ~12 items, swatches and sliders - replaces Hairline's single self-drawing hero figure's role as the only demo; keep the hairline hero but add this as section 2.
5. **Install affordance as a pill with copy + package-manager tabs, tagged by method** - for Isoform the install is "add the skill" (CLI / `npx skills add` / copy prompt); complements Hairline's /skill prompt chips.
6. **Sticky catalogue shell: 256 left rail with category counts + sticky top bar with search and cmd+K focus** - same pattern as Hairline's left rail; borrow the count chips and the cmd+K shortcut hint.
7. **Docs article layout: left rail, 768 article, right "On this page" rail with Edit/Report links, "Open in AI" menu, method cards (2x2)** - complements Hairline's single-page /docs; the "Open in AI" menu fits the agent-skill positioning (pairs with llms.txt, which animateicons lacks and Hairline has).
8. **Examples in context ("Made for real interfaces": 4 tiles)** - for Isoform: show an illustration used as empty state, hero, feature tile, error page; complements /inspo.
9. **Plus-grid backdrop with radial mask, behind preview stages** (34px tile, ~16% slate marks, radial fade) - suits isometric/line art as a drafting-paper cue; use as the stage background in the drawer and hero.
10. **Ghost giant wordmark bleeding off the footer, coral full-stop on each H2** - cheap brand signature.
11. **Titled code blocks (file name header, language chip, copy button, tabs)** - tighten Hairline's React/Vanilla/CDN tabs into the same header bar.
12. **Slow ambient bob on idle items (6s linear, random negative delays, 8px)** - only as a tiny touch on a hero scatter of illustrations, never on the catalogue.

## 6) Don't borrow

- **Dark-only, pure #000 + coral**: Isoform is paper/hairline line-art; a black tech-product look fights the drafting-paper feel. Keep Hairline's light surface; if dark is added, do it as a real theme.
- **Dim scattered floating icons as hero**: reads as an icon-font toy; Isoform's hero should be one large self-drawing illustration, not 30 faint glyphs.
- **Per-icon JS (motion) transforms with inline styles**: Isoform ships self-contained single HTML files with their own animation; do not adopt a React/motion runtime or imply the site needs one.
- **Borderless luminance-only cards at 232x152 with 32px icons**: too small for isometric illustration; Isoform needs larger tiles (approx 280-360px) and a visible hairline.
- **Colour swatch recolouring and stroke-width 2 chunky icons**: Isoform's thin hairline and CC BY 4.0 source geometry should not be recoloured arbitrarily without a credit-preserving default.
- **Single endless 669-card scroll with no deep link per item**: drawer without a URL means no shareable item; keep Hairline's per-item addressability.
- **Marketing sections (sponsors page, Clarity analytics, star counters, v0.dev link)**: off-brand for a small open-source skill; also add llms.txt (they have none).
- **Licence/credit**: they only state "Free and open source under the MIT license. Built by Avijit Dey." in the footer and do not visibly credit Lucide/Huge sources on the pages visited. Isoform must do better: per-illustration attribution to Isocons (CC BY 4.0) with a link in the drawer and inside each exported HTML file.

## 7) First-hand look, 2026-10-05 (after the owner rejected our v1 site)
Owner: "i dont like the website design" — and pointed at animateicons.in again for fine-tuning. Seen side by side:
- **Home hero is centred and dark**: two-line headline in grey with ONE coloured word (coral), a two-line sub in muted
  grey, an install pill with a small tab ("shadcn") sitting on top of it, then two pill buttons (filled coral + dark).
  Below, a full-bleed field of ~30 icons scattered over a faint plus grid, some dim, some lit — the catalogue as hero.
- **Catalogue is an app shell**: full-height left sidebar (Navigation / Icon libraries / Categories, each with count
  badges; the active row is a filled pill), a top bar with search (⌘K) and the install pill, and a dense grid of dark
  cards (~230×150) with mono labels.
- **Detail panel** (right, ~460px): title + library chip, one-line instruction, framed preview on a plus grid with a
  "Hover to play" chip, Replay / Reset pills, Size + Duration sliders with an accent-filled track and a ringed thumb,
  colour swatches, an Install segmented control (npm package / shadcn) above package-manager tabs, syntax-coloured code.
- **Why ours reads weaker by comparison**: left-aligned editorial hero (quiet, small figure), off-white page, cards and
  rails that look like a docs site, not a tool; no search; controls are plain; nothing fills the width.
