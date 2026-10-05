# heroicons-animated: motion vocabulary study

Source: https://www.heroicons-animated.com/ -> repo https://github.com/Aniket-508/heroicons-animated (cloned shallow, read from disk). Studied `packages/react/src/icons/*.tsx` (317 icons).

## Licence (verbatim from /LICENSE)
MIT License, "Copyright (c) 2026 Aniket Pawar". Standard MIT grant (use, copy, modify, merge, publish, distribute, sublicense, sell) conditional on keeping the copyright + permission notice in copies or substantial portions; provided "AS IS". The underlying Heroicons paths are separately MIT (Tailwind Labs). README links to LICENSE as MIT. Safe to borrow motion numbers; if code is copied verbatim, keep the notice. Recreating the numbers (plain facts about easing/timing) is trivially safe.

## Architecture (identical in every icon, 317 times)
- Library: `motion/react` (Motion, ex-framer-motion). Ports exist for Vue (motion-v), Solid (solid-motionone), Svelte/Angular/Astro, RN, Flutter. No CSS keyframes.
- Each icon = `<div onMouseEnter onMouseLeave>` wrapping `<svg viewBox="0 0 24 24" strokeWidth=1.5 round caps/joins>`; the motion target is either `motion.svg` (whole-icon transform) or individual `motion.path`s (parts).
- Two named variants only: `normal` (rest) and `animate`. Driven by `const controls = useAnimation()`; `<motion.x animate={controls} initial="normal" variants={...}/>`.
- Imperative handle via `forwardRef` + `useImperativeHandle`: `{ startAnimation: () => controls.start("animate"), stopAnimation: () => controls.start("normal") }`.
- Controlled-mode trick: calling `useImperativeHandle` sets `isControlledRef.current = true`; after that the icon's own hover handlers only forward `onMouseEnter/Leave` to the parent and do NOT start animation. So parent (button/menu row) owns hover and calls `ref.current.startAnimation()`. Uncontrolled default: hover on the icon's own div.
- Per-part staggering uses variant functions with `custom`: `animate: (custom:number)=>({... delay: custom*0.15})`. Multiple controls for independent parts (cursor-arrow-rays uses `cursorControls` + `rayControls`).
- Reduced motion: NOT handled anywhere (grep for reduced-motion/useReducedMotion across repo = 0 hits). We must add it ourselves (`useReducedMotion()` -> skip transform variants, keep only opacity/colour).
- Rest/return: `animate` -> `controls.start("normal")` on leave. Return uses the `normal` variant's own transition if given, otherwise Motion defaults (spring for transform, 0.3s tween for opacity). Keyframe arrays start and end at the rest value so mid-leave interrupts glide back from the current value. Many icons never define a reverse transition: leave just springs/tween home.
- No repeat loops on hover (only 17/317 files use `repeat`, mostly wifi/pulse-like). Everything is a one-shot, ~0.3-0.6s, that settles at rest.

## Aggregate numbers (counted across all 317 files)
- Durations most used: 0.4 (111x), 0.5 (101x), 0.3 (75x), 0.1 (65x, opacity snaps), 0.6 (53x), 0.2 (48x), 0.8, 0.45, 1.
- Ease: "easeInOut" ~190x, "easeOut" ~68x, "linear" 24x (only for pathLength draw), custom cubic [0.4,0,0.2,1] on clock.
- Springs: 52 uses. Stiffness 200 (26x), 260 (8), 400 (7), 250 (4), 500, 100, 50. Damping 25 (23x), 20, 10, 13, 15. Heavy use of stiffness 200 / damping 25 for tiny part nudges (critically-damped-ish: no overshoot).
- Dominant technique: keyframe arrays with easeInOut over 0.4-0.6s (wiggle/pop), springs for single-target moves (rotate 180, translateY nudges).
- pathLength appears in 74 icons (170 mentions). Staggered `custom` in 32 icons. transformOrigin used rarely: "center" 8, "center center" 4, "12px 12px" 4, plus bespoke pivots ("top right", "6.75px 14.25px", "12px 12.75px"); clock/hand-thumb use `originX:"50%", originY:"50%"`.
- Rest style stroke: strokeWidth 1.5 on a 24 viewBox, `stroke=currentColor`, round caps/joins, fill none.

## Catalogue (exact values)
| Icon | Target | Motion |
|---|---|---|
| bell | whole path | `rotate:[0,-10,10,-10,0]`, no transition given -> Motion default tween over keyframes (~0.3s) |
| beaker | svg | `rotate:[0,6,-6,3,-3,0]` dur 0.8; scale 0.9 via spring `{bounce:0.4, stiffness:150, damping:10}` dur 0.3; origin center (decaying wobble + squash) |
| envelope | svg | `rotate:[0,-5,5,-3,3,0]` 0.5s easeInOut (decaying shake) |
| heart | svg | `scale:[1,1.08,1]` (default timing) |
| star | svg | `scale:[1,0.9,1.2,1]` 0.6s easeInOut (anticipation dip then overshoot) |
| home | svg | `scale:[1,1.1,1]`, `y:[0,-1,0]` 0.4s easeOut |
| chat-bubble-left | svg | `rotate:[0,-7,7,0]` 0.5s easeInOut; `scale:1.05` spring stiffness 400 damping 10 (bouncy hold) |
| hand-thumb-up | svg | `rotate:[0,-10,5,0]` 0.6s easeInOut, origin 50%/50% |
| fire | flame | `rotate:[0,-3,3,-2,2,0]`, `scaleX:[1,0.95,1.05,0.98,1]` 0.5s easeInOut |
| lock-closed | svg + shackle | svg `rotate:[-3,2,-2,1,0]`, `scale:[1,1.02,0.98,1]` 0.5s; shackle `y:[0,-1,0]` 0.3s easeInOut |
| lock-open | svg + shackle | svg `scale:[1,1.05,1]` 0.4s; shackle `y:[0,-1.25,0]` 0.4s easeOut |
| cog-6-tooth | svg | `rotate:180` spring `{stiffness:50, damping:10}` (slow loose spin w/ overshoot); rest `rotate:0` |
| plus | svg | `rotate:180` spring `{stiffness:100, damping:15}` |
| arrow-path / arrow-path-rounded-square | svg | arrow-path `rotate:50`, rounded-square `rotate:180`, both spring `{stiffness:250, damping:25}` (crisp, no overshoot) |
| clock | hand path | `rotate:360` tween 0.6s ease `[0.4,0,0.2,1]`, origin 50%/50% |
| trash | lid + body | lid `translateY:-1.5`, body `translateY:1`; both spring `{duration:0.2, stiffness:200, damping:25}`, same spring on `normal` (symmetric in/out, parts move opposite = "opening") |
| magnifying-glass / cursor-arrow-rays | glass/cursor | `x:[0,0,-3,0]`, `y:[0,-4,0,0]` dur 1 (L-shaped hop path: up then left then home; `bounce:0.3` is ignored since it is a tween) |
| cursor-arrow-rays rays | 4-6 rays | `custom:{x,y}` per ray; `opacity:[0,1,0,0,0,0,1]`, `x:[0,cx,0,0]`, `y:[0,cy,0,0]`; spring `{stiffness:70, damping:10, mass:0.4}` (rays fly outward and return with flicker) |
| arrow-down-tray | arrow | `translateY:[0,2,0]` 0.5s `times:[0,0.4,1]` (fast down, slow return) |
| microphone | capsule | `y:[0,-3,0,-2,0]` 0.6s easeInOut (decaying bounce) |
| paper-airplane | svg | `scale:[1,0.8,1,1,1]`, `x:[0,"-10%","125%","-150%",0]`, dur 1.2 easeInOut, `times:[0,0.25,0.5,0.5,1]` (fly off right, teleport in from left via duplicate time 0.5, slide home) |
| bolt | path | draw-on: `opacity:[0,1]`, `pathLength:[0,1]`, `pathOffset:[1,0]` dur 0.6 **linear**, opacity dur 0.1; normal: `pathLength:1,pathOffset:0` 0.4 |
| check-circle | path | `pathLength:[0,1]`, `opacity:[0,1]` 0.4s easeInOut; normal tween 0.3 back to 1/1 |
| sparkles | 3 paths | `custom` idx: `opacity:[1,0.3,1,0.3,1]`, `scale:[1,1.2,1,1.1,1]`, 1.5s, `times:[0,.2,.4,.6,1]`, `delay: idx*0.15` easeInOut (twinkle stagger) |
| bars-3 | 3 lines | `scaleX:[1,0.6,1]` 0.3s easeInOut, delays 0 / 0.1 / 0.2 (cascade) |
| light-bulb | bulb fill | `fillOpacity:[0,1,0,1,0]` 0.6s, `times:[0,.25,.5,.75,1]` (flicker on a normally unfilled shape) |
| battery-100 | clipPath rect | `width:0 -> 13.5` 0.5s easeOut (fill sweep via animated clip rect) |
| wifi | 3 arcs | `custom` 1..3: `opacity:0, scale:0` with `repeat:1, repeatType:"reverse", repeatDelay:0.2, delay:0.2*(custom-1)`, dur 0.2 easeInOut (arcs wink out and back in, bottom-up) |

## What makes it feel good (specific)
1. Rest = original static heroicon, zero visual change at rest; motion is one-shot and ends exactly at rest (keyframes start/end at rest value).
2. Tiny amplitudes: translate 1-4 units on a 24 grid (1-1.5 for lids/shackles), rotate 3-10 deg for wiggles, scale 1.02-1.2. Never big.
3. Decaying keyframe wiggles (`[0,-10,10,-10,0]`, `[0,6,-6,3,-3,0]`, `[-3,2,-2,1,0]`): amplitude shrinks each swing = pseudo spring without a spring.
4. Anticipation + overshoot in scale arrays (`[1,0.9,1.2,1]` on star; lock `[1,1.02,0.98,1]`).
5. Whole-icon vs part split: the container does a small gesture while one part (shackle, lid, ray) does the readable semantic move with its own timing (0.3 vs 0.5).
6. Opposed part motion (trash lid -1.5 / body +1) reads as opening using ~2.5 units total.
7. Spring choice maps to personality: stiff+damped (250/25, 200/25) = mechanical/crisp; soft+underdamped (50/10, 70/10 mass 0.4, 400/10) = playful.
8. Draw-ons are linear with a 0.1s opacity snap; everything else easeInOut/easeOut.
9. Cascades: delay 0.1 per element for lines, 0.15 for sparkles, 0.2 for wifi arcs.
10. Interrupt-safety: variant keyframes re-target from current value on leave.

## Ranked patterns for Isoform (isometric SVG faces, hairline strokes, spring-driven, pointer/hover)
Note: our units are isometric px/grid units; scale "units" by our face size (their 24-grid, 1.5 stroke; ratio about 1 unit = 1/16 icon width).
1. **Symmetric spring nudge for part lifts** (trash lid/body): `type:"spring", stiffness:200, damping:25`, same spring on in and out, offsets +-1 to 1.5 units along the part's iso axis; counter-moving neighbour part 1 unit. Best default for "parts move a few units on springs"; no overshoot keeps hairlines clean.
2. **Lift with overshoot** (chat-bubble / cursor rays flavour): `stiffness:400, damping:10` (about 1 oscillation) or `stiffness:70, damping:10, mass:0.4` for loose float. Use for the "hero" part only.
3. **Decaying wiggle keyframes** (bell/envelope/beaker): `rotate:[0,-10,10,-10,0]` or `[0,-5,5,-3,3,0]`, 0.5s easeInOut; pivot at hinge via explicit `transformOrigin` px (they use bespoke px origins like "6.75px 14.25px"). For iso: rotate in the face's own plane, i.e. apply the rotate inside the face's affine transform group, not on the outer svg.
4. **Draw-on traces** (bolt/check-circle): `pathLength:[0,1], opacity:[0,1]`, 0.4-0.6s, ease linear for long traces, easeInOut for short; opacity dur 0.1. With hairline strokes this reads brilliantly; give rest `pathLength:1`. Add `pathOffset:[1,0]` for a sweeping direction.
5. **Staggered cascade via `custom`** (bars-3, sparkles, wifi): delay = idx*0.1 (lines), 0.15 (twinkle); one shared variant function. Use for stacked iso layers (bottom to top).
6. **Anticipation scale pop** (star): `scale:[1,0.9,1.2,1]` 0.6s easeInOut; or subtle `[1,1.05,1]` 0.4s for whole-object acknowledgement when pointer arrives.
7. **Kick-and-settle translate** (arrow-down-tray): `[0,2,0]`, `times:[0,0.4,1]`, 0.5s: fast out, slow back. Maps to a press/tap response.
8. **Fill flicker on an unfilled face** (light-bulb): `fillOpacity:[0,1,0,1,0]` 0.6s with even `times`; lets a face glow without changing stroke. Keep fill at rest 0.
9. **Clip-rect sweep** (battery): animate width of a clipPath rect 0 -> N, 0.5s easeOut; good for progress/liquid inside iso faces.
10. **Controlled handle architecture**: copy `normal/animate` variants + `startAnimation/stopAnimation` + isControlled flag. For pointer-nearness, replace boolean with a continuous motion value (`useSpring` on proximity 0..1, `useTransform` to offsets) instead of discrete variants; proximity 0 = rest, so "return to rest" is automatic.

## Gaps to fill ourselves
- Reduced motion (not implemented upstream): gate transforms behind `useReducedMotion()`, keep opacity/stroke-colour only.
- No continuous/pointer-distance driving upstream (discrete hover only).
- No transform-box handling: SVG transforms in Motion use CSS transform; set `style={{transformBox:"fill-box", transformOrigin:"center"}}` for per-part pivots (upstream used px origins, which breaks when the svg is rescaled).
