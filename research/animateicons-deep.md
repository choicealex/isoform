# animateicons.in - deep build spec (2026-10-05)

Companion to `animateicons.md` (do not repeat it). Everything below was measured with a headless Chrome script at 1512x982, dpr 1, from live computed styles. Stack: Tailwind v4 + shadcn tokens + `motion`. Corrections to the first pass are flagged **CORRECTION**.

Screenshots (all in `/private/tmp/claude-501/-Users-mac-Documents-Claude-code-Workspce/304878bb-499f-4002-b4b2-77ea9c475244/scratchpad/ai-research/`):
- Home scroll steps: `home-00.jpg` (hero) `home-01.jpg` (search + start of playground) `home-02.jpg` (picker/swatches/sliders + "two libraries") `home-03.jpg` (4 context tiles + closing CTA + footer) `home-04.jpg` (wordmark)
- Load: `load-0/300/800/1500.jpg` (boot splash), `hero-t0/t200/t450/t900.jpg` (hero after the splash leaves), `reveal-60.jpg`, `reveal-300.jpg`
- Catalogue: `cat-00/01/02.jpg`, `card-hover.jpg` (cropped), `sheet-250.jpg`, `sheet-open.jpg`
- Docs: `docs-00.jpg`, `docs-01.jpg` (docs live at `/icons/docs`, not `/docs`)
- Raw data: `m1.json` (typography + boxes), `m3a.json` (hero/section HTML + states), `m6.json` (card + sheet), `m7.json` (docs, hero cycle, wordmark), `css.txt` (custom CSS rules)

---

## (a) Feel, in plain words

It feels like a quiet instrument panel in a dark room. The page is pure black, almost nothing is boxed in a line, and the only colour is one warm coral that appears in tiny doses (one word, one button, one lit icon, the full stop at the end of every headline). Type is big, tight and confident (Geist 600, negative tracking) with a lot of empty black around it, so each section reads as one sentence plus one object. Every object is soft: pills are fully round, surfaces are a barely-lighter grey (#0b0b0b to #161616) with no border, and corners on cards are gentle. Nothing shouts and nothing is decorated for its own sake; the "decoration" is the product itself, drifting very slowly (icons bob 8px over 6s) and reacting the moment you hover. The result is calm, technical and expensive because of restraint: three greys, one accent, two fonts, one easing curve, almost no shadows.

---

## (b) Token table

### Colour (dark only)
| Token | Value | Use |
|---|---|---|
| bgDark | `#000` | page, header (at 70% opacity), sheet |
| surface | `#0b0b0b` (rgb 11,11,11) | cards, tiles, docs link cards |
| surfaceElevated | `#161616` (22,22,22) | pills, inputs, code blocks, card hover |
| surfaceActive | `#1d1d1d` (29,29,29) | pill hover, active tab thumb, copy button |
| border | `#1f2933` (31,41,51) | sliders' track, custom swatch ring, sheet left border at 60% |
| textPrimary | `#e5e7eb` | headings, button labels |
| textSecondary | `#b0b3b8` | body, nav, inactive icons |
| textMuted | `#7c7c7c` | labels, kebab names, meta |
| primary | `#f45b48` | accent |
| primaryHover | `rgb(224,78,61)` = `#e04e3d` | primary button hover |
| primary tints | `primary/12`, `/15`, `/10` | active chip bg, selected picker bg, docs icon tile |
| white tints | `white/8` (card action pill), `white/10` (kbd, active segment), `white/15` (action hover) | |
| hero cta text | `#fff` (`--cta-text`) | on coral |
| swatches | `#fff`/`#e5e7eb`, `#f45b48`, `#38bdf8`, `#22c55e`, `#f59e0b`, `#a78bfa` | |
| success | emerald-500 at /12 bg, lab green text | "Recommended", callout |
| code (Shiki GitHub-dark) | keyword `#ff7b72`, string/pkg `#a5d6ff`, ident `#c9d1d9`, component `#d2a8ff`, attr `#79c0ff`, fn `#ffa657`, ok `#7ee787` | |
| plus-grid mark | `rgba(148,163,184,.16)` | backdrop |
| wordmark gradient | `textPrimary` 22% to 2% alpha, top to bottom | footer |

### Type (Geist sans; mono = `ui-monospace, SFMono-Regular, Menlo...`)
| Role | size/line | weight | tracking | colour | where |
|---|---|---|---|---|---|
| H1 hero | 60/66 (mobile clamp 36-44, sm 48) | 600 (2nd line 500) | -1.5px (`tracking-tight`) | #e5e7eb, accent word #f45b48 | home hero, closing CTA |
| H2 section | 36/40 (mobile 30) | 600 | -0.9px | #e5e7eb; trailing "." coral; optional 2nd clause #7c7c7c | home sections |
| H3 card title | 30/36 | 600 | -0.75px | #e5e7eb | "Lucide"/"Huge" |
| Docs H1 | 30/36 | 700 | -0.75px | #e5e7eb | docs |
| Docs H2 | 24/32 | 600 | -0.6px | #e5e7eb | docs |
| Sheet title | 20/28 | 600 | 0 | #e5e7eb | drawer |
| Lede | 16/26 (mobile 15) | 400 | 0 | #b0b3b8, max-w 672 | hero sub |
| Section sub | 16/24 | 400 | 0 | #b0b3b8, max-w 512-576 | under H2 |
| Docs body | 14/28 | 400 | 0 | #b0b3b8 | docs paragraphs |
| Button | 14/20 | 600 (cta) / 500 (secondary) | 0 | #fff / #e5e7eb | |
| Nav pill | 14/20 | 500 | 0 | #b0b3b8 hover #e5e7eb | |
| Search pill | 12/16 | 500 | 0 | | header |
| Small meta | 14/20 | 400 | 0 | #7c7c7c | "Try", slider labels |
| Card label | mono 13/19.5 | 400 | 0 | #7c7c7c | kebab names |
| Rail label | mono 10/15 | 600 | 1.4px, uppercase | #7c7c7c | NAVIGATION etc |
| Count chip | 10/14 | 500, tabular | 0 | #7c7c7c on white/6 (active: coral on primary/15) | sidebar |
| Sidebar item | 13/18.6 | 500 | 0 | #b0b3b8 / active #e5e7eb | |
| Code inline | mono 13/19.5 | 400 | 0 | #b0b3b8 / #e5e7eb | |
| Code block | mono 13/22 (sheet 12/19.5) | 400 | 0 | Shiki | |
| Slider value | mono 12/16 tabular | 400 | 0 | #b0b3b8 | |
| kbd | 12 (sheet 9.6) /16 | 500 | 0 | muted on white/10, round | |
| Footer link | 14/20 | 400 | 0 | #7c7c7c hover #e5e7eb | |
| Wordmark | min(14vw, 17rem)=211.7 / 0.78 | 700 | -0.05em (-10.6px) | gradient clip | footer |

### Radii (note: `--radius` is 6px and Tailwind's 3xl is remapped to 10px)
`rounded-full` pills/buttons/inputs/swatches/chips/search/tabs (everything interactive) · `rounded-3xl` = **10px** (cards, tiles, code blocks, preview stage, docs link cards) · `rounded-2xl` = 8px (inner product card) · `rounded-xl` = 6px (inner thumb) · `rounded-lg` = 5px (inline code). Nothing is square except sheet/header/sidebar edges.

### Spacing
Container `max-w-7xl` (1280) + `px-6` (24). Home section padding-block 48 (<1024) / **64** (>=1024), `text-align:center`. Heading to content: 44px (`mt-11`) for stage/search/tiles, 14px (`mt-3.5`) to sub. Hero stack gap 24 (`gap-6`). Button gap 12. Tile grid gap 16 (`gap-4`). Catalogue grid gap 12, page padding 16/24. Sheet padding 24, inner gap 24 (`space-y-6`). Header 64 (home) / 56 (catalogue).

### Shadows
Effectively none. Only: slider thumb `0 0 0 1px #f45b48, 0 6px 16px -4px #f45b4840`; thumb active ring `0 0 0 6px #f45b4840`; selected swatch `0 0 0 2px #000, 0 0 0 4px rgba(255,255,255,.x)` ring-offset; sheet `shadow-lg` (invisible on black); primary FAB-style player button `ring-primary/25` (hover `/40`). Focus ring everywhere: `ring-[3px] ring-ring/50` on buttons, `ring-2 ring-primary/60` on cards, `ring-2 ring-primary/50` on search.

### Motion
| Token | Value |
|---|---|
| default easing | `cubic-bezier(.4,0,.2,1)` |
| micro (pill/button/link colour) | 150ms |
| card bg + icon colour | 300ms |
| label opacity swap | 150ms |
| hero entrance | `translateY(18px)` + opacity 0 to 1, ~550ms decelerating (motion spring/ease-out), staggered ~90ms per element, begins when the boot splash leaves |
| idle bob | `heroBob` `translateY 0 / -8px / 0`, **ease-in-out** (CORRECTION: not linear), 5.4-7.1s, negative random delays |
| lit cycle | one icon turns coral at a time, colour transition 300ms, a new icon lights about every 1.4-2.0s, each stays lit about 1s (overlap 200ms) |
| tab thumb | `transition-transform duration-300` |
| sheet | in 500ms / out 300ms, same easing, slide from right; overlay `bg-black/50`, 150ms fade, no blur |
| boot loader | logo float 2.6s ease-in-out (`translateY(-6px) scale(1.06) rotate(-3deg)`), sweep bar 1.9s ease-in-out translate -120% to 360%; `html:has(.boot-loader){overflow:hidden}` |
| active press | `active:scale-[0.98]` on the install pill |
| reduced motion | bob, loader animations disabled; slider thumb transition off |

---

## (c) Section-by-section build spec

General: **no scroll-triggered reveals exist** (checked: no element anywhere has hidden inline styles after load except the hero's own entrance). Sections just sit there; all liveliness comes from hover, idle bob, the lit-icon cycle and interactive controls. Do not add fade-ups on scroll to match.

### 0. Boot splash
Full black screen, 40px logo centred, floating (see motion table), a 208px x 2px grey track under it with a sweep bar. Held about 1.5-3s on a cold load, then the hero staggers in. Optional for us; if kept, keep it under 1s.

### 1. Header (home): sticky, 64px
`sticky top-0 z-50 bg-black/70 backdrop-blur-xl` (blur 24px), **no border**. Inner `max-w-7xl px-6`, `flex h-16 justify-between`. Left: 40px round logo + wordmark "AnimateIcons" 18/600 white (hidden on mobile), gap 8. Right cluster (`gap-2`, 14px): pill-link "Icons", pill-link "Docs", search pill (`bg #161616`, hover `#1d1d1d`, px16 py8, 12px, magnifier 14px, label "Search icons", kbd chip `bg white/10` round px8 h20 "⌘K"), "Sponsor" with a pink-500 heart (18px), GitHub icon + star count (12px, tabular, tracking 0.6px). Pill-link: `px 14 py 6`, radius full, 14/500 #b0b3b8, hover bg #161616 + #e5e7eb, 150ms. In the docs/catalogue app shell the header is 56px, `bg-black/85 backdrop-blur-md border-b border-border/60`.

### 2. Hero (home): min-h `min(100dvh - 4rem, 72rem)`, flex column centred, pb 64
- **Background**: absolutely positioned `inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1920px]` with class:
  ```css
  .bg-plus-grid{
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34'%3E%3Cpath d='M17 13.5v7M13.5 17h7' stroke='rgba(148,163,184,0.16)' stroke-width='1'/%3E%3C/svg%3E");
    mask-image:var(--plus-mask,radial-gradient(ellipse 70% 60% at center,#000 22%,transparent 72%));
  }
  ```
  A 34px tile with a 7px plus, 16%-alpha slate, fading to nothing at the edges. No glow, no gradient, no noise.
- **Composition** (centred stack, 24px gaps, from y=96): H1 two lines (132px tall, ~610px wide), 24px gap, lede (672 max, 2 lines, 52px), install pill block, button row, then a 300px+ band of scattered icons.
- **H1 rhythm**: 3-4 words on line 1 with the last word coral ("Make Every Icon [Move]"), hard `<br>`, line 2 shorter and lighter (weight 500) naming the product. Total about 7 words. The accent is exactly one word.
- **Lede**: 2 balanced lines (`text-balance`), 16/26 grey, states the count and what it is.
- **Install pill**: 446px wide x 40px, full radius `#161616`, content `[coral 12px package icon] $ npm install ...` in mono 14 (the `$ ` in #7c7c7c) and a copy glyph on the right (muted, turns coral on hover). Press `scale(.98)`. **Stacked tab trick**: a second pill (`bg #111`, z-0) sits behind, scaled .9 and shifted `translateY(-26px)` with transform-origin `50% 100%`, showing a tiny "shadcn" mono 13px label with an icon; it peeks above like a card tab. Clicking swaps them (the front pill scales down, the back one comes forward). A `pt-[22px]` on the wrapper reserves the peek.
- **Buttons**: row, gap 12, `mt` follows the 24 stack gap: primary coral (`Browse N icons` + arrow) 40px tall, px 20, 14/600 white; ghost `#161616` (`Documentation` + up-right arrow) 14/500 #e5e7eb. Both full radius.
- **Icon field**: container `max-w-[1920px] mt-11 min-h-[300px] flex-1`, masked `linear-gradient(90deg,transparent,black 12%,black 88%,transparent)`. About 30 icons, each a 40px box (`stroke-width 2`, round caps), `text-textMuted/60` (about 60% of #7c7c7c), absolutely placed by percentages (`left:1.5%;top:24.4%` etc), `-translate-x/y-1/2`, wrapped in `.hero-bob` with `--bob` 5.4-7.1s and negative `--bob-delay`. One at a time gets `data-lit` and turns `#f45b48` (300ms). Density: roughly 3 rows, leaving big gaps; a few overlap the left/right edges and fade out under the mask.
- **FAB**: fixed `right-7 bottom-5 z-200`, 44px round `#161616`, coral heart (sponsor).

### 3. "Find yours" search (home-section, padding 64, centred)
H2 36/40 "N icons. [muted: Find yours in a keystroke][coral .]" (two-tone: first clause #e5e7eb, second #7c7c7c). Sub 16/24 grey, `mt-3.5`. Search field `mt-11`: `<label>` 576x64, `#161616`, full radius, px 24, gap 14, coral magnifier, input 18px #e5e7eb with muted placeholder; focus-within `ring-2 ring-primary/50` (`transition-shadow`). Results area `mt-9`, `max-w-3xl`, flex wrap centred, gap-x 16 gap-y 24, **min-h 128 (236 mobile)** so the layout never jumps. Results are bare circles (`bg #161616`, 44-92px) with the kebab name 10-12px below; hovered result scales up and neighbours shrink and fade (fish-eye falloff; see `home-01.jpg`). "Try heart cart lock camera": 14px, `Try` muted, words #b0b3b8 underlined (`underline-offset-4`), `mx-1.5`, hover coral. Then `mt-10` ghost pill "See all N" + arrow.

### 4. "Tune it. Copy it." playground (padding 64)
H2 centred. Stage `mt-11 flex-col items-center gap-5 relative`: a 1232x304 plus-grid layer (`inset-0`, mask `radial-gradient(circle at 50% 38%,#000 8%,transparent 60%)`); the live icon at 112px in coral centred, `min-h-44` grid. Under it: code pill `#161616` full radius, `py 8 pr 8 pl 20`, mono 13px #b0b3b8 (`<Home01Icon size={112} color="#f45b48" duration={1} />`, an invisible longest-variant sizer keeps the width fixed) and an inner "Copy" pill (112px wide, `#1d1d1d`, hover `white/10`, 14/500, copy icon). Row of two pills "Replay" (play icon) and "Reset" (disabled until changed, 50% opacity). Picker strip `mt-32`: 12 round buttons 44px (52px at sm), idle `#b0b3b8` with hover `#161616`, selected `bg primary/15 text coral`. Then a single row: 6 swatches 28px (gap 10) + a "+" custom ring (1px border, hidden colour input), selected swatch gets 2px black ring-offset + white-ish ring; beside it two labelled sliders ("Size 112px", "Duration 1.0s", 216px wide each, label 14px muted left, value mono 12px right). Slider CSS is in the details list.

### 5. "Two libraries" (padding 64)
H2. Two equal columns (256 / 216 / 216 grid with 40 gap inside `max-w-3xl`, but the icon scatters span full width): each column has a ~320px-tall field of ~12 icons (40px, muted 60%, same bob; one lit coral at a time), below it H3 30/36 name, count 14px muted, 16/26 grey description (max-w-xs 320, centred), coral text link 14/600 with arrow. No card background at all; the only "container" is empty space.

### 6. "Made for real interfaces" (padding 64)
H2 + sub (max-w-xl). Grid `mt-11 gap-4 sm:grid-cols-2 lg:grid-cols-4`; each tile 296x256 (`h-64`, p 24), `bg #0b0b0b`, radius 10, content vertically centred, caption 14px muted pinned to the bottom ("Toolbar", "Product card", "Player", "Like button"). Demos: a pill tab bar (`#161616`, p4, 4 buttons 44px, sliding `#1d1d1d` thumb with `transition-transform 300ms`, active icon coral); a mini product card (`#161616` radius 8, p10, 56px thumb tile + title 14 + price 12 muted + cart button; below a full-width coral "Add to cart" pill); a player (prev, a 56px coral round play with `ring-primary/25` hover `/40`, next); a like pill (`#161616`, heart + "128"). Tiles are static, no hover lift.

### 7. Closing CTA + footer
CTA block: `min-h-[420px] py-24`, masked scatter (`radial-gradient(ellipse 48% 60% at 50% 50%, transparent 60%, black 100%)`, i.e. icons only around the edges, clear in the middle), H1 repeated ("Make every icon [move.]" with a coral full stop), sub max-w-md 2 lines, buttons (`mt-9`, coral + ghost). Footer links: one centred row, `gap-x-20`, 14px muted, hover #e5e7eb, external ones with an up-right arrow. Credit line 14px muted, author name in #e5e7eb. Then the wordmark: `mt-10 px-2 select-none pointer-events-none`, 211px Geist 700, `-0.05em`, `line-height .78`, top-down gradient fill 22% to 2% white, cropped by the viewport bottom (the container is 165px tall, the glyph descends past it).

### 8. Catalogue `/icons/lucide`
Shell: left sidebar 256 (`border-r`, dark `#000`), main column `max-w-[1536px]`, sticky top bar 56. Sidebar: logo + wordmark (15/600) at top; sections with mono 10px uppercase labels (tracking 1.4px) 24px above; items 36px tall, radius full, px 12, icon 16 + 13/500 label; active item `bg #161616` + #e5e7eb; count chips on the right. "38 New" is a primary/12 coral mono chip. Top bar: search label 288x36 (`#161616`, full radius, magnifier, "Search 669 icons...", kbd chips ⌘ and K right), a thin 1px vertical divider, then the install pill (310x36: package-manager select + `npm` coral `i` muted `@animateicons/react` in mono 13/500 + copy), spacer, Sponsor, star count. Grid: `grid-cols-1, 576:2, 900:3, 5 at desktop`, gap 12, page padding 24, bottom margin 40. Intro text above the list is 14-16px.

### 9. Docs `/icons/docs/*`
Three columns: left rail (256, p 24, mono labels, items 13/500 radius-full px12 py8, active `#161616` + #e5e7eb, "Hook"/"AI" coral micro-chips 10/600), article `max-w 768` centred (breadcrumb 14px, "Open in AI" ghost pill with chevron top right, H1 30/36 700, lede 14/28, then content), right rail ("ON THIS PAGE" mono label, active pill `#161616`, Contribute links with 16px icons, "Star on GitHub" pill with yellow star count). Method cards: 2x2, 378x76, `#0b0b0b` radius 10, hover `#161616`, a 44px circular icon tile `primary/10` + coral glyph, title 14/600, desc 12px muted. "Recommended" chip: emerald/12 bg, emerald text 12/600, full radius. Code block: 768 wide, `#161616`, radius 10, titled header (mono 12 muted "Terminal" + tab pills: active `white/12` px12 py4 mono 12, others muted) separated by a 1px hairline, copy button right, body mono 13/22 Shiki. Inline code: `#161616`, radius 5, px 6, 13px. Callout: emerald/8 bg, radius 10, p16.

---

## (d) Component spec (states)

All transitions: `0.15s cubic-bezier(.4,0,.2,1)` unless noted. Focus (keyboard) on every button/link/card: ring 3px `ring-ring/50` (buttons), `ring-2 ring-primary/60` (cards), outline none.

**Primary pill button**: h40, px20, full radius, bg `#f45b48`, text `#fff` 14/600, gap 8, trailing 16px arrow. Hover bg `#e04e3d`. Active: no transform measured (except the install pill, scale .98). Disabled: opacity .5, no pointer events.

**Secondary/ghost pill**: h40, px20, bg `#161616`, text #e5e7eb 14/500. Hover bg `#1d1d1d`. Same focus ring.

**Pill-link (nav)**: px14 py6, transparent, #b0b3b8 14/500. Hover bg `#161616` + text #e5e7eb. Active page (docs header): bg `#161616` + #e5e7eb.

**Install/code pill**: 446x40, bg `#161616`, mono 14, hover `#1d1d1d`, copy icon muted to coral on hover, active scale .98.

**Search field**: h64 (home, bg `#161616`, radius full, text 18) / h36 (header, 12px). Focus-within ring 2px `primary/50` (home) or bg `#1d1d1d` (app shell). kbd chips `white/10`.

**Text link (Try / Browse X)**: #b0b3b8 underline offset 4, hover coral; or coral 14/600 with arrow.

**Picker button**: 44 (52 at sm) circle. Idle text #b0b3b8; hover bg `#161616` + #e5e7eb; selected (`aria-pressed`) bg `primary/15` + coral.

**Swatch**: 28px circle, `transition-transform`; selected shows a 2px offset ring in bg colour (`ring-offset-bgDark`) plus a ring; custom is a 1px `#1f2933` bordered "+" (hover text #e5e7eb).

**Segmented control (sheet install)**: container `#161616` radius full p4 h40; each segment 194x32 radius full 14/500; selected `bg white/10` + #e5e7eb; unselected transparent + #7c7c7c. Inner mini-tabs (npm/pnpm/bun): 24px tall, px10, 12/500, same selected treatment.

**Tab bar thumb (tile demo)**: absolute `bg #1d1d1d` 44px radius full, `translateX` by index, 300ms; active glyph coral, inactive `#7c7c7c` hover #e5e7eb.

**Slider**: see details list #6.

**Icon card (catalogue)**: 230x152 (grid width/5 minus gap; `h-38`), bg `#0b0b0b`, radius 10, no border/shadow, flex column centred gap 16, p12, `tabindex=0`, `role=group`. Icon 32px inside a 48px box (`size-12`), colour `#e5e7eb`. Label: mono 13px #7c7c7c, `line-clamp-1`, centred.
- Rest: icon white, label visible (opacity 1).
- Hover / keyboard focus (300ms bg + colour): bg `#161616`; icon box colour coral; **label fades to opacity 0 in 150ms**; an action pill (`bg white/8`, p2, radius full, gap 2, height 32, centred at `bottom-4`) appears with 3 round 28px buttons (copy npm import, copy JSX, open in v0; icon 14-15px, `#b0b3b8`, hover `bg white/15` + white); each is wrapped in a `span` that staggers in with `opacity 0 to 1` and `scale ~.997 to 1` (motion). A 28px round expand arrow (`bg white/8`, hover `white/15`, arrow 14px) sits `top-3 right-3`. The icon plays its own animation on hover.
- Focus-visible: `ring-2 ring-primary/60`, bg `#161616`.
- Pointer-coarse: card 200px tall, icon scaled 1.4, actions always on (label forced visible via `pointer-coarse:opacity-100!`).
- Selected: there is no persistent selected state in the grid; selection = the open sheet.

**Sheet / customise panel**: `fixed inset-y-0 right-0 z-50 h-full w-full sm:max-w-md` = **448 x 982**, bg `#000`, `border-l` at `border/60` (1px `#1f2933` at 60%), p0, overflow hidden, `shadow-lg`. Enter 500ms, exit 300ms, `cubic-bezier(.4,0,.2,1)`, `slide-in-from-right`; overlay `bg-black/50`, 150ms fade, no blur, close X top right (16px, 24px from the edge). Structure: header p `24/24/16`, title 20/600 + "lucide" badge (`#161616`, 12/500, px10 py2, full radius, #b0b3b8) on one line gap 10, helper 14px #b0b3b8 below, optional `data-scrolled` hairline when the body scrolls; body `flex-1 overflow-y-auto px-6 pt-4 pb-8 space-y-6`:
1. **Preview stage** 399x240, `#0b0b0b`, radius 10, plus-grid layer inside (same tile, mask `circle at 50% ...`), icon centred at the chosen size (default 64) in the chosen colour, pill chip "Hover to play" (`#161616`, 12px muted, px12 py4, full radius) at `bottom-3` centred; cursor pointer; click or hover replays.
2. Replay / Reset ghost pills (40px, gap 8, centred).
3. Sliders stack (`space-y-5`): label row 14px muted + value mono 12px; slider 4px high. Size 64px, Duration 1.00x.
4. Colour row: label left, 6 swatches + custom right (gap 10).
5. Install block: label "Install" 14 muted, segmented control (npm package | shadcn), then a `#161616` radius-10 box (header with npm/pnpm/bun mini-tabs left and Copy pill right (96x24, `#1d1d1d`, 12/500), mono 12 command, 12px muted note).
6. "Import & usage" box: `#161616` radius 10, header row (14px muted label left, Copy pill right), `pre` p `12/16` mono 12/19.5 Shiki, wraps.

**Count / badge chips**: full radius px6 py1 10/500; neutral `white/6` + #7c7c7c; accent `primary/12-15` + coral.

**Tooltips**: shadcn default on the action buttons.

**Header, footer**: see sections 1 and 7.

---

## (e) The 10 most distinctive details (exact CSS)

1. **Plus-grid backdrop with radial mask** (hero, playground, sheet stage), sets the whole "instrument" vibe:
   `background-image: url("data:image/svg+xml,...width='34' height='34'...M17 13.5v7M13.5 17h7 stroke rgba(148,163,184,.16)"); mask-image: radial-gradient(ellipse 70% 60% at center,#000 22%,transparent 72%)` (stage variant `radial-gradient(circle at 50% 38%,#000 8%,transparent 60%)`).
2. **Borderless luminance steps**: only three greys carry all structure. `#000` page, `#0b0b0b` surface, `#161616` raised / hover, `#1d1d1d` pressed / active; borders reserved for header, sheet and a few rails (`#1f2933`).
3. **Coral full stop**: every H2 ends with `<span class="text-primary">.</span>`; two-tone H2s dim the second clause to `#7c7c7c`. Heading: `font:600 36px/40px Geist; letter-spacing:-0.9px; color:#e5e7eb`.
4. **Stacked install pill with a peeking tab**: back pill `transform: translateY(-26px) scale(.9); transform-origin: 50% 100%; background:#111` behind the front pill (`#161616`), wrapper `padding-top:22px`; the tab label is mono 13px `#7c7c7c`.
5. **Slow ambient bob + one-at-a-time coral lighting**: `@keyframes heroBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} .hero-bob{animation:heroBob var(--bob,6s) ease-in-out var(--bob-delay,0s) infinite}` with per-icon `--bob:5.4-7.1s; --bob-delay:-1..-5s`, resting colour `#7c7c7c` at 60% alpha, lit colour `#f45b48` via `transition: color .3s cubic-bezier(.4,0,.2,1)`.
6. **Custom range slider**: `.ai-slider{appearance:none;height:4px;border-radius:9999px;background:linear-gradient(to right,#f45b48 X%,#1f2933 X%)} ::-webkit-slider-thumb{appearance:none;width:16px;height:16px;border-radius:9999px;background:#f45b48;border:3px solid #000;box-shadow:0 0 0 1px #f45b48,0 6px 16px -4px #f45b4840;transition:transform .15s,box-shadow .15s} :hover thumb{transform:scale(1.15)} :active thumb{box-shadow:0 0 0 1px #f45b48,0 0 0 6px #f45b4840;transform:scale(1.05)}` (the fill is a JS-updated gradient percentage).
7. **Hover card swaps label for tools**: card `transition: background-color .3s, color .3s`; hover `background:#161616`, icon `color:#f45b48`, label `opacity:0` (150ms), action pill `background:rgba(255,255,255,.08); border-radius:9999px; padding:2px; gap:2px` with 28px circular children (`hover: rgba(255,255,255,.15)`), expand arrow `top:12px;right:12px;28px;rgba(255,255,255,.08)`.
8. **Everything interactive is a full-radius pill**; surfaces are 10px. Header: `position:sticky; background:rgba(0,0,0,.7); backdrop-filter:blur(24px)` with no border line (app shell: `rgba(0,0,0,.85)`, `blur(12px)`, `border-bottom:1px solid #1f2933 @60%`).
9. **Ghost wordmark bleeding off the bottom**: `font:700 min(14vw,17rem)/.78 Geist; letter-spacing:-.05em; white-space:nowrap; color:transparent; background:linear-gradient(to bottom, rgba(229,231,235,.22), rgba(229,231,235,.02)); -webkit-background-clip:text; user-select:none; pointer-events:none; margin-top:40px`.
10. **Fixed-height result tray + sheet that slides 500ms in / 300ms out**: results `min-height:128px` (236 mobile) so search never reflows; sheet `animation: .5s cubic-bezier(.4,0,.2,1) enter` from `translateX(100%)`, closing `.3s`, overlay `rgba(0,0,0,.5)` 150ms with no blur. Combined with a single global easing `cubic-bezier(.4,0,.2,1)` everywhere, which is what makes every state change feel the same family.

Honourable mentions: `tabular-nums` on every number; mono labels with 1.4px uppercase tracking for rail headings; `text-balance` on ledes; `⌘K` kbd chips as round `white/10` capsules; card-sized skeleton heights reserved up front; `prefers-reduced-motion` disables bob and loader.

---

## Notes for adapting to Isoform (not a copy list)
- The look depends on black + one accent; if Isoform stays on paper/light, port the **structure** (three luminance steps with no borders, pill controls, 10px surfaces, one easing, one accent used as a full stop / one word / one lit item, mono rail labels, plus-grid drafting backdrop, hover-swaps-label-for-actions, sheet customiser with Replay/Reset + sliders + swatches) with inverted greys, not the black.
- No scroll reveals: motion lives in hover, idle bob and live controls. Matching that restraint is more important than any single animation.
- Do not copy their marketing copy; headline rhythm to emulate is: 4 words + one accent word, hard line break, shorter 2nd line in lighter weight; H2s are short two-clause sentences ending in a full stop.
