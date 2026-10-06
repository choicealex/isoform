---
name: isoform-animate
description: Use when someone asks to animate an Isocons icon (isocons.app), make an animated isometric illustration for a site (a hero, a bento card, a feature), or runs /isoform-animate with an icon or an idea. Takes one of the 1,007 Isocons icons apart and makes it tell a short looping story of what the real object does, which hover can take over, and hands it over as a single self-contained HTML file.
argument-hint: "[icon or idea]"
---

# Isoform: animate an icon

You are making one figure: an Isocons icon, taken apart along its own edges, used as an illustration. It plays a short story of what the real object does, on its own, and when the pointer comes near, hover takes over and the object answers the hand. It is drawn in one hairline, the icon's faces plus traces for what happens (a water line, arcs, a flame's edge), and it is alive without moving much. A WebGL effect adds the material and the light of what happens (the body of the water, the light of the current, the heat of the flame): it is on by default, it is the one colour in the scene, and the figure still reads with it turned off. It ships as one HTML file with nothing to install. `examples/water-bottle.js`, `examples/bolt.js` and `examples/rocket.js` are the bar, in the format you will write.

You write one thing: the figure. The engine (`kernel.js`) and the page (`bench.html`) are fixed. Never edit them, never paste a changed copy, never rewrite what the kernel gives you.

Every file named below is in this skill's folder. Write the figure and the page in the person's working directory, and run the scripts from there by their path in this folder.

## 1. The icon

If the person named an icon, find its id: `node find.mjs <words>`. If they gave an idea, find two or three icons that could carry it. Then see what it is made of:

`node inspect.mjs <id> [variant]`

Isocons draws every icon six ways: three sides (`left`, `top`, `right`) and two edges (`rounded`, `sharp`). They are different drawings with different faces, so a figure is built for one of them, the `variant`. Ask which view the person wants (default `rounded-left`, Hairline's soft corners); for another view, make another figure. Isocons' views are not all one projection (a top view can have a level edge, a right view a steep one), so read the `axes` line `inspect.mjs` prints: if it says they were not measured, or they disagree with the corners, pass the two edge directions yourself, `icon(svg, src, { u, v })`. Wide views (most top views) are placed 300 wide instead of 220 tall. If inspect says a face has an **opening** (a screen's window, a ring's bore, a half-moon), the opening is an inner outline of that face, not a part: free it with `icon.hole(i)` before you move, grow or turn it. Measure where a part lies with `part.extent(plane)`; never read points off the picture by eye. `u` and `v` are unit screen directions: a move of 1 along `u` is one stage unit down-right. In the face list, `left` means the face looks toward the viewer's left (its long edges run down-right), `right` the other way, `top` up, `curved` a face of curves only.

It prints every face in paint order with which way it looks, its box and its corners, in stage units, and writes `isoform-<id>-parts.png`: the faces numbered and tinted over a grid in stage units. Look at that picture to tell which face is which and to read points off it; do not read the `.html` it is made from. Variants are `rounded-left` (use a rounded one: Hairline's soft corners), `rounded-top`, `rounded-right`, and `sharp-left`, `sharp-top`, `sharp-right`.

## 2. Concept

Read `concepts.md`. Build every concept from the parts picture, not from the icon's name: a name promises parts the drawing may not have. Then offer two or three concepts, one line each:

> **Name.** The object. Its story in beats (set up, act, hold, return). What hover does to it. What happens, as a trace and (optionally) an effect. Its job on a page. The poster frame.

Say any cut it needs. Wait for the person to pick. Skip this only when they arrived with the gesture and the effect chosen. If there is nobody to ask, still write the three, strike every one that fails **A weak concept** in `concepts.md` (an effect that would suit any icon, a glow on something that does not glow, a gesture the real object never makes, a story too small to see at 240px), and take the strongest left. If none survives with an effect, make it without one: a plain figure that reads beats a decorated one that does not. Say which you took, and why the others fell.

One figure, one idea. An effect that would suit any icon is not a concept yet.

## 3. Build

1. Read `rules.md`. The twelve rules are not advice: a figure that breaks one is not finished.
2. Read the index at the top of `kernel.js`, down to `var IF`. It lists everything you may call. Do not read the code under it.
3. Read the nearest example: `water-bottle.js` for a long story with several parts and an effect inside the object, `bolt.js` for a short one with a break and an effect in the gap, `rocket.js` for the whole object moving with an effect in the open, `radio.js` for an interface symbol with no physics (an opening freed with `hole`, a swell with `stretch`, a turn within the dial's plane with `turn`). All use `story` for the loop and hand it to the pointer the same way.
4. Write `<name>.js` in the shape of the examples: take what you need from `IF`; make the story with `story(stage, {rest, poster, beats, intro})`, with an `ink` channel (rest 1, intro from 0) passed to `icon.ink` so the illustration draws itself in the first time it is seen; in `tick`, step it and read `values(live)`; on pointer move `hold(true)` and drive the live channels with a `SPRING.hand` spring, on leave `hold(false)`; define `mount({ stage, svg, read, src }, value)` returning `{ set, destroy }`; end the file with `isoform({ name, icon, variant, means, effect, rules, range, mount })`.
   - `icon`, `variant`: the Isocons id and variant. `build.mjs` inlines that SVG.
   - `means`: one sentence, at most 140 characters, saying what the figure shows.
   - `effect`: one sentence naming the physical thing the effect adds under the traces. Leave it out if there is no effect.
   - Draw what happens with `trace` / `part.trace` first; the effect sits under those lines and only when `fx.on`.
   - The pointer takes over the story while it holds, so every channel the answer needs (the trace, the effect's strength) must be in `live` too, driven from the hand; a channel only the story moves is missing from every answering picture.
   - `rules`: the numbers of the rules it leans on most.
   - `range`: the one number the slider drives, at intensity 0, 0.5 and 1, moving one way. `mount`'s `value` and `set(value)` get this number. It is in whatever unit the figure uses it in (stage units of travel, a 0…1 share, arcs): `[2, 4, 7]` is fine.
5. Assemble: `node build.mjs <name>.js` writes `isoform-<name>.html`.

## 4. Check

1. `node look.mjs <name>.js --at x,y --edge x,y`, as `look.md` says. It validates, takes the pictures, and prints what failed. Fix every failure and run it again until it exits 0.
2. Read `look.md`, then the sheet, and answer its twelve questions. Fix what fails, then go back to 1.

Without a browser: `node validate.mjs isoform-<name>.html` after each build, and the look from the code as `look.md` says. Without Node: answer the checks at the top of `validate.mjs` from your code.

Do not hand over a page the validator rejects. Do not say the look is done if you did not look.

## 5. Hand over

Publish `isoform-<name>.html` as an artifact if you can; otherwise say where the file is. The page takes Isocons' and Overflow's looks without any change to the figure: `?style=line|plain|colour|glass|heavy|isocons`, `?stroke=` any width from 0.5 to 4 (granular, like Isocons' slider), `?fill=0` for Isocons' fill off; the page's Style row does the same live. Then, one line each:

- the metaphor: the object, what the pointer does, what the effect shows;
- the rules it leans on;
- anything you could not verify, plainly.

The page credits the icon to Isocons under CC BY 4.0. Keep that credit wherever the figure goes.

## 6. Adjust

For a change, edit only `<name>.js`, then run `look.mjs` again and read the new sheet. The tenth version is held to the same bar as the first.

## What goes wrong

| If you catch yourself | Do this instead |
| --- | --- |
| a part sliding off its own edges on a top or right view | the axes were mis-measured: check `inspect.mjs`'s `axes` line and pass `{ u, v }` to `icon` |
| a part that hides another it should sit in front of (a body painting over its own stripe) | a part paints where its LAST face was; `{paint: "first"}` when it should paint where its first face was, `after(near, far)` when it changes during the story |
| `part … : member … is not a face of the icon` for an `icon.face` copy | make the copy before the part and pass it in its faces; it then moves with the part |
| `look.mjs` warns of lines at rest, and the red picture shows your cut seam through a surface | the cut is not on an edge the object has (a straight cut under a scalloped awning): move the story to a part that comes away along a real edge, or choose another concept |
| moving or growing an inner shape (a window, a bore) and the face around it does not change | it is an opening in that face: `icon.hole(i)` first, then make a part of the opening (and its inner wall) |
| a solid that spins or stretches and its thickness swings or goes flat | `part.turn` / `part.stretch` are exact only for a flat face; make the part with `{solid: {front, depth}}` and use `part.spin` / `part.grow` |
| an outline that should become another Isocons drawing's | `icon.morph(face, points, {hide})`: place the other drawing's outline on this one first (as fractions of the same face, measured with `extent`) |
| the inspector warns of zero-size faces | put each in the part it sits on, so it moves with it; never a part of its own |
| two parts passing each other draw in the wrong order | a part paints at its last face's place; call `after(near, far)` the moment the nearer one starts to overlap, and again when they swap back (ABC's sort does this at each crossing) |
| moving a part and leaving an empty outline behind it, or `look.mjs` warns of a hole | draw what it hid: `icon.face(i, 0, 0, 0, part)` copies the face into its seat, `icon.facet` draws an exposed surface (rule 06) |
| `look.mjs` fails with "the effect repaints N% of the drawing" | the effect is a wash over the whole object: keep it to the part the phenomenon happens in (water in the bottle), or outside it (a flame under the rocket) |
| reading a cut point off the parts picture by eye, on a face with curves | `node inspect.mjs <id> [variant] --near x,y` prints the exact points and edges around it: cut through one of those |
| a part that takes half of a neighbour's face with it | cut the face first: `icon.cut(i, icon.pt(x, y), "u")` (rule 09) |
| reading corners off `inspect.mjs` and the cut lands in the wrong place | you placed the icon elsewhere: pass every point through `icon.pt` |
| `look.mjs` fails with `effect shader: … syntax error` | a GLSL reserved word used as a name (`out`, `in`, `input`, `output`, `sample`, `filter`, `active`): rename it |
| reaching for a glow, sparkle or particles | name what the real object does, and draw that (rule 11) |
| drawing the phenomenon only in the shader | trace it in hairline first; the effect adds material under the trace (rule 11) |
| mapping the pointer's height to a big move | answer nearness, a few units at the default (rule 03) |
| a read-out in percent | name the state: `rest`, `ignition`, `liftoff`, `arc ×2`, `tip +4°` |
| a trace worked out from speed (dust while it moves, a wake) | it never shows in a still, so not in the look or the poster: drive it from a story channel |
| a level in a container (water, fuel, a meter) | follow `water-bottle.js`: `part.trace({ clip: true })` keeps the line inside the part; it runs level in the world, along u on one face and v on the other, its height a channel |
| a figure that waits for the pointer | illustrations play on their own: a `story`; hover only takes over |
| a dashed line for a stream, dust or a guide | a solid line that draws on and retracts (`t.draw(lines)` with a head and tail), or nothing |
| a loop that jumps back to the start | the last beats return every channel to `rest` |
| a poster that is the rest pose | the poster is the most telling moment |
| giving the effect a colour of its own | palette uniforms; one physical colour only, with a comment (rule 12) |
| writing a timer or `requestAnimationFrame` | `register(stage, tick)`, with springs or tweens (rule 07) |
| testing the pointer against where a part is now | `icon.hit` or `part.rest` (rule 01) |
| turning a part by 30° | flat faces turned that far stop being a solid: move it, tilt under 15° (rule 09) |
| showing a turn about the part's own long axis (a key in a lock, a screw, a dial) | a screen tilt of even 10° bends every edge off its axis: keep the part square and tell the turn on what it turns, a mark sweeping round a rim |
| editing the kernel or the bench to make something work | the figure is wrong; change the figure |
| a figure that means nothing with effects off | the gesture carries the idea; the effect is its consequence (rule 11) |
| letting in a second idea | cut it |
