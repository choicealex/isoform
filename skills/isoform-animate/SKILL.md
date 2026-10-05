---
name: isoform-animate
description: Use when someone asks to animate an Isocons icon (isocons.app), make an isometric icon react to the pointer, or runs /isoform-animate with an icon or an idea. Takes one of the 1,007 Isocons icons apart into parts that answer the pointer, adds an effect showing what the real object would physically do, and hands it over as a single self-contained HTML file.
argument-hint: "[icon or idea]"
---

# Isoform: animate an icon

You are making one figure: an Isocons icon, taken apart along its own edges, that answers the pointer the way the real object would. It is drawn in one hairline, the icon's faces plus traces for what happens (a water line, arcs, a flame's edge), and it is alive without moving much. A WebGL effect may add the material under those lines (the body of water, the light of the current, the heat of the flame) when the reader turns it on; it is off by default, and the figure looks the same either way. It ships as one HTML file with nothing to install. `examples/water-bottle.js`, `examples/bolt.js` and `examples/rocket.js` are the bar, in the format you will write.

You write one thing: the figure. The engine (`kernel.js`) and the page (`bench.html`) are fixed. Never edit them, never paste a changed copy, never rewrite what the kernel gives you.

Every file named below is in this skill's folder. Write the figure and the page in the person's working directory, and run the scripts from there by their path in this folder.

## 1. The icon

If the person named an icon, find its id: `node find.mjs <words>`. If they gave an idea, find two or three icons that could carry it. Then see what it is made of:

`node inspect.mjs <id> [variant]`

It prints every face in paint order with which way it looks, its box and its corners, in stage units, and writes `isoform-<id>-parts.html` with the faces numbered. Variants are `rounded-left` (use a rounded one: Hairline's soft corners), `rounded-top`, `rounded-right`, and `sharp-left`, `sharp-top`, `sharp-right`.

## 2. Concept

Read `concepts.md`. Then offer two or three concepts, one line each:

> **Name.** The object. What the pointer coming near does to it. What the real object does in answer, as a trace and (optionally) an effect. What it means inside a product. What the read-out says.

Say any cut it needs. Wait for the person to pick. Skip this only when they arrived with the gesture and the effect chosen; if there is nobody to ask, take the concept whose effect is most physical and say which you took.

One figure, one idea. An effect that would suit any icon is not a concept yet.

## 3. Build

1. Read `rules.md`. The twelve rules are not advice: a figure that breaks one is not finished.
2. Read the index at the top of `kernel.js`, down to `var IF`. It lists everything you may call. Do not read the code under it.
3. Read the nearest example: `water-bottle.js` for a part that comes away and an effect inside the object, `bolt.js` for a break with an effect in the gap, `rocket.js` for the whole object moving with an effect in the open.
4. Write `<name>.js` in the shape of the examples: take what you need from `IF`; define `mount({ stage, svg, read, src }, value)` returning `{ set, destroy }`; end the file with `isoform({ name, icon, variant, means, effect, rules, range, mount })`.
   - `icon`, `variant`: the Isocons id and variant. `build.mjs` inlines that SVG.
   - `means`: one sentence, at most 140 characters, saying what the figure shows.
   - `effect`: one sentence naming the physical thing the effect adds under the traces. Leave it out if there is no effect.
   - Draw what happens with `trace` / `part.trace` first; the effect sits under those lines and only when `fx.on`.
   - `rules`: the numbers of the rules it leans on most.
   - `range`: the one number the slider drives, at intensity 0, 0.5 and 1, moving one way. `mount`'s `value` and `set(value)` get this number.
5. Assemble: `node build.mjs <name>.js` writes `isoform-<name>.html`.

## 4. Check

1. `node look.mjs <name>.js --at x,y --edge x,y`, as `look.md` says. It validates, takes the nine pictures, and prints what failed. Fix every failure and run it again until it exits 0.
2. Read `look.md`, then the sheet, and answer its twelve questions. Fix what fails, then go back to 1.

Without a browser: `node validate.mjs isoform-<name>.html` after each build, and the look from the code as `look.md` says. Without Node: answer the checks at the top of `validate.mjs` from your code.

Do not hand over a page the validator rejects. Do not say the look is done if you did not look.

## 5. Hand over

Publish `isoform-<name>.html` as an artifact if you can; otherwise say where the file is. Then, one line each:

- the metaphor: the object, what the pointer does, what the effect shows;
- the rules it leans on;
- anything you could not verify, plainly.

The page credits the icon to Isocons under CC BY 4.0. Keep that credit wherever the figure goes.

## 6. Adjust

For a change, edit only `<name>.js`, then run `look.mjs` again and read the new sheet. The tenth version is held to the same bar as the first.

## What goes wrong

| If you catch yourself | Do this instead |
| --- | --- |
| moving a part and leaving an empty outline behind it | draw what it hid: `icon.face` or `icon.facet` (rule 06) |
| a part that takes half of a neighbour's face with it | cut the face first: `icon.cut(i, icon.pt(x, y), "u")` (rule 09) |
| reading corners off `inspect.mjs` and the cut lands in the wrong place | you placed the icon elsewhere: pass every point through `icon.pt` |
| reaching for a glow, sparkle or particles | name what the real object does, and draw that (rule 11) |
| drawing the phenomenon only in the shader | trace it in hairline first; the effect adds material under the trace (rule 11) |
| mapping the pointer's height to a big move | answer nearness, a few units at the default (rule 03) |
| a read-out in percent | name the state: `rest`, `ignition`, `liftoff`, `arc ×2`, `tip +4°` |
| giving the effect a colour of its own | palette uniforms; one physical colour only, with a comment (rule 12) |
| writing a timer or `requestAnimationFrame` | `register(stage, tick)`, with springs or tweens (rule 07) |
| testing the pointer against where a part is now | `icon.hit` or `part.rest` (rule 01) |
| turning a part by 30° | flat faces turned that far stop being a solid: move it, tilt under 15° (rule 09) |
| editing the kernel or the bench to make something work | the figure is wrong; change the figure |
| a figure that means nothing with effects off | the gesture carries the idea; the effect is its consequence (rule 11) |
| letting in a second idea | cut it |
