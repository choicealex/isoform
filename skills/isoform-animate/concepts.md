# From an icon to a concept

Isocons are used as illustrations, so a concept is a **story** first: **the icon**, **what it does on its own in a few beats** (set up, act, hold, return), **what happens physically** (traced, with an optional effect), **what hover does**, and **the poster frame**. It fits on one line. If it does not, it is not ready to build.

## Finding it

1. **Find the icon.** `node find.mjs <words>` searches the 1,007 Isocons icons. Prefer the one whose parts are already drawn as separate faces: `node inspect.mjs <id>` shows them (the rounded-left variant by default).
2. **Find the object.** Most icons are objects: a bottle, a rocket, a cart, a key. A symbol (an arrow, a check, a plus) is still a solid when Isocons draws it, a block of material, so treat it as the thing it is made of: an extruded plus is a moulded part that clicks into a plate; a heart is a soft cushion that dents.
3. **Ask what it does.** If you held this object, what would it really do when you touched it this way? Open, pour, unscrew, burn, spin, ring, fill, drain, spark, steam, bend, snap, slide. Pick one. That is the gesture and, often, the effect.
4. **Find its parts.** Which faces come away, and where does a face have to be cut? Isocons draws coplanar faces as one path, so a cap's side and a bottle's side are one face until you cut it (`icon.cut`). Say the cut in the concept: "cut the left face at the cap's rim".
5. **Give the pointer the one variable.** How near it comes sets an amount (continuous: a spring); what it is over sets a choice (discrete: a tween). Answer the hand coming close, the way a real object would; mapping the pointer's height or x straight to a big move turns the figure into a slider.
6. **Name what happens, physically, then trace it.** One sentence a physicist would accept: "water sloshes and settles level", not "blue glow". Then say how it is drawn in line (the water's surface; the arcs; the flame's edge) and what the optional effect adds under it (the water's body; the light; the heat). If you cannot name one, the figure needs no effect: say so.
7. **Say its job in a product.** One line: a fill level, a live connection, a launch. A figure that cannot name one is redrawn.
8. **Design the rest.** The icon as Isocons drew it, one bright part where the eye should start.
9. **Choose the read-out and the slider.** A state in a few characters (`ignition`, `arc ×2`, `tip +4°`) and `rest`; one number the slider makes weaker or stronger: a reach, a gap, a climb. Small at the default.

## Three stories already built

Each plays on its own; hover takes over as shown.

| Story | Example | Hover | The parts | What happens |
| --- | --- | --- | --- | --- |
| **Refill** (8.8s): cap off, pour in, cap on, shake, pour out | `examples/water-bottle.js` | its side of the bottle rocks it | one cut (cap from body); the cap is set aside | traces: the water line, level and sloshing; the streams in and out; effect: the body of water |
| **Charge** (4.2s): part, arc, snap shut | `examples/bolt.js` | nearness to the seam holds it open | one cut along u, the broken surface added with `facet` | trace: one to three arcs, re-struck; effect: the current's blue-white light |
| **Flight** (6.4s): ignite, lift off, hover, land, cut out | `examples/rocket.js` | nearness is the throttle | the parts move together, the window is the bright mark | trace: the flame's edge, its core and shock diamonds, dashed dust; effect: the flame's heat and the dust cloud |

Other answers that suit Isocons objects: **open a hinge** (a lid, a door, a laptop: `tilt` about the hinge, under 15°, plus a `move`), **press** (a key, a button: a short move down with neighbours following, rule 02), **fill** (a battery, a glass: an `over` effect masked to the body), **spin** (a fan, a wheel: the effect carries the motion the flat faces cannot), **heat** (a pan, a bulb: an `under` shimmer of rising air, or an `over` glow of the metal itself in its one physical colour).

## A weak concept

Drop it, or fix it before building, when:

- **The effect is decoration.** It would look the same on any icon. Rule 11.
- **It is dead without the effect.** With effects off the figure should still answer.
- **It needs a cut across a curve.** A cut is a straight line on an axis; a curved face split badly looks broken at rest.
- **It holds two ideas.** Two gestures, two effects. Cut one.
- **It needs words.** If the read-out has to explain it, it is not readable yet.
- **It will not read at 240px.** Too many small parts.

## An example

For "a shopping cart":

> **Shopping cart.** The pointer's sideways speed rolls it: the wheels' faces tilt a little as it rocks, and the effect is the wheels' motion blur on the ground with a scuff of dust. Read-out: `roll 0.4`.
>
> **Shopping cart, loaded.** The pointer's height tips the basket on its frame (cut the frame from the basket along up), and parcels slide in the basket as an `over` effect masked to it. Read-out: `tip 9°`.

Each has an icon, a gesture, a physical effect and a read-out; each is one idea; each is the icon at rest.
