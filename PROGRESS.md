# Session Checkpoint — 2026-10-05 (Isoform: skill dogfooded by four stranger runs)

Isoform works end to end locally: the `isoform-animate` skill, its engine and checks, and three example
illustrations that draw themselves in and loop a story. Tree clean. On GitHub (private), not deployed.

> **What this file is for.** Only what `git log` can't tell you — what shipped and why is in the commit
> bodies (`git show <sha>`). When work is committed, its prose here collapses to its SHA.

## Shipped — 13 commits, `8020bc3` → `60efb52`
`git log --oneline 8020bc3~1..60efb52` · `git show <sha>` for reasoning.

| What | Commits |
|---|---|
| Isocons data (1,007 icons, parser reads the site bundle as data) + skill, kernel, bench, build/validate/look/inspect/find | `8020bc3` |
| Hairline-grade line work: silhouettes, rounded variants, traces, opt-in WebGL; one line width (masked outline) | `8f28cdf` `4015f9d` |
| Motion research (heroicons-animated, starred repos) → `research/00-motion-plan.md` | `4dd8013` |
| Illustration-first: `story` loops, hover takeover, Isocons-blue accent, poster frame | `ea99d0e` |
| Draw-in (one pen, screen-px dashes, full ink then settle), no dashed add-ons, flame anchored | `d39e71d` `6a8b5d5` `8944825` `9be528c` `1789a1c` |
| Dogfood: 4 fresh Sonnet agents ran the skill (cart, key, car, gas station) → fixes: intro draws on while held, parts PNG + grid, word-first find, effect-dark shot, docs | `8c04c40` `60efb52` |

Checks: `node skills/isoform-animate/validate.mjs <page>` → ok for all three · `look.mjs` → exit 0 for all
three (tier 2: desktop Chrome, light + dark, effect on/off). Never tested on mobile or touch.

## In Progress
Nothing — clean stopping point.

## Next
1. **Dogfood figures, owner-reviewed 2026-10-05:** key fixed (`8ff0120`); car beams → cones, cart → "a box drops
   in" (needed a new kernel `trace({solid})`); gas station kept as is. Owner hasn't seen the car/cart rework yet. Pick
   which become the site's "What it draws" examples. A second dogfood round on the fixed skill is still worth doing.
2. **Touch** — hover takeover has no touch equivalent yet (proposal: press-and-hold takes over). Test at 390px.
3. **Website** like hairline.lucasmarkes.com (home hero drawing in, /figures catalogue + drawer, /skill, /docs,
   /inspo telling this session's real story) — structure notes in memory `project_isocons_skill`.
4. **Repo:** `choicealex/isoform` created PRIVATE 2026-10-05 (owner: "get a repo"). The raw.githubusercontent fallback in
   `build.mjs`/`find.mjs` and `npx skills add` only work once it is public — ask before flipping. Deploy only when asked.
5. **Website v2 — Specimen + Wall, dark default** (`c3eb689`; v1 rejected by owner). Lab of 5 mockups kept at /lab.
   Research: `research/{animateicons,animateicons-deep,site-survey,vercel-font,foundries-a,foundries-b}.md`. Tier 2
   desktop dark + light; 390px has no overflow (not touch-tested). Open: owner review; touch takeover; Biome hook cwd
   (a nested biome.json fails when the hook runs from a parent dir — fix is in the global hook, ask first).
6. **Dogfood round 2 (2026-10-05):** delete, shield-lock, partly-cloudy-day. Round-1 mechanics held (no blank shots, parts
   picture + find worked); taste didn't — delete and cloudy fail their own look, shield-lock weak at 240px. None on the
   site. Their friction (object entering a container, curved-face geometry, `--at` picks the extreme) → next skill pass.

## Decisions that constrain future work
- **Isocons are illustrations, not UI icons** (owner): every figure plays a story on its own; hover takes over and
  hands back. Model: pocketit `web/components/marketing/ModeArt.tsx`, voxflow-site `src/components/bento-art.tsx`.
- **Isocons blue `#229eff` is the default accent** (`--iso-hi`); the drawing is neutral ink.
- **No dashed lines, no stream lines** (owner): additions draw on as solid lines or are left out; the bottle's
  refill/pour is told by the water level alone.
- **WebGL is opt-in** (`?gl=1` / Effect button) and only adds material under traced lines; both versions look alike.
- **Every figure draws itself in** (`icon.ink`, linear, 5–7s) — owner approved the hand-drawn look after the fixes.
- Rounded-* variants by default; motion small (a few units at the default intensity); one idea per figure.
- Isocons is CC BY 4.0: the credit line on every bench page stays; never imply Isocons endorses Isoform.

## Dead ends — tried, didn't work
- Eval'ing the Isocons page bundle to extract icons — blocked as running external code — parse it as data (`scripts/extract-isocons.mjs`, `8020bc3`).
- Under-stroke silhouettes (2× then 3× width) — always thicker than inner edges — masked on-top outline (`4015f9d`).
- Normalised `pathLength` draw-on — breaks under `non-scaling-stroke` (scattered pieces) — screen-px dashes (`9be528c`; skill `.claude/skills/web/animation-interaction.md`, workspace `df0c9ee`).
- Cascade-all-faces draw-in, per-face fills mid-draw, eased intro — read as scattered/stalling — one pen, fills last, linear (`9be528c`).
- Pen-tip dot riding the draw-in — hops wherever the pen lifts, read as moving dots (owner, on the key) — removed from the kernel.
- Key turned by a 10–14° screen tilt — every edge bent off its axis — key stays square, the turn is a mark on the lock's rim.
- Pointer-height mapping ("raise to unscrew") — reads as a slider — nearness, small moves (`8f28cdf`, rules 03).

## Environment
- Local preview server: `python3 -m http.server 8811` in the session scratchpad (gone with the session) — rebuild pages with `node skills/isoform-animate/build.mjs <figure.js> <out.html>`.
- `look.mjs` installs `playwright-core` once into `~/Library/Caches/isoform-look`.

## Where things live
| Looking for | Read |
|---|---|
| The skill's rules / workflow | `skills/isoform-animate/rules.md`, `SKILL.md`, `concepts.md`, `look.md` |
| Engine API (read the index only) | top of `skills/isoform-animate/kernel.js` |
| Motion research + plan | `research/00-motion-plan.md`, `research/heroicons-animated.md`, `research/starred-repos.md` |
| Project memory (Hairline site notes, decisions, gotchas) | `~/.claude/projects/-Users-mac-Documents-Claude-code-Workspce/memory/project_isocons_skill.md` |
