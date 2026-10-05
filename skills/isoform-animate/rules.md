# The twelve rules

An Isoform figure is an Isocons icon taken apart and made to answer the pointer, the way the real object would. It is drawn in one hairline: the icon's faces, and traces for what happens (a water line, an arc, a flame's edge). A WebGL effect adds the material and the light of what happens, water, light, heat: it is on by default, it is the one colour in the scene, and the figure still reads with it off.

Isocons are used as **illustrations**: in a hero, a bento card, beside a feature. So a figure tells its story on its own, a short loop of beats (set up, act, hold, return, pause), the way a product illustration explains a feature without anyone touching it. The pointer is a bonus: hover takes over and the figure answers the hand; let go and the story carries on from where it stopped. Under reduced motion it shows one poster frame, the most telling moment.

The drawing is ink with one accent: neutral lines, and the part that acts (and its traces) in the accent, Isocons' blue by default (`--iso-hi`, any brand colour).

Above all twelve: **alive without moving much.** The answer is a few units, not a leap; it settles into a designed rest; the reader notices late that the figure has been listening. Each rule says what it means, how the kernel keeps it, and what gets a figure sent back.

## 01 · hit: test the rest shape

The pointer is tested against where the parts are at rest, never where they are drawn now. A part that lifts away from the pointer would otherwise lose the hover, fall back under it, and lift again: a flicker that never settles.

- **Keep it:** `icon.hit(point)` tests the rest shape of every part. `part.rest` is a box measured once at mount. A grip that reaches past the icon (to keep hold of a cap you are lifting) is a box built from `rest` values and the slider's reach, never from anything measured on screen. Read a spring's target `.t` when a choice depends on it, not its position `.x`.
- **Sent back when:** holding the pointer still makes the figure oscillate; the figure calls `getBoundingClientRect`, `elementFromPoint`, `:hover`, or adds listeners of its own instead of `pointer()`.

## 02 · order: spread from the pointer

When several parts answer, the one nearest the pointer moves first and the rest follow by distance: `delay = |i − a| × step`, with a step of 30–60ms.

- **Keep it:** `tset(tween, to, now, Math.abs(i - a) * step)`.
- **Sent back when:** parts move in index order whatever was touched, or a step so long the gesture reads as a queue.

## 03 · reach: the answer has an end

Every movement is clamped, and at the slider's far end the figure is still a composition inside the frame. That includes the effect.

- **Keep it:** `clamp` every lift, gap and tilt; place the icon (`icon(svg, src, {cx, cy, h})`) so the most extreme pose, and the effect's extent, fit the 400 × 320 stage at intensity 1. At the default intensity, keep moves to a few units (a lift of 6–14, a tilt of 3–6°); the slider's far end is where the big answer lives. Prefer nearness to a part's rest position (`1 - smooth(near, far, distance)`) over mapping the pointer's x or y to a value: the object answers the hand coming close, it is not a slider.
- **Sent back when:** at intensity 1 a part or the effect leaves the frame or a part passes through another; at the default the figure leaps; the gesture reads as a control ("raise the pointer to…") instead of an answer.

## 04 · accent: the stroke is the only highlight

The bright part is also what the fill styles fill (Plain in ink, Colour in the accent, Glass see-through), so at rest it must be the part that matters; a figure whose `hi` part is a detail looks wrong in every style but Line.

On the drawing, emphasis is the stroke changing from the line colour to the bright one, nothing else. One place is bright at a time.

- **Keep it:** `part.hi(on)` and `part.dim(on)` are the whole palette; a trace takes `tone: "hi"` when it is what answers. At rest one part is bright, where the eye should start; when the pointer chooses, the bright moves to what it chose (a water line, an arc).
- **Sent back when:** the figure sets a colour, fill, opacity, filter or stroke width on the drawing; two unrelated places are bright at once.

## 05 · rest: the icon, as drawn; the poster, as told

The story's first frame is the Isocons icon, recognisable at a glance, with one bright mark, and every loop comes back to it. The poster (reduced motion, and the still a reader sees first if motion is off) is the story's most telling moment: mid-pour, mid-arc, just after liftoff, never the rest pose.

- **Keep it:** every channel's `rest` gives the icon as drawn; `poster` names the telling moment; seams from cuts follow edges the object really has (a cap's rim, a lid's line).
- **Sent back when:** at rest the icon is broken, offset or hard to recognise; the poster is the rest pose; the loop ends somewhere other than rest (it would jump).

## 06 · honesty: no holes, no lies

When a part moves it reveals what was behind it, and that has to be drawn: the neck under a cap, the broken surface of a cut. Nothing shows through a face that should hide it.

- **Keep it:** `icon.face(i, a, b, c, before)` copies a face to where the hidden surface is; `icon.facet(points, before)` draws a new one from corners on the icon's axes. Faces paint back to front: a part paints where its last face did, unless `{paint: "first"}`. Anything added that runs between two places, a pipe, a cable, a wire, has both ends anchored on a face and keeps its width.
- **Sent back when:** a moving part leaves an empty outline or a see-through gap; a far edge crosses a near face; an added line floats free or crosses another.

## 07 · cost: sleep when unseen

Motion happens only in the one shared loop. A story is ambient, so it runs while the figure is on screen and sleeps off it; anything else runs only while it moves.

- **Keep it:** all motion inside `register(stage, tick)`; `tick` returns `true` only while a spring or tween is moving or the effect is running; call `wake()` after input. The loop sleeps offscreen and lands everything at once under reduced motion.
- **Sent back when:** the figure has a timer, `requestAnimationFrame`, CSS or SMIL animation of its own; `tick` returns `true` at rest.

## 08 · clock: a story's pace, the hand's spring, physics when it is physical

A story moves on beats eased in-out (`(.65, 0, .35, 1)`), 300ms–2s each, a whole loop 4–9s; a snap or a press is a short `out` beat that overshoots a hair and settles (`[-0.05, 0]`). The hand gets a spring (`SPRING.hand`, 100/18); a small gesture settles without overshoot (`SPRING.settle`, 200/25); only the one part that carries the meaning may bounce (`SPRING.hero`, 400/10). A spring with other constants is allowed only for a material that really behaves that way (water rings: underdamped), said in a comment. Returning is softer than arriving: shorter, no overshoot.

- **Keep it:** `tween` / `tset` / `tval` for which; `spring` / `stepS` for where.
- **Sent back when:** a tween chases the pointer; a spring animates a choice; constants are changed without a physical reason; anything is linear.

## 09 · faces: move them, never redraw them

The faces are Isocons' drawing, and they stay Isocons' drawing. A figure groups them, moves them along the icon's own axes, and cuts them only along those axes. The kernel draws every part Hairline's way, a bright silhouette and lighter inner edges, so nothing reads first by accident; the inner edges stay clearly drawn, as in the Isocons set, a step down from the outline and never close to the ground; use the `rounded-*` variants, which round every corner.

- **Keep it:** `part.move(a, b, c)` moves along `u`, `v` and up as `IF.icon` measured them; `icon.cut(i, point, axis)` with axis `"u"`, `"v"` or `"up"`; `part.tilt` stays under 15°, because a flat drawing turned further stops being a solid.
- **Sent back when:** the figure edits a face's path, draws a face freehand off the axes, scales a part, or turns one far enough to read as a flat shape.

## 10 · quiet: no words in the drawing

Identity is geometry. Names go to the read-out in the corner, in a few characters (`open 40%`, `gap 18`), and it says `rest` at rest.

- **Keep it:** write `read.textContent` and nothing else that holds text.
- **Sent back when:** the stage holds text, digits, arrows or logos; the read-out is a sentence.

## 11 · physics: draw what the object does, in line first

What happens shows what this object would do if it were real and you did this to it: water sloshes, a rocket burns, current arcs across a gap, a kettle steams. It is never a generic glow, sparkle, confetti, or particles that could sit on any icon.

It is drawn twice, and the two look alike. First, always, as **traces** in the figure's hairline: the water's surface, the arcs, the flame's edge. Anything added to the drawing (a stream, a spark, a wire) is a solid line that **draws on** along its length and retracts after it, the same way the illustration draws itself in (`icon.ink`). Never dashed lines: they read as construction guides, not as the thing. Then as a **WebGL effect**, on by default, that adds the material and its light: the body of the water, the light of the current, the heat of the flame. Make it count (the bar is Ryan's compilation, `research/ryan-webgl.md`): **the effect is the only saturated colour in the scene**, the drawing stays pale; it is **emissive**, a hot core and a soft halo that spills past the lines; it lives **inside the part** where the material is (`layer: "over"` + `fx.mask`: water in the bottle, fuel in the glass, glow in the lamp) as often as outside it; it **moves like the material** (fbm turbulence for flame, flicker for an arc, a level for a liquid); and it **rises and falls with the story** (drive its strength from a story channel). The effect never draws its own edges and never replaces a trace.

- **Keep it:** `trace(svg, …)` or `part.trace({clip: true})` for the line, driven by the same numbers as the effect; `gl(stage, …)` for the material, which returns `on: false` unless the reader asked. Declare the effect in one sentence (`effect:`) naming the physical thing. It starts and stops with the gesture or the state it belongs to: under the faces for the open (`layer: "under"`), masked inside parts for what fills them (`layer: "over"`, `mask([parts])`).
- **Sent back when:** an addition is drawn dashed; the phenomenon exists only in the effect (no trace); the effect draws edges the traces should; with the effect off the figure no longer says what happens; the effect is timid (a faint wash nobody would notice) or decorative (a glow or sparkle that would make as much sense on another icon); it runs at rest without the object being in a running state.

## 12 · palette: the effect borrows the icon's colours

The effect is drawn in the palette's colours (`u_line`, `u_hi`, `u_face`, `u_plate`), so it sits in both themes. The single exception is the one colour the phenomenon really has, flame, ember, molten metal, named in a comment where it is used.

- **Keep it:** mix from the palette uniforms; check both themes; on a white plate a white core reads as a hole, so it keeps some of its colour (`u_dark`). Light is never the palette's highlight: `u_hi` is near black on a white plate, and a glow in it reads as soot; give light its physical colour (an arc's blue-white, a flame's orange).
- **Sent back when:** the effect carries colours of its own beyond that one; it vanishes or glares in one theme.

## The frame

Not a rule, but every figure shares it.

- The stage is 400 × 320. Place the icon with `icon(svg, src, {cx, cy, h})`; the default (200, 166, 220) is where `inspect.mjs` measures, so points read off it pass through `icon.pt` when you place it elsewhere.
- The silhouette must read at 240px wide.
- `mount` keeps no state outside itself; `destroy` leaves the svg empty, the effect disposed and nothing running.
- At most 180 lines. A longer figure is usually two ideas.
- The Isocons credit is on the bench and stays there: the icons are CC BY 4.0.
