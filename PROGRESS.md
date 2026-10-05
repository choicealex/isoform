# Session Checkpoint — 2026-10-05 (Isoform: skill + engine + three illustrations)

Isoform works end to end locally: the `isoform-animate` skill, its engine and checks, and three example
illustrations that draw themselves in and loop a story. Tree clean. Not on GitHub, not deployed.

> **What this file is for.** Only what `git log` can't tell you — what shipped and why is in the commit
> bodies (`git show <sha>`). When work is committed, its prose here collapses to its SHA.

## Shipped — 11 commits, `8020bc3` → `1789a1c`
`git log --oneline 8020bc3~1..1789a1c` · `git show <sha>` for reasoning.

| What | Commits |
|---|---|
| Isocons data (1,007 icons, parser reads the site bundle as data) + skill, kernel, bench, build/validate/look/inspect/find | `8020bc3` |
| Hairline-grade line work: silhouettes, rounded variants, traces, opt-in WebGL; one line width (masked outline) | `8f28cdf` `4015f9d` |
| Motion research (heroicons-animated, starred repos) → `research/00-motion-plan.md` | `4dd8013` |
| Illustration-first: `story` loops, hover takeover, Isocons-blue accent, poster frame | `ea99d0e` |
| Draw-in (one pen, screen-px dashes, full ink then settle), no dashed add-ons, flame anchored | `d39e71d` `6a8b5d5` `8944825` `9be528c` `1789a1c` |

Checks: `node skills/isoform-animate/validate.mjs <page>` → ok for all three · `look.mjs` → exit 0 for all
three (tier 2: desktop Chrome, light + dark, effect on/off). Never tested on mobile or touch.

## In Progress
Nothing — clean stopping point.

## Next
1. **Dogfood the skill** — run 3–4 new icons (shopping cart, padlock, car, lightbulb) through `/isoform-animate`
   using ONLY `SKILL.md` + rules + tools (a subagent is a fair stand-in for a stranger's agent). Fix the docs/kernel
   wherever it struggles; the runs become the site's "What it draws" examples.
2. **Touch** — hover takeover has no touch equivalent yet (proposal: press-and-hold takes over). Test at 390px.
3. **Website** like hairline.lucasmarkes.com (home hero drawing in, /figures catalogue + drawer, /skill, /docs,
   /inspo telling this session's real story) — structure notes in memory `project_isocons_skill`.
4. **BLOCKS ON USER:** create `choicealex/isoform` (public or private?) — `build.mjs`/`find.mjs` fall back to
   raw.githubusercontent from it; copyright name in `LICENSE` (currently "choicealex"). Deploy only when asked.

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
