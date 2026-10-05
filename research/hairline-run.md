# Hairline `hairline-create` run: how the skill works in use

Prompt: `/hairline-create a deploy pipeline: build, test, ship`. Run dir: `.../scratchpad/hairline/run/`. Skill: `.../scratchpad/hairline/repo/skills/hairline-create/`.
Skill folder: SKILL.md (71 lines), concepts.md, rules.md, kernel.js (engine, index in header comment), bench.html (page), build.mjs, validate.mjs, look.mjs, look.md, examples/{terrain,riffle}.js.
Timings are approximate wall clock; only the script run was timed exactly.

## 1. Workflow as experienced
1. Read SKILL.md (one read). It is a numbered 1 Concept, 2 Build, 3 Check, 4 Hand over, 5 Adjust, plus a "what goes wrong" table. ~1 min.
2. Concept: SKILL.md says read concepts.md (~110 lines: how to find the object, six proven answer types, empty-state, from-a-mark, weak concepts, and a worked example for "a deploy pipeline" with exactly three concepts: Locks, Marble run, Cabinet). Offer 2-3 one-line concepts, wait. Nobody to ask, so I took the strongest-rest-pose one (Locks: three locks map to build/test/ship). ~2 min.
3. Build: read rules.md (ten rules, ~70 lines), the kernel index only (`awk '/var HL/{exit}' kernel.js`, ~100 lines of API), one example (riffle.js, 170 lines), then look.md (needed before the check). Wrote `locks.js` (~95 lines). ~10 min incl. design thinking (stepped hit-test, water line inset, gate geometry).
4. Check: one command, run from the run dir:
   `node ../repo/skills/hairline-create/look.mjs locks.js --answer 69,22,27 --edge 0,0,0 --edge 138,44,14`
   First attempt failed at once with the usage line because I wrote `--edge a,b,c,d,e,f` (needs the flag twice). Second attempt: exit 0, 7.9 s wall incl. first-time playwright-core install.
   Output (short):
   - built hairline-locks.html, and the validator passes it
   - installing playwright-core once, into /Users/mac/Library/Caches/hairline-look
   - answer 69,22,27 -> at=200,165 · edge 0,0,0 -> at=144,150 · edge 138,44,14 -> at=256,239
   - 9 frame: ok. Rest fills 210 x 164, 27% of it.
   - 8 read-out: ok (rest/lock 2/rest/lock 2/rest/lock 3/lock 2/lock 2)
   - 12 console: ok. 4 flicker: still (within 1.8 s). 3 answer: ok, 44% of the ink moves at 240px.
   - writes sheet `hairline-locks-look.png`, plus `-blind.png` (small + small-answer, labels hidden, for item 1) and `-motion.png` (16 frames of the answer playing). The blind and motion sheets are NOT in SKILL.md or look.md prose I read (look.md says "eight pictures"); the script prints their purpose.
5. Read the sheet and motion sheet, answered look.md's questions. ~3 min. 1 successful look run (plus 1 usage-error run). Did not revisit the figure.
6. Hand over: not done as an artifact (task is a report); see section 5.

## 2. Concept step
Format (verbatim): `> **Name.** The object. What the pointer does to it. What the read-out says.` Wait for the person to pick; skip only if object+gesture already chosen; with nobody to ask, take the strongest rest pose and say which. "One figure, one idea."
Options (from concepts.md's own worked deploy-pipeline example, which I used as the offer):
- **Locks.** A flight of canal locks stepping down, each a basin. The pointer picks a lock; its gates open and its water drops to the next, staggered from the pointer. Read-out: `lock 3`.
- **Marble run.** A wooden frame with three ramps zigzagging down, one ramp a stage, marbles rolling and lifted back; hovering slows it; the one under the pointer is bright. Read-out: `ramp 2`.
- **Cabinet.** A server cabinet of twelve blades, a few half out where the last update stopped. Pointer height sets the update; blades near it slide out; the one under it is bright. Read-out: `blade 7`.
Picked Locks (3 locks = build, test, ship; discrete "one of many" answer, riffle-type). Note: concepts.md hands you a deploy-pipeline answer almost verbatim, so the concept step was nearly free for this prompt. concepts.md also requires naming 2-3 identifying features per part (here: gate across the downstream end, recessed basin with water line, stepped heights).

## 3. The figure file
`locks.js`, ~95 lines (limit 200). Structure: header doc comment; `const {...} = HL;` (no imports, HL is injected); constants; `mount({stage,svg,read}, value)` returning `{set, destroy}`: disposer bag, Cam(45,0.5,1.7) + `fit` over extreme poses, `proj`/`facing`, per-lock `solid`+`prism` (rings footprint), a water path, a gate path; `draw` skipping unchanged values; `register(stage, tick)` returning true only while a tween is moving; static `hit` that unprojects onto each lock's rest top and picks the nearest middle; `setActive` with `tset(... , |k-from|*stag)` stagger and `hi` class toggle; `pointer(stage,{move,leave})`; `read.textContent`.
Declaration:
```js
hairline({
  name: "locks",
  means: "Three canal locks stepping down: the one under the pointer opens its gate, and the others follow in turn.",
  rules: [1, 2, 3, 4, 8, 9],
  range: [0, 40, 90],
  mount,
});
```
Fields: name (lowercase), means (<=140 chars, one sentence, the line under the stage), rules (numbers leaned on), range (slider value at intensity 0, .5, 1; the figure's own units; here stagger ms), mount. Build: `node build.mjs locks.js` -> `hairline-locks.html` (kernel + figure injected into bench.html at /*KERNEL*/ and /*FIGURE*/).

## 4. The check
- look.mjs: builds, validates (stops before the browser if it fails), opens 8 shots in one browser: rest, answer, small (240px), small-answer, low (intensity 0, edge point), high (intensity 1, edge point), dark, light. Composites one labelled sheet (addresses + read-outs in labels). Extra: blind sheet, motion sheet (16 frames). Optional `--zoom <shot>`.
- Machine-answered: item 9 frame (box inside 400x320; warns <25% coverage), 8 read-out (rest picture must say `rest`; warns if answer picture still says rest), 12 console (any error/warning/page error fails), 4 flicker (info: waits 1.5s then until still, max 5s), plus an item-3 pixel-fraction measure. Exit 1 on validator fail or items 9/8/12 fail, 2 if no browser/install.
- validate.mjs checks (text-based): kernel (untouched, sha), parse, bench (only figure differs), text (no words, rule 10), paint (no own colour/stroke/fill/opacity/filter), outside (nothing external, nodes via HL.mk), clock (no timers/rAF/SMIL), tween (tset has 4 args), hit (input only via HL.pointer, no DOM measuring), readout, handle ({set,destroy}), declare, length <=200.
- playwright-core: Hairline's own look.mjs installs `playwright-core@1` via npm into `~/Library/Caches/hairline-look` (macOS; `HAIRLINE_LOOK_CACHE` overrides; `%LOCALAPPDATA%` / `~/.cache` elsewhere), never into the skill or cwd; drives system Chrome or Playwright Chromium, prints install command and exits 2 if neither. It installed itself fine here (it did not need the isoform-look cache).
- Questions (look.md, 13 items, yes/no) and my answers: 1 silhouette reads at 240px: partly yes (three descending basins, each with a gate slab; a viewer could read "stepped tanks with gates"; "canal lock" is the stretch; blocks are a bit tub-like). 2 rest composed: yes (stepped heights, gates at 0/.4/.7 open, one bright gate on the top lock). 3 falloff/spread: yes (gate openness 1 / .45 / .15 by distance, staggered; the differences are small on screen). 4 flicker: still (hit tests rest tops). 5 bright outside dim inside: yes. 6 nothing through: yes. 7 one highlight: yes (gate stroke only; moves to chosen lock). 8 read-out: yes. 9 frame: yes. 10 both themes: yes. 11 no words: yes. 12 clean: yes. 13 empty state: n/a. 1 successful run (plus the usage-error run); no fixes made, so honestly not iterated. Weaker points I saw but did not fix: the gates animate only a few px; the water line is faint; the motion sheet showed nothing folding or jumping.

## 5. Hand over (what SKILL.md says)
Publish `hairline-<name>.html` as an artifact if possible, else leave the file and say where. Then one line each: the metaphor (object and what the pointer does); the rules it leans on; anything unverified (no Node, no browser), plainly. look.md adds: without a browser, say "not looked at in a browser". I did not publish (report task); output: `run/hairline-locks.html`.

## 6. What the figure looks like and does
Rest: three rounded blocks stepping down from far-left to near-right (heights 40/27/14, 46x44 footprints), each with a dim inset crease at the top lip, a fainter water line inside, and an upright rounded gate slab on its downstream (+x) end. Gates are open by 0 / .4 / .7 (tall to short). Only the first gate is drawn bright. Pointer over a lock (picked by nearest-middle on each lock's rest top): its gate sinks to a low sill and goes bright (the rest mark gives up), its water line drops 4 units, neighbours' gates sink less (.45, .15) staggered by |i-a|*stag ms (700ms ease). Read-out `lock 1..3`, `rest` otherwise. Slider = stagger 0/40/90 ms. All monochrome stroke; dark and light themes both fine.

## 7. Friction and what worked
Friction:
- `--edge` takes one point per flag (repeated twice); I passed a six-number list and got only the usage line. look.md says "Give it twice" but SKILL.md's usage string is the only hint at the call.
- Undocumented extras: look.mjs also writes blind and motion sheets; SKILL.md/look.md prose I read says eight pictures. Useful but a surprise.
- Choosing world points for `--answer`/`--edge` by hand needs doing the projection in your head; look.mjs prints the `?at=` it got, which is how you verify. `--answer` at the lock's top centre happened to hit lock 2, as intended; edge point 2 reads lock 3 at the end.
- The frame check warns only below 25%; mine was 27% (small figure in the plate). S=1.7 was a guess; no guidance beyond "try values".
- Hit-testing stepped parts is documented (rule 01), but it is the hardest bit and there is no example for it; I improvised from the rule text.
- SKILL.md is not self-contained: the reads (concepts, rules, kernel index, example, look.md) are about 450 lines before writing any code.
Worked well: the kernel index (one comment block gives the whole API, with painting-order guidance); concepts.md's worked deploy-pipeline example; the validator catching mechanical violations before the browser; one look command producing a single sheet, with machine-answered lines for read-out/frame/console; the "what goes wrong" table; fixed bench so only one file is authored; the self-installing browser dependency.

## 8. Rules list (titles) and colour/effects/motion rules
01 hit: hit areas don't move · 02 order: stagger by distance · 03 reach: clamp the reach · 04 accent: the stroke is the only highlight · 05 rest: rest is designed, never flat · 06 honesty: construction stays honest · 07 cost: loops sleep offscreen · 08 clock: two clocks · 09 radius: round every corner, then draw less · 10 quiet: no words inside the figure. Plus "The frame" (viewBox 400x320, centre near (200,166) with `fit`, camera Cam(45,0.5,S), readable at 240px, <=200 lines, destroy leaves svg empty).
Colour/effects/glow/motion:
- Rule 04: no fills, glows, shadows, gradients, filters, opacity tricks or own stroke widths; colour is only the class palette (none, sil, hi, lo, nf, fo, dash, dot, dot m, dot off); exactly one place bright at a time; rest mark gives up the bright when the pointer chooses. "The figure sets no colour". SKILL.md table: "reaching for a colour, a fill or a glow -> move one stroke from sil to hi".
- Motion: rule 08 two clocks: choices use a 700ms tween on (.32,.72,0,1), continuous input uses spring k100 c18 m1; nothing linear; no invented durations. Rule 07: all motion inside `register(stage,tick)`, no timers/rAF/CSS animation, tick returns true only while moving, reduced-motion lands instantly. Rule 02: stagger step 30-60ms. Rule 03: clamp every lift/gap/lean; fit the camera to the most extreme pose. No explicit pixel "motion size" limit beyond staying inside the 400x320 frame at intensity 1.
