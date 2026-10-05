# From an icon to a concept

A concept is four things: **the icon**, **what the pointer does to it**, **what the real object does in answer** (the effect), and **what the read-out says**. It fits on one line. If it does not, it is not ready to build.

## Finding it

1. **Find the icon.** `node find.mjs <words>` searches the 1,007 Isocons icons. Prefer the one whose parts are already drawn as separate faces: `node inspect.mjs <id>` shows them.
2. **Find the object.** Most icons are objects: a bottle, a rocket, a cart, a key. A symbol (an arrow, a check, a plus) is still a solid when Isocons draws it, a block of material, so treat it as the thing it is made of: an extruded plus is a moulded part that clicks into a plate; a heart is a soft cushion that dents.
3. **Ask what it does.** If you held this object, what would it really do when you touched it this way? Open, pour, unscrew, burn, spin, ring, fill, drain, spark, steam, bend, snap, slide. Pick one. That is the gesture and, often, the effect.
4. **Find its parts.** Which faces come away, and where does a face have to be cut? Isocons draws coplanar faces as one path, so a cap's side and a bottle's side are one face until you cut it (`icon.cut`). Say the cut in the concept: "cut the left face at the cap's rim".
5. **Give the pointer the one variable.** Where it is sets an amount (continuous: a spring); what it is over sets a choice (discrete: a tween). The pointer's height is the most natural lever on an object you lift or open.
6. **Name the effect, physically.** One sentence a physicist would accept: "water sloshes and settles level", not "blue glow". If you cannot name one, the figure needs no effect: say so.
7. **Design the rest.** The icon as Isocons drew it, one bright part where the eye should start.
8. **Choose the read-out and the slider.** A few characters (`open 40%`, `gap 18`, `thrust 60%`) and `rest`; one number the slider makes weaker or stronger: a reach, a gap, a climb.

## Three answers already built

| Answer | Example | The pointer | The parts | The effect |
| --- | --- | --- | --- | --- |
| **Unscrew and pour** | `examples/water-bottle.js` | height lifts the cap; a sweep is an impulse | one cut (cap from body), the neck's top revealed with `face` | water masked to the body, level along the icon's axes, ringing on an underdamped spring |
| **Pry apart** | `examples/bolt.js` | height opens a gap | one cut along u, the broken surface added with `facet` | arcs across the gap, re-struck as they flicker |
| **Throttle** | `examples/rocket.js` | height is the throttle; lift-off past a third | the parts move together, the window is the bright mark | a plume with shock diamonds under the nozzle, dust thrown along the ground |

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
