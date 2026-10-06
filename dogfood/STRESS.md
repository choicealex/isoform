# Stress test, 2026-10-06

Question (owner): will the skill work on any Isocons icon, whatever the view or curve?
Proven before this: all 6,041 drawings load, fit and draw in through the kernel (0 failures); 9 figures animated,
8 rounded-left + 1 sharp-top (house). This run: fresh agents (Sonnet, no session context) follow SKILL.md cold on
the cases not yet proven, each logging friction in its folder's FRICTION.md. No agent may edit the skill or commit.

| # | Icon | View | Tests | Folder | Result |
|---|---|---|---|---|---|
| 1 | credit-card | rounded-top | untested view | credit-card-top | mechanics PASS (axes measured right, look exit 0, one paint-order trap fixed by the agent); figure WEAK: floating "reader head" line, decorative blue glow, agent graded itself yes/partly |
| 2 | local-shipping | rounded-right | untested view | truck-right | mechanics PASS (axes measured right, exit 0, no holes); figure WEAK: barely moves, rim marks are specks, dust puff floats off the rear corner instead of along the ground |
| 3 | storefront | sharp-left | untested view | storefront-sharp | FAIL: stray diagonal line across the awning even at rest (rule 05); the face copy behind the awning has no outline; cut point guessed by eye. Axes measured right |
| 4 | toggle-on | sharp-right | untested view | toggle-right | mechanics PASS (axes measured right, exit 0); figure PLAIN but legible: knob slides along v to the far end and back; the seat it leaves shows as a dim ring (a face-copy stand-in for the hole) |
| 5 | radio-button-checked | rounded-left | axes not measured + all curves | radio-curve | FAIL: readout says "out 22" but the dot visibly hasn't moved; blue rail traces float beside the ring. Agent guessed {u:[0.866,0.5], v:[-0.94,0.33]} from an ellipse ratio with no guidance |
| 6 | domain | rounded-left | dense (33 faces) | domain-dense | PASS, best so far: windows light floor by floor in warm lamplight, reads at a glance; 33 faces no trouble. Flaws: blocky/faint halo (cells visible, faint in light theme); two windows bright at rest |
| 7 | star | rounded-left | dot faces | star-dots | mechanics PASS (axes measured, exit 0); figure WEAK: "hot metal" is a muddy cloudy-brown wash over the whole star (effect smothers the lines); "branding" a favourite star is an odd concept |
| 8 | flight | rounded-left | tiny detail + odd measured u (0.6, 0.8) | flight-tiny | mechanics PASS (the odd u is the plane's real edge; no override); figure WEAK: exhaust plume straight down like a rocket, plane hard to read |

Batches of three (parallel agents trip the rate limit). Findings → fixes to the skill, then this table's Result column.

## Findings so far
- F1 (credit-card): the agent self-review is lenient: Q8/Q11 passed a decorative effect the rules forbid. look.mjs exit 0 can't
  judge concept quality; the skill needs a sharper self-check, or the concept step must not be skipped when it's weak.
- F2 (credit-card): an answer picture can lack the phenomenon (channel driven only by the story, not the hand) and look.mjs
  still exits 0 → candidate check: answer readout differs from rest but the answer shot has no trace drawn.
- F3 (credit-card): `{paint: "first"}` vs `after()` not signposted in SKILL.md's What goes wrong.
- F4 (truck) FIXED in 7f15ff9: the kernel index said part.trace "moves with the part"; it doesn't (points are stage points as drawn
  now; rocket and water-bottle rely on that). Doc corrected, behaviour kept.
- F5 (storefront, and delete's FRICTION #4/#6 weeks earlier — never fixed): icon.face() copies can't join a part ("member … is
  not a face of the icon"), nothing says so, and a loose copy draws without the Hairline outline → stray lines. Needs a kernel
  answer (let face copies join parts, or say "use facet") + a What-goes-wrong row.
- F6 (storefront): cut points are read off the PNG by eye; inspect prints corners but agents still guess. Consider a
  `--corner` helper or printing named edges.
- F7 (storefront): after a mount error look.mjs prints a wall of duplicates plus misleading "does --at land on the part?"
  warnings; --zoom PNG left stale from a previous run.
- Pattern: 3/3 agents chose their own concept; 0/3 are figures I'd put on the site. Engine side passed on all three views.
- F8 (toggle): the long axis of a right view can be v, not u; concepts.md says "knob slides along u". Say "along the track's
  long axis (u or v: check the parts picture)".
- F9 (toggle): look.mjs can't see a hole left where a part moved off a coplanar face; and look.md's twelve questions assume an
  effect (effect-less figures answer N/A to two of them).
- F10 (radio): when axes aren't measured the skill says "pass them yourself" but gives no method for an all-curves icon and
  never states their units (unit screen vectors, one stage unit per unit). Needs: units in the index; a method (the
  extrusion direction = the offset between a face and its back copy; the standard fallback is usually right for
  rounded-left); ideally inspect.mjs proposes the extrusion vector from the side band itself.
- F11 (radio): look.mjs passed a figure whose story doesn't visibly happen. Candidate check: pixel-diff rest vs answer
  inside the icon's box; near-zero change with a non-rest readout = FAIL.
- F12 (domain): find.mjs only matches ids/titles, which are Material icon names (domain, local-shipping, flight), so
  "building", "office", "truck", "plane" return nothing. Isocons ships no tags → add a hand-curated synonyms map to find.mjs.
- F13 (domain): face "facing" semantics (which way left/right/top point) undocumented; agent used the wrong slope first.
- F14 (star): inspect.mjs says "zero-size faces: leave them out of parts" — wrong for a moving part: the dots stay behind on
  the stage. Correct advice: put each in the part it sits on, never a part of their own.
- F15 (star, and credit-card F2): hover takes over the story, so a channel the story drives but the hand doesn't is absent
  from every answer/effect picture. Say it in SKILL step 3.4: "every channel the effect needs must be in live too".
- F16 (star): an effect texture can smother the drawing (fbm over the whole part). Rule 11 says "under the traces" but
  nothing measures it; candidate look check: lines still distinguishable inside the effect.

## Tally
Engine on the view: 7/8 (radio's axes could not be measured). Figures: 1 pass (domain), 1 plain (toggle), 4 weak, 2 fail.

## Fixed (this commit)
- F10 axes: an icon with one straight direction now gets that axis measured, only the other falls back (kernel +
  geometry.mjs, same algorithm). 5,497 measured views unchanged; 459 of 544 flagged views gain a real axis; radio v
  152° (true 153°; old fallback 150°, the agent's guess 161°). inspect says which axis; units documented.
- F5 face copies join parts (kernel). Old vs new kernel: 12 figures × 4 moments pixel-identical (rocket's hum excepted:
  it differs old-vs-old too).
- F11/F2 look.mjs FAILs an answer whose lines change < 0.12% of the stage from rest (effects off). Calibrated on 21:
  approved 0.17–4.3%, radio 0.08%.
- F7 look.mjs says a crash once ("every picture"), no misleading --at warnings after a crash.
- F12 find.mjs: 80 everyday words → Isocons ids, every target verified; says plainly what Isocons lacks.
- F1 SKILL step 2: with nobody to ask, write three, strike the weak ones, and plain beats decorated. look.md: no
  "partly"; last question "would you put this on the product's own site?".
- F3/F5/F14 What-goes-wrong rows; F15 live-channel rule in step 3.4; F14 inspect dots advice; F8 concepts slide axis;
  F13 facing + u/v units in step 1. F4 fixed earlier.
Regression: all 13 approved figures pass look.mjs on the new skill.

## Not fixed
- ~~F6, F16, F9~~ checked since 2026-10-06 (see the commit after `d526a20`): F16 → look.mjs FAILs an effect repainting >60% of the
  drawing; F9 → look.mjs warns of plate enclosed where rest was drawn (Colour style, traces hidden); F6 → `inspect.mjs --near x,y`
  prints exact points (a kernel near-miss warning was tried and dropped: approved cuts sit 0.7-1.9 units from corners too).
- Taste: the fixes make a weak concept less likely, not impossible. Re-run the two FAILs cold to confirm.

## Re-runs on the fixed skill (cold agents, new folders)
- radio-curve-v2: axis measured from the side band (no guess), answer changes 1.51% (was 0.08%); agent wrote three
  concepts, struck two, judged its own figure "not for a product site". Root cause of the first FAIL was concepts.md:
  it promised "a disc seats into a ring" and the icon has no disc (one ring, a hole). Fixed; SKILL step 2 now says
  build concepts from the parts picture, not the name. Mechanics PASS; figure dull because the icon has nothing to take
  apart — some icons have no good story, and the skill now says to offer a nearby one.
- storefront-sharp-v2: no face-copy stray lines, answer 1.52%, honest "no" on the last question. Still a seam at rest:
  a straight cut can't follow the scalloped awning. New look.mjs check: rest vs the untouched icon, extra lines marked
  red. Calibrated on 23 figures: 0 on 17; storefronts ~1,950; but also bolt 481, water 134, padlock 1,111, delete 1,256
  (legitimate seams / a rest trace) → a WARN with a red picture, not a FAIL: only the eye tells a real edge from a cut.
- kernel: face()/facet() `before` accepts a face index (agent hit "at.before is not a function").

## Cold run after the skill caught up (2026-10-06, `dogfood/cold-checkbox`)
checkbox-blank, fresh agent: found the opening from inspect's new line, learned the abilities from the kernel index +
radio.js, axes measured right, three concepts with honest strikes, judged its own figure "not for a product site".
Found a real kernel bug: icon.hole filled the freed opening, so a see-through window went opaque (invisible in line
style, where the face colour equals the plate). Fixed: the face is cut by a mask whose hole follows the opening part;
the opening is an unfilled outline; morph updates the cut too. Verified in colour style at rest, growing, mid-morph;
7 hole/morph figures + radio.js pass. Open: no recipe for a blank symbol (an empty box has nothing to do).
