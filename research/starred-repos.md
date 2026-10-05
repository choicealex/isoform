# Starred-repo research for Isoform (motion quality + line polish)
Date 2026-10-05. 70 stars; 49 already triaged in `harvest-research/00-INDEX.md` (not redone). Deep-read clones were in session scratchpad (gone later). All licences below read from the actual LICENSE file (all MIT).

## Ranked techniques

1. **Sub-pixel-safe "draw-on" with normalised dash (pqoqubbw/icons, MIT, (c) pqoqubbw)**
   `icons/icons/bookmark-x.tsx` L31-42 + L104-112: `pathLength="1" strokeDasharray="1 1"`, variants `strokeDashoffset: [1,0]`, `ease:"easeOut"`, `duration .3`, `delay: i*0.1` via `custom={i}`. Rest state `strokeDashoffset:0, opacity:1`. 164/467 icons use pathLength drawing. Use for water line / arc / flame outline traces: normalise every trace with `pathLength=1` so one duration constant fits any path length; per-trace delay `i*0.1` (30-100ms for ours).
2. **Draw + opacity pre-roll (same repo, `check.tsx` L19-38, `activity.tsx` L19-39, `zap.tsx` L19-31)**
   Animate `opacity:[0,1]` with a SEPARATE fast `opacity:{duration:.1}` while `pathLength:[0,1]` runs 0.3-0.6s. Hides the round-linecap dot that shows at pathLength 0 (a real hairline artefact). `activity.tsx` adds `pathOffset:[1,0]` + `ease:"linear"` for a pulse/ECG that travels instead of grows; `flame.tsx` L25-31 delays draw by 0.1 and opacity by 0.1 (draw after the body moves). Rest/"normal" variant has a shorter duration (0.3-0.4) than the "animate" one (0.4-0.6) = in/out asymmetry baked in.
3. **Exit softer than enter, short travel, blur (Tsavsar/interface-polish `SKILL.md` L30-52; jakubkrehel/skills `skills/better-ui/SKILL.md` L30-48, `icon-transitions.md`) MIT**
   Exits: shorter distance, fade, ~4px blur, "don't mirror entrance"; `ease-out` both ways; stagger infrequent entrances in ~100ms semantic chunks, never high-frequency hover. Part appear/disappear: scale .25->1, opacity 0->1, blur 4px->0; spring `{duration:.3, bounce:0}` ("bounce always 0"); CSS fallback `cubic-bezier(.2,0,0,1)`. Maps to Isoform rule: entrance = traces draw (stagger ~100ms), exit = 0.6x distance/duration, no stagger.
4. **Interruptible hover = transitions not keyframes (both skill repos, interface-polish L40; better-ui L30-32)**
   CSS transitions reverse mid-flight; keyframes cannot. Isoform's springs/tween on pointer-nearness already interruptible; keep any one-shot flourish (overshoot) only on enter, hover-out always a plain retarget. Also `@media (hover:hover)` guard (interface-polish L114) and `prefers-reduced-motion` wrapper (L116: wrap in `no-preference`).
5. **Reduced-motion done properly (Avijit07x/animateicons `hooks/useIconLoop.ts` L2-20, MIT, (c) Avijit Dey)**
   `useReducedMotion()` gates the idle loop (`if (reduced) return;`). Finding: pqoqubbw/icons has NO reduced-motion handling in any of 467 files (grep 0) - do not copy that gap. Isoform rule: reduced = no idle micro-motion, no overshoot, keep end-states static; the pointer-driven displacement can stay but clamp amplitude.
6. **Hairline iso conventions (MrBongoC/ai-iso-skill `skills/iso-figure/SKILL.md` L54-62, L68-72, MIT, (c) Tolga Cohce)** - same visual family as Isoform.
   `vector-effect:non-scaling-stroke` is "not optional" - without it the iso matrix skews stroke widths and breaks the one-width hairline. Faces need opaque fill (painter-order occlusion), so a part that moves must keep its face fill. Press = `translateY(4px)` in screen space (straight down = -z in iso) over 60ms `ease-out`, stroke flashes to a "live" colour; label on part's TOP plane inside the same `<g>` so it travels with it. Paint order sort: smaller x+y first, lower z first (relevant when parts move across each other: re-sort or keep displacement within occlusion bounds). 60ms press vs our 700ms tween: use as the fast "tap" tier.
7. **Spring vocabulary actually used by a 467-icon set (pqoqubbw/icons, counted over `icons/*.tsx`)**
   `stiffness/damping`: 50/10 (x12, slow floaty), 250/25 (x8), 500/30 (x6, snappy no-overshoot), 200/20 (x4); 220/18, 100/15 once each. Isoform's k100 c18 sits in the soft/slightly-underdamped tier (zeta ~0.9 at mass 1); 250/25 (zeta .79) and 500/30 (zeta .67... still lightly under) are the "snap" references. Idle bell rotate: keyframes `[0,-10,10,-10,0]` over 0.5s easeInOut (`bell.tsx` L19-22,L75-78) = canonical micro-ring for idle.
8. **Idle loop cadence (animateicons `useIconLoop`)** first fire at 220ms, then `setInterval(intervalMs)`; imperative handle `startAnimation/stopAnimation` pattern (`bell.tsx` L11-14) lets a parent drive many icons from one pointer-nearness value. Isoform already has nearness; take the controlled-vs-self-driven flag (`isControlledRef`) idea.
9. **Not useful / skip:** oil-oil/oil-motion (MIT) = AI video/sprite scroll pipeline; its SKILL explicitly excludes SVG/CSS micro-interaction. greensock/gsap-skills already known (workspace has gsap-* skills). jakubkrehel/skills other skills (typography, colors) not motion.

Licence note: everything above MIT -> copying small snippets allowed with notice; constants/patterns need no attribution. Note animateicons has THIRD_PARTY_NOTICES.md (Lucide-derived paths) - paths not needed.

## From the earlier index (00-INDEX / doc 05) relevant to SVG/icon motion
- `pqoqubbw/icons`, `Avijit07x/animateicons`: inventory only (doc 05) - this note is first source read. Doc 05 verdict: keep `shared/hooks/use-icon-animation.ts`, cherry-pick per-icon motions.
- `Subhan-code/Amicro` (micro-transitions, MIT) and `starc007/ui-components` (`magnetic`, `tilt-card`, spring-tilt; MIT): already harvested into `shared/components/app-interactions/`; `snapToDevicePixel` note in `skills/web/animation-interaction.md` (relevant: hairlines blur while moving).
- react-bits / canvas-ui: Commons Clause, reference-only. nxui: unresolved licence, do not use.

## Triage table: NEW stars (not in 00-INDEX)
| Repo | Verdict |
|---|---|
| MrBongoC/ai-iso-skill | RELEVANT - hairline iso SVG conventions (#6) |
| Tsavsar/interface-polish | RELEVANT - motion timing rules (#3,#4) |
| oil-oil/oil-motion | Read, not applicable (AI video/scroll pipeline) |
| greensock/gsap-skills | Known; workspace already has gsap-* skills |
| NourMtir0722/Paperlab | Already ported to Morph (memory project_morph_paperlab); not SVG |
| samasante/liquid-glass | WebGL/DOM refraction lens; maybe for optional material layer, not line motion. Not read |
| openshaders/openshaders | Shader directory, optional WebGL layer reference. Not read |
| blazejkustra/react-native-effects | RN WebGPU effects, off-stack |
| rit3zh/expo-backdrop | RN blur, off-stack |
| dembsky/PropMotion | SwiftUI SceneKit, off-stack |
| Subhan-code/Amicro | Already in doc 05 (name mismatch in grep) |
| jakubkrehel/skills | RELEVANT (#3) - better-ui motion values |
| eugenemindset/water, smontlouis/bible-strong-avatar-lab, ComfyUI-PascalEditor, pascalorg/editor | Not relevant (water sim demo is gyroscope fluid, 3D/off-topic) |
| opencoredev/social-sdk, public-apis, strix, MiniMax-Music3, Wan2.2, OpenMausBot, Qwen-MM-Plugins, mcp-for-blender | Out of scope (infra/models) |
Note: pqoqubbw/icons, animateicons, jakubkrehel/skills, Amicro were in doc 05 / stars but not deep-read until now.

## Recommendation
Adopt #1+#2 (normalised pathLength=1 dash, opacity pre-roll to kill the linecap dot, delay=i*0.1) into the trace kernel; #3 for exit asymmetry rule (exit ~0.6x enter, no stagger, ease-out); #5 reduced-motion gate; #6 non-scaling-stroke as a lint check.
