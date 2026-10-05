# The twelve rules

An Isoform figure is an Isocons icon taken apart and made to answer the pointer, with, when it earns one, an effect showing what the real object would do. Each rule says what it means, how the kernel keeps it, and what gets a figure sent back.

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

- **Keep it:** `clamp` every lift, gap and tilt; place the icon (`icon(svg, src, {cx, cy, h})`) so the most extreme pose, and the effect's extent, fit the 400 × 320 stage at intensity 1.
- **Sent back when:** at intensity 1 a part or the effect leaves the frame or a part passes through another.

## 04 · accent: the stroke is the only highlight

On the drawing, emphasis is the stroke changing from the line colour to the bright one, nothing else. One place is bright at a time.

- **Keep it:** `part.hi(on)` and `part.dim(on)` are the whole palette. At rest one part is bright, where the eye should start; when the pointer chooses, the bright moves to what it chose.
- **Sent back when:** the figure sets a colour, fill, opacity, filter or stroke width on the drawing; two unrelated places are bright at once.

## 05 · rest: the icon, as drawn

At rest the figure is the Isocons icon, recognisable at a glance, with one bright mark. Rest is the thumbnail and the first thing anyone sees.

- **Keep it:** every part's rest offset is zero unless the concept needs a resting pose (a door ajar); seams from cuts follow edges the object really has (a cap's rim, a lid's line).
- **Sent back when:** at rest the icon is broken, offset or hard to recognise; rest and "not drawn yet" look alike.

## 06 · honesty: no holes, no lies

When a part moves it reveals what was behind it, and that has to be drawn: the neck under a cap, the broken surface of a cut. Nothing shows through a face that should hide it.

- **Keep it:** `icon.face(i, a, b, c, before)` copies a face to where the hidden surface is; `icon.facet(points, before)` draws a new one from corners on the icon's axes. Faces paint back to front: a part paints where its last face did, unless `{paint: "first"}`. Anything added that runs between two places, a pipe, a cable, a wire, has both ends anchored on a face and keeps its width.
- **Sent back when:** a moving part leaves an empty outline or a see-through gap; a far edge crosses a near face; an added line floats free or crosses another.

## 07 · cost: sleep when still

Motion happens only in the one shared loop, and only while something moves or an effect is alive.

- **Keep it:** all motion inside `register(stage, tick)`; `tick` returns `true` only while a spring or tween is moving or the effect is running; call `wake()` after input. The loop sleeps offscreen and lands everything at once under reduced motion.
- **Sent back when:** the figure has a timer, `requestAnimationFrame`, CSS or SMIL animation of its own; `tick` returns `true` at rest.

## 08 · clock: two clocks, and physics when it is physical

A discrete choice gets a 700ms ease-out on `(.32, .72, 0, 1)`; a continuous input gets a spring, `k 100 · c 18 · m 1`. A spring with other constants is allowed only for a material that really behaves that way (water rings: underdamped), said in a comment.

- **Keep it:** `tween` / `tset` / `tval` for which; `spring` / `stepS` for where.
- **Sent back when:** a tween chases the pointer; a spring animates a choice; constants are changed without a physical reason; anything is linear.

## 09 · faces: move them, never redraw them

The faces are Isocons' drawing, and they stay Isocons' drawing. A figure groups them, moves them along the icon's own axes, and cuts them only along those axes.

- **Keep it:** `part.move(a, b, c)` moves along `u`, `v` and up as `IF.icon` measured them; `icon.cut(i, point, axis)` with axis `"u"`, `"v"` or `"up"`; `part.tilt` stays under 15°, because a flat drawing turned further stops being a solid.
- **Sent back when:** the figure edits a face's path, draws a face freehand off the axes, scales a part, or turns one far enough to read as a flat shape.

## 10 · quiet: no words in the drawing

Identity is geometry. Names go to the read-out in the corner, in a few characters (`open 40%`, `gap 18`), and it says `rest` at rest.

- **Keep it:** write `read.textContent` and nothing else that holds text.
- **Sent back when:** the stage holds text, digits, arrows or logos; the read-out is a sentence.

## 11 · physics: the effect is what the object does

The effect shows what this object would do if it were real and you did this to it: water sloshes, a rocket burns, current arcs across a gap, a kettle steams, a bulb heats. It is never a generic glow, sparkle, confetti, or particles that could sit on any icon.

- **Keep it:** declare the effect in one plain sentence (`effect:` in the declaration) naming the physical thing. The effect starts and stops with the gesture or with the state it belongs to, and is drawn where it would really be: under the faces for what happens in the open (`layer: "under"`), masked to the parts it fills for what happens inside (`layer: "over"`, `mask([parts])`). The figure still works and still makes sense with effects off (`fx.on` false).
- **Sent back when:** the effect would make as much sense on a different icon; it is decoration rather than consequence; it runs at rest without the object being in a running state; the figure breaks or means nothing with effects off.

## 12 · palette: the effect borrows the icon's colours

The effect is drawn in the palette's colours (`u_line`, `u_hi`, `u_face`, `u_plate`), so it sits in both themes. The single exception is the one colour the phenomenon really has, flame, ember, molten metal, named in a comment where it is used.

- **Keep it:** mix from the palette uniforms; check both themes; on a white plate a white core reads as a hole, so it keeps some of its colour (`u_dark`).
- **Sent back when:** the effect carries colours of its own beyond that one; it vanishes or glares in one theme.

## The frame

Not a rule, but every figure shares it.

- The stage is 400 × 320. Place the icon with `icon(svg, src, {cx, cy, h})`; the default (200, 166, 220) is where `inspect.mjs` measures, so points read off it pass through `icon.pt` when you place it elsewhere.
- The silhouette must read at 240px wide.
- `mount` keeps no state outside itself; `destroy` leaves the svg empty, the effect disposed and nothing running.
- At most 180 lines. A longer figure is usually two ideas.
- The Isocons credit is on the bench and stays there: the icons are CC BY 4.0.
