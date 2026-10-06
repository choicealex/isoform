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

## By category

Isocons ships in six categories. Each is a kind of object and has stories that fit it. Pick the category's story first, then the icon. Every beat moves along `u`, `v` or up; every story ends at rest. Hover is nearness (a spring), never a slider.

### UI Actions (375)

Mostly symbols and interface hardware as solid blocks: arrows (`arrow-forward`, `arrow-up`, `chevron-down`), marks (`check`, `add-circle`, `cancel-circle`), controls (`toggle-on`, `checkbox`, `menu`), file moves (`download`, `upload`, `delete`, `refresh`), a few real objects (`key`, `bolt`, `terminal`).

Stories that work:
- **Slide and land.** A control's moving part runs along its track and settles (`toggle-on`: the knob slides along the track's long axis, which is `u` or `v` depending on the view: read it off the parts picture; the track brightens). Hover nudges it toward the other state, a few units. Trace: a short line along the track. No effect.
- **Stamp.** A mark drops onto its plate with a short overshoot, holds, lifts (`check`, `done-all`). Hover presses it a hair. Trace: a ring on the plate at the strike. No effect.
- **Carry.** An arrow block moves a payload one way and returns empty (`download`, `upload`, `open-in-new`). Hover leans the arrow toward its target. Trace: the path it travelled, drawn on and retracted. No effect.
- **Stack.** Blocks arrive one by one and settle (`add-circle`, `library-add`, `stacks`). Hover lifts the top block. Trace: a drop line under each block. No effect.
- **Real hardware.** Where the icon is an object (`key`, `bolt`, `terminal`, `eject`) tell what the object does. Physical effect only if the object has one (`bolt`: current).

Traps:
- Abstract symbols have no physics: animate the gesture the symbol stands for and use no WebGL effect (see Abstract symbols).
- Do not animate a UI icon as a UI: no spinners, no progress fill, no morphing between two states. Move blocks.
- Circles and rings are flat discs: slide or lift them, never scale or rotate them.
- Chevrons and arrows are angled blocks: move along their own axis, tilt under 15°.

Worked examples:
- **Toggle on.** The switch, `toggle-on`. Beats: the knob rests left, slides along u to the right end (1s), the track takes the bright stroke, hold (1.2s), slides back (0.8s). Hover: nearness pushes the knob a few units past its seat and it settles back. Trace: a short line along the track behind the knob; no effect. Job: a setting that takes effect. Poster: the knob at the far end, track bright.
- **Download.** The tray with its arrow, `download`. Beats: the arrow block rises clear of the tray (0.8s), drops into it (0.7s, short overshoot), the tray lip brightens, hold, the arrow returns (0.9s). Hover: nearness lowers the arrow toward the tray. Trace: a vertical line drawn on above the arrow showing its path. No effect. Job: a file saving. Poster: arrow just entering the tray.
- **Delete.** The bin, `delete`. Beats: the lid lifts about its hinge (tilt under 15° plus move), a slip of paper drops in, the lid closes, hold. Hover: nearness lifts the lid a few units. Trace: the paper's fall line, drawn on and retracted. No effect. Job: removing an item. Poster: paper half inside the open bin.

### Social (316)

Weather, living things, people, faces, medical, media and nature objects: `water-drop`, `sunny`, `rainy`, `thunderstorm`, `snowing`, `candle`, `rocket-launch`, `helicopter`, `water-bottle`, `syringe`, `thumb-up`, `waving-hand`, `person-add`.

Stories that work:
- **Fall and ripple.** Something drops and the surface answers (`water-drop`, `rainy`, `rainy-light`). Hover: nearness catches the drop short of the ground. Trace: the fall line, then rings on the ground along u and v. Effect: the water's body and its refraction.
- **Burn.** A flame sways and breathes (`candle`, `whatshot`, `local-fire-department` in Maps). Hover: heat leans the flame toward the hand. Trace: the flame's outline and core. Effect: flame heat and halo (the one flame colour, named in a comment).
- **Weather cycle.** A cloud holds, drops draw on and run out of it, the sun comes through (`rainy`, `sunny`, `thunderstorm`, `snowing`). Hover thickens the fall. Trace: draw-on streaks, solid, never dashed. Effect: rain streak light, or lightning's blue-white on `thunderstorm` only.
- **Launch and fly.** Vehicles in Social (`rocket-launch`, `helicopter`) follow the transport stories below. `rocket.js` is the bar.
- **Gesture.** A hand or thumb does its verb (`thumb-up`, `waving-hand`, `front-hand`): rises, holds, returns. Hover raises it a few units. Trace: two small arcs of motion. No effect.

Traps:
- Faces and people are not machines: never morph an expression or bend limbs. Move the whole figure, or let one block (a hand, a thumb) move along an axis.
- Medical and body icons (`stethoscope`, `femur`, `hematology`) have no honest physics: use the gesture-and-trace story and no effect, or choose another icon.
- Weather needs one phenomenon: rain or sun, not both. Cut the second.
- Rotation is the common mistake: a sun does not spin as a flat disc; its rays draw on and retract.

Worked examples:
- **Water drop.** A single drop, `water-drop`. Beats: the drop hangs (0.6s), falls a short way along up (0.6s, easing in), lands: rings spread along u and v and fade (1.4s), the drop re-forms, hold. Hover: nearness holds the drop a few units above its rest and sets its ring wider. Trace: the fall line and two ring arcs, drawn on and retracted. Effect: the drop's body of water with refraction, strongest at the strike. Job: hydration, a clean-water metric. Poster: first ring open, drop gone.
- **Candle.** The candle, `candle`. Beats: unlit; the wick takes a flame (0.8s); the flame sways and breathes (3s); the wax shortens a hair; the flame thins and goes out (1s). Hover: the flame leans toward the pointer a few units. Trace: the flame's edge and core, drawn on. Effect: flame heat and halo in flame orange; masked above the wick. Job: a calm state, an anniversary, a ritual. Poster: the flame at full height.
- **Rainy.** The cloud over rain, `rainy`. Beats: the cloud settles (0.8s), five streaks draw on from it and run down (1.2s), hold at staggered heights, retract bottom-up (1s). Hover: nearness thickens the streaks nearest the pointer. Trace: solid streak lines, drawn on and retracted. Effect: a faint streak light under the cloud; if it would look the same on any cloud, drop it. Job: a forecast or a mood. Poster: all streaks half drawn.

### Business & Payments (153)

Money, cards, carts, receipts, charts, buildings, logistics: `shopping-cart`, `credit-card`, `wallet`, `savings`, `receipt-long`, `atm`, `contactless`, `bar-chart`, `pie-chart`, `trending-up`, `storefront`, `forklift`, `box`, `barcode-scanner`.

Stories that work:
- **Fill the container.** An item drops into a cart, bag, basket, wallet or piggy bank, and the container takes the weight (`shopping-cart`, `shopping-bag`, `savings`, `wallet`). Hover: the container rolls or dips toward the hand. Trace: the item's fall line; a small dent ring. No effect, or none beyond a contact scuff.
- **Tap and confirm.** A card meets a reader and the reader answers (`credit-card`, `contactless`, `atm`). Hover: nearness brings the card in. Trace: one to three arcs between card and reader, drawn on, then the confirming mark. Effect: none unless the arcs need light; a short cool pulse only.
- **Grow.** Bars or a line rise in order and hold (`bar-chart`, `trending-up`, `leaderboard`, `podium`). Hover lifts the bar nearest the pointer. Trace: a baseline and the tops' line. No effect.
- **Move goods.** A load travels a short way on a vehicle or belt (`forklift`, `conveyor-belt`, `trolley`, `box`): lift, carry, set down. Hover: nearness raises the forks or box. Trace: the path, dust at set-down. No effect.
- **Open and print.** A receipt or slip feeds out (`receipt`, `receipt-long`, `atm`): the sheet slides out along u, holds, retracts. Trace: a line along its edge.

Traps:
- Charts: bars rise along up, never scale (rule 09 forbids scaling a part). Stack extra height on with `facet` if a bar must grow, or slide it from behind a baseline.
- Currency symbols and coins (`dollar`, `euro`, `naira`, `usdc`) are discs or glyph blocks: lift, tilt under 15°, never spin or morph a glyph.
- Do not invent numbers: no digits in the drawing (rule 10). The read-out says `bar 3`, not a price.
- Pie and donut sectors move radially on their own axes only; never explode more than a few units.

Worked examples:
- **Shopping cart.** The cart, `shopping-cart`. Beats: it waits; a parcel drops from above along up into the basket (0.9s, short overshoot); the cart rolls a few units forward along u, wheels' rims brightening (1.2s); hold; it rolls back (1.2s) with the parcel inside. Hover: nearness rocks the cart toward the hand. Trace: the parcel's fall line and a scuff line behind the wheels. No effect. Job: an add-to-cart confirmation. Poster: parcel just inside, cart moved.
- **Bar chart.** Four bars on a baseline, `bar-chart`. Beats: bars rise out of the baseline in order, shortest first (1.4s, staggered 120ms), the tallest turns bright, hold (1.2s), they sink back (1s). Hover: the bar nearest the pointer lifts a few units. Trace: the tops joined by one solid line drawn on across the bars. No effect. Job: growth, a weekly report. Poster: the tallest bar at full height, joined line half drawn.
- **Credit card.** The card, `credit-card`. Beats: the card slides in along u from the right (1s), stops at its seat, the chip face brightens, two short arcs draw on from the chip (0.8s), the card slides back (1s). Hover: nearness brings the card in. Trace: the arcs; the confirming flash is a ring. Effect: none; the arcs carry it. Job: a payment secured. Poster: arcs at their widest.

### Transportation (70)

Vehicles and route markers: `directions-car`, `electric-car`, `local-shipping`, `bus`, `train`, `tram`, `bike`, `boat`, `flight-takeoff`, `ambulance`, `cable-car`, and arrows for direction (`turn-right`, `fork-left`, `u-turn-left`).

Stories that work:
- **Drive.** Wheels' rims brighten as the body travels a few units along u, with a settle at the end; headlamps light (`directions-car`, `bus`, `local-shipping`, `electric-car`). Hover: nearness nudges it forward. Trace: dust or exhaust drawn on behind the rear wheel, a short lamp ray. Effect: lamp light, a soft cone along u.
- **Take off.** The body lifts along up with the nose tilting a little (under 15°), a plume or wake trails (`flight-takeoff`, `boat`, `rocket-launch`). Hover: nearness is the throttle. Trace: the plume's edge or the wake line. Effect: heat and dust for engines; water spread for the boat.
- **Doors and ramp.** A door slides or a ramp lowers, a passenger block steps off (`bus`, `train`, `ambulance`, `cable-car`). Hover: nearness opens it a few units. Trace: the door's travel line. Effect: interior light spilling out, in lamp colour.
- **Rail and cable.** A car runs a short way along its track (`train`, `tram`, `cable-car`, `monorail`). Hover: nearness holds it. Trace: the rail line and sparks at the pantograph. Effect: none, or a lamp.
- **Route sign.** A turn arrow's block slides along the road and takes the bend (`turn-right`, `fork-left`). No physical effect; use Abstract symbols.

Traps:
- Wheels are discs seen in perspective: you cannot spin them. Brighten the rim (bright stroke on and off) and let the body travel; the effect or a trace carries the turn.
- Travel is a few units, not across the stage: the body leaves and returns, it does not drive off.
- Do not tilt a car nose-down to brake: under 15° and only for a hair. Tilts of 3-6° read; more breaks the solid.
- Lamps and exhaust belong to the rest state of the object (on), not the story: switch them on at the start and off at the end, not randomly.

Worked examples:
- **Directions car.** The car, `directions-car`. Beats: it waits; headlamps light (0.6s); it eases forward along u by 14 units while the rear wheel's rim blinks bright and exhaust draws on behind it (1.6s); holds; reverses to rest while the lamps dim (1.4s). Hover: nearness nudges it forward a few units. Trace: exhaust lines drawn on and retracted; a lamp ray along u. Effect: lamp light, a soft cone ahead along u. Job: ride booking, "on its way". Poster: car mid-travel, lamp cone lit.
- **Flight takeoff.** The plane, `flight-takeoff`. Beats: it waits on its runway; it rolls along u (1s); the nose lifts under 8° as the body rises along up (1.6s); a thin contrail draws on behind it (1s); it holds in the air; the contrail retracts as it returns (1.4s). Hover: nearness is lift. Trace: runway line and contrail. Effect: engine heat under the wing, faint. Job: a departure or a booked trip. Poster: lifted, contrail half drawn.
- **Train.** The train, `train`. Beats: the car waits at its platform; the doors slide open along u (0.8s); a passenger block steps off (0.9s); the doors close; the car runs a few units forward along the rail and brakes back (1.4s). Hover: nearness opens the doors. Trace: the rail line and the pantograph spark. No effect, or interior light behind the doors. Job: arrivals, service status. Poster: doors open, passenger half down.

### Maps (57)

Places, pins, amenities and directions: `location-on`, `pin-drop`, `home-pin`, `flag`, `navigation`, `my-location`, `restaurant`, `local-gas-station`, `local-fire-department`, `local-parking`, `park`, `layers`.

Stories that work:
- **Drop a pin.** A pin falls onto the ground plane, lands with a short overshoot, and a ring spreads along u and v (`pin-drop`, `location-on`, `add-location`, `person-pin`). Hover: nearness lifts the pin a few units. Trace: the fall line; two ring arcs on the ground. No effect.
- **Plant a flag.** A flag rises on its pole and its cloth settles (`flag`, `flag-circle`). Hover: nearness raises the cloth a unit. Trace: the pole's travel line. No effect.
- **Scan.** A ring sweeps out from the marker, the marker holds (`my-location`, `location-searching`, `near-me`). Trace: ring arcs drawn on and retracted. No effect.
- **Do the thing.** Amenity icons do what the place does: fuel rises (`local-gas-station`), a flame burns (`local-fire-department`), steam rises (`restaurant`). Hover: nearness enlarges the act a hair. Trace: the level line or the flame's edge. Effect: a physical effect only for the thing named (flame, fuel level, steam).
- **Point.** A compass or navigation block turns a little and settles on its target (`navigation`, `explore`). No effect; see Abstract symbols.

Traps:
- Do not draw a map: no grids, roads or contours. The pin is the object; the ground is just the plane it lands on.
- Pins are tapered solids: move them straight along up. Never spin a pin about its tip.
- Cardinal arrows (`north`, `south`, `east`, `west`) are blocks: slide them one way and back.
- Ripples are traces along u and v, not discs: two arcs at most.

Worked examples:
- **Location on.** The pin, `location-on`. Beats: the pin hangs above the ground (0.6s), drops along up (0.5s, short overshoot), a ring spreads out along u and v (1.2s), a second thinner ring follows, hold, the pin lifts to rest (1s). Hover: nearness lifts the pin a few units and widens the ring. Trace: the fall line and two ring arcs, drawn on and retracted. No effect. Job: a found address, a delivery arrived. Poster: first ring half out, pin landed.
- **Gas station.** The pump, `local-gas-station`. Beats: the pump waits; the nozzle lifts away (0.8s); fuel rises behind the pump's window (1.4s); the nozzle returns and the level holds; the fuel drains (1.2s). Hover: nearness lifts the nozzle a few units. Trace: the fuel level line, clipped inside the window (`part.trace({ clip: true })`). Effect: fuel body, masked inside the window, one physical colour named in a comment. Job: a fuel stop. Poster: the level at two thirds.
- **Local fire department.** The flame badge, `local-fire-department`. Beats: the flame draws on and rises (0.9s), sways and breathes (3s), shrinks and goes out (1s). Hover: the flame leans a few units toward the hand. Trace: the flame's edge and core. Effect: flame heat and halo in flame orange, masked above its base. Job: an emergency, a hot area. Poster: the flame at full height.

### Privacy & Security (36)

Locks, shields, keys, badges and permissions: `encrypted`, `no-encryption`, `shield-lock`, `shield-person`, `vpn-key`, `passkey`, `id-card`, `badge`, `wifi-password`, `admin-panel-settings`, `key-visualizer`.

Stories that work:
- **Lock and latch.** The shackle drops, the body takes it, a latch seats (`encrypted`, `shield-lock`, `no-encryption`). Hover: nearness lifts the shackle a few units. Trace: a ring at the latch and a short seat line. No effect.
- **Key turns.** A key enters a lock, and the lock answers with a mark sweeping round the keyhole (`vpn-key`, `passkey`, `key-visualizer`). Hover: nearness presses the key in. Trace: a sweep arc on the keyhole's rim. No effect. Never tilt the key about its long axis (a 10° screen tilt bends every edge).
- **Shield up.** A shield descends, takes its mark, and takes a hit, holding (`shield-lock`, `shield-person`, `verified-user`). Hover: nearness raises it a few units. Trace: a short ring where the blow lands. No effect.
- **Scan and clear.** A badge or card passes under a line and gets its mark (`id-card`, `badge`, `wifi-password`). Hover: nearness pulls it into the line. Trace: a scan line sweeping along u. Effect: a thin scanner beam in the palette; physical only if the scanner has a light.

Traps:
- Security has no physical effect to borrow: do not add a glow, a lock-picking sparkle or a shield aura. The gesture carries it, and effects stay off.
- A shackle moves in a plane: raise and lower it along up; do not rotate it.
- A "warning" icon (`report`, `exclamation`) is a symbol: use the Abstract symbols stamp, never a shake.
- Show state by which part is bright (shackle open: shackle bright; locked: latch bright), not by colour.

Worked examples:
- **Encrypted.** The padlock, `encrypted`. Beats: the shackle rests raised (0.4s), it drops along up into the body (0.7s, short overshoot), a latch ring draws on at the seat (0.5s), hold (1.4s), the shackle lifts back (0.9s). Hover: nearness lifts the shackle a few units. Trace: the latch ring and a short seat line. No effect. Job: data secured. Poster: shackle seated, ring half drawn.
- **Shield lock.** The shield with its lock, `shield-lock`. Beats: the shield descends a few units and seats (0.8s), the lock mark brightens, a ring spreads from the shield's face where a blow lands (0.7s), the shield holds, the ring retracts, the shield settles to rest (1s). Hover: nearness raises it. Trace: the blow ring. No effect. Job: protection active. Poster: ring at its widest.
- **VPN key.** The key, `vpn-key`. Beats: the key waits to the left; slides in along u toward a keyhole (1s); stops; a mark sweeps round the key's bow (1s); holds; slides back (1s). Hover: nearness pushes the key in a few units. Trace: the sweep arc. No effect. Job: a secured connection. Poster: the sweep three quarters round.

## Abstract symbols

Arrows, plus, minus, check, close, letters, numbers, shapes: `arrow-forward`, `arrow-up`, `chevron-right`, `add-circle`, `check`, `cancel-circle`, `minimize`, `maximize`, `abc`, `123`, `radio-button-checked`, `stat-3`. They have no real object, so never invent physics. Treat the symbol as a block of material doing its own verb.

- **Verb first.** Say the symbol's verb: point, add, confirm, cancel, remove, sort. The block does that and nothing else.
- **Arrow block.** Slides one way along its own axis and points, overshoots a hair, returns. Chevron: steps along u, one step, back. Hover leans it toward the target a few units.
- **Check.** A block that stamps: drops along up onto its plate, short overshoot, holds, lifts. Close and cancel stamp the same way, drawn once.
- **Plus.** Blocks stack: a second block arrives and seats on the first, the plus brightens, the pair settles. Minus: a block slides out and leaves a gap.
- **Letters and numbers (`abc`, `123`).** They are separate blocks: sort them, stack them or slide them into a row. Never morph a glyph or draw its strokes on.
- **Shapes (`stat-3`, `radio-button-checked`).** Levels step one by one. Move, never scale. Check what the drawing really has: `radio-button-checked` is one ring with a hole and no separate dot, so a story about a dot has nothing to move (two stress-test agents built one and animated the hole's wall). A symbol with nothing that comes apart may have no good story: say so, and offer a nearby icon that has one.

Trace: a path line (the travel, drawn on and retracted) or a seat ring where a block lands. Nothing else.

When to use no effect: always, for abstract symbols. If you cannot name a material an object has, the figure needs no effect: say so in the concept. The gesture, the trace and the bright part carry the whole idea; the figure must still read with effects off, and here it is the only way it reads.
