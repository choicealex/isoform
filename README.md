# Isoform

Isocons icons, taken apart, that answer the pointer the way the real object would.

Isoform is a skill for coding agents. Name an [Isocons](https://isocons.app) icon (or an idea) and it splits the icon along its own edges into parts that answer the pointer coming near, draws what the real object would do in the same hairline (a water line, arcs, a flame's edge), and, when the reader turns it on, adds a WebGL effect for the material under those lines (the water, the light, the heat). Both versions look alike. It checks the result against twelve rules and in a browser, and hands it over as one HTML file with no dependencies.

## Install

```sh
npx skills add choicealex/isoform
```

Then, in the agent:

```
/isoform-animate the water bottle
```

It finds the icon, shows what it is made of, offers two or three concepts (the gesture, the physical effect, the read-out), builds the one you pick, checks it, and gives you `isoform-<name>.html`. It runs on any agent that reads skills: Claude Code, Cursor, Codex and others. Node is needed for the checks; a browser for the look.

## What is in here

```
skills/isoform-animate   the skill: SKILL.md, the twelve rules, the concepts guide, the look,
                         the engine (kernel.js), the page (bench.html), build / validate / look /
                         inspect / find scripts, and three worked examples
data/                    the 1,007 Isocons icons as plain SVG, six variants each, plus index.json
scripts/                 extract-isocons.mjs: how data/ was made from the Isocons site
```

## The examples

| Figure | The pointer | In line | With the effect on |
| --- | --- | --- | --- |
| `water-bottle` | its side rocks the bottle a few degrees | the water line stays level, sloshes, settles | the body of water under it |
| `bolt` | nearness parts the halves at the seam | one to three arcs, re-struck | the current's blue-white light |
| `rocket` | nearness lights the engine; close in it lifts off | the flame's edge, core and shock diamonds; dashed dust | the flame's heat, the dust cloud |

Build one: `node skills/isoform-animate/build.mjs skills/isoform-animate/examples/bolt.js`, then open `isoform-bolt.html`.

## Credits

- **Icons:** [Isocons](https://isocons.app) by [@leyeConnect](https://x.com/leyeConnect) and [@meandchimso](https://x.com/meandchimso), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Isoform splits them into parts and animates them; every page it builds carries the credit. Isoform is not made or endorsed by Isocons. See `data/LICENSE.md`.
- **Method:** the shape of the skill (concept → build → validate → look, a fixed engine the agent may not edit, rules with "sent back when") follows [Hairline](https://github.com/lucasmarkes/hairline) by Lucas Marques (MIT). See `NOTICE.md`.

## License

The code is MIT (`LICENSE`). The icon data in `data/` is CC BY 4.0 (`data/LICENSE.md`).
