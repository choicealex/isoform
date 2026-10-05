# Ryan (@wheresryan22) — Hairline skill + WebGL shaders, compilation post (2026-10-05 20:35)

https://x.com/wheresryan22/status/2107193081087058050 — "a compilation of some of the work done with the skill using
WebGL shaders integration (which is part of the skill)". Reply: "All renders has been one-shotted with Opus 5.5
Ultracode + the skill." 3:09 video; 27 frames captured every 7s (scratchpad `ryan/sheet{A,B,C}.png`).

## What is in it
Seven machines, each a process: a jet engine cut away on a test stand (inner glow, then an orange exhaust flame);
a rocket combustion chamber (violet glow inside the bell, pulsing); a forge (a bowl of red-hot coals, a glowing
billet carried across); a crucible on a pouring stand (molten metal glowing in the pot, tipped to pour into moulds);
a mixing tank with a pump (amber liquid filling from below, the level rising, the pump's rotor glowing); a gantry
plotter (a hot tip drawing a line); a tall vessel (blue Cherenkov-like glow blooming from the base, pulsing).

## How the effects are used (the part to learn from)
1. **The effect is the only colour.** Everything else stays pale grey hairline on a pale plate; the effect is fully
   saturated (orange, violet, red, amber, blue). That contrast is what makes it read as light and heat.
2. **Emissive, with bloom.** Glows have a hot core and a soft halo that spills past the lines onto nearby parts.
3. **Inside the object as much as outside.** Most effects are *masked to a part*: coals in a bowl, metal in a pot,
   liquid in a tank, glow in a bell. Exhaust is the one that leaves the object.
4. **Material, not decoration.** Liquids are volumes with a bright surface and darker depth, the level animates;
   flames are turbulent (fbm), coals flicker, glows pulse. Every one is what the machine physically does.
5. **Tied to the story.** The effect rises and falls with the beat: the engine spools then lights, the crucible tips
   then pours, the tank fills.
6. **Line drawing on top, always.** The hairlines stay crisp over the colour.

## For Isoform (owner: effects on by default, bolder)
Our effects were limited to "material under the traces, both versions look alike" — too timid. Move to: saturated
physical colour as the one colour of the scene, hot core + soft halo, masked inside the part where the material lives
(over layer), turbulence and flicker from fbm, strength driven by the story channel. Keep: physical only (rule 11),
traces in line first, the figure must still read with the effect off.
