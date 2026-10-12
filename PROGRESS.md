# Session Checkpoint — 2026-10-12 (Isoform: line check, cleaner effects, cold run, 6th deploy)

Isoform works end to end locally: the `isoform-animate` skill, its engine and checks, and three example
illustrations that draw themselves in and loop a story. Repo public; site live (see State).

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

### 2026-10-12 — after studying wheresryan22/anatomy (MIT)
| What | Commits |
|---|---|
| `lines.mjs` line-end check (run by look.mjs); bolt facet measured, cart scuffs land, rocket-top flame closed; kernel: dark-only soft knee, gated dither, screen blend, DPR 1.5, `burst`/`settle`, `{fallback}`/`{free}` traces; light-theme ink for car/house/bolt | `14165bb` |
| Cold run of the published skill on apps/delete/token + doc fixes (`dogfood/cold-2026-10-12/FINDINGS.md`) | `dcf641a` |
| Site: /skill names the line check; /inspo step 8 "Every line lands"; /inspo's empty `toast` plate → local-gas-station | `373194b` |

## In Progress
Nothing mid-edit; everything pushed.

## State (2026-10-12)
- LIVE https://isoform-skill.vercel.app = `373194b` (6th deploy, isoform-skill-qtv3gcijt). Repo PUBLIC, pushed.
  10 figure files feed the site (8 listed + rocket-top/right for the hero). The 23 interface icons stay OFF the site.
- Deploy only from a clean worktree (the guard hook blocks `vercel` while ANY file is untracked, e.g. dogfood/open-in-new/):
  recipe in project memory (5th-deploy line). /inspo renders per request: verify on the live page, not in .vercel/output.
- Verified 2026-10-12: look.mjs exit 0 on all 10 (desktop, light + dark); live site at 390px has no sideways scroll on
  7 pages; real touch events on the live rocket page (tap takes over, holds, hands back; sideway drag; vertical swipe scrolls).
- Kernel (engine) API: stretch, turn, spin, grow, hole, morph, extent; traces {fallback, free}; gl {blend}; burst, settle.
- Taste is still the weak point: 4 cold rounds now, every figure passed every check and some still read weakly.
  The look/review step is not optional. Don't call occlusion faults by eye on flat drawings (apps was correct).

## Next
1. Nothing open from 2026-10-12. Candidates: an effect figure in a cold run (no stranger has used `fallback` yet);
   from `research/anatomy-plan.md` (local): mobile shots in look.mjs (A3), tests + CI (B5), evals (B6),
   per-figure OG images (C9), sitemap/robots (C12).
2. `dogfood/open-in-new/` stays untracked by choice (owner, 2026-10-12: generated dogfood files stay out of git).

## Decisions that constrain future work
- **No concept recipe for blank symbols** (an empty checkbox with nothing to do): dropped by the owner 2026-10-06.
- **Isocons are illustrations, not UI icons** (owner): every figure plays a story on its own; hover takes over and
  hands back. Model: pocketit `web/components/marketing/ModeArt.tsx`, voxflow-site `src/components/bento-art.tsx`.
- **Isocons blue `#229eff` is the default accent** (`--iso-hi`); the drawing is neutral ink.
- **No dashed lines, no stream lines** (owner): additions draw on as solid lines or are left out; the bottle's
  refill/pour is told by the water level alone.
- **WebGL is opt-in** (`?gl=1` / Effect button) and only adds material under traced lines; both versions look alike.
- **Phenomenon traces fade out as their effect comes in** (owner, 2026-10-12, after Anatomy's "hollow outlined flame"): the trace is the fallback, drawn in full with effects off; with the effect on, the effect carries it. Supersedes "both versions look alike" for the phenomenon only — the icon's own lines never fade.
- **Every figure draws itself in** (`icon.ink`, linear, 5–7s) — owner approved the hand-drawn look after the fixes.
- Rounded-* variants by default; motion small (a few units at the default intensity); one idea per figure.
- Isocons is CC BY 4.0: the credit line on every bench page stays; never imply Isocons endorses Isoform.

## Dead ends — tried, didn't work
- A paint-order check from part motion (2026-10-12): flat drawings carry no depth, and it would have failed apps, which was correct physics (parallel drums sliding on their own axis) — `dcf641a` body.
- A `1-exp(-c)` tonemap on the effect layer: dims tuned effects ~30%, and on paper greys pale cores — dark-only soft knee instead (`14165bb`).
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
