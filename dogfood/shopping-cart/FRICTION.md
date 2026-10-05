# Friction log: shopping-cart

- SKILL.md step 1 says inspect.mjs writes a numbered parts HTML, but the printed table alone (facing + box) doesn't say which face is basket/frame/wheel. I had to view the HTML. Opening it in Playwright MCP is blocked (file: protocol); I used headless Chrome --screenshot. Doc should say how to view it (e.g. look.mjs-style screenshot flag, or print a PNG path). Also I first Read the .html as text (wasted tokens; workspace rule says never read html).
- find.mjs prints each result twice when given multi-word query? (ran `shopping cart` then `cart`; output lists shopping-cart-... then garden-cart etc; fine). Minor: no note on which variant.
- look.mjs exit 0 on run 1 although answer/small-answer/low/high/dark/light/effect pictures were BLANK with read-out "drawing" (ink stuck at 0). Its "checks it can make itself" did not flag a blank drawing or a read-out stuck on "drawing". It should fail when an answering shot reads "drawing" or has no ink.
- Same blank answer shots occur on the shipped examples/bolt.js (run from look.mjs) => harness/kernel issue, not my figure: the pointer is held at load, hold() freezes the story clock inside the intro, ink stays 0. SKILL.md/look.md never say to handle this. Workaround I used: pass ink:1 in the live object when held (`roll.values(roll.held ? {roll: hand.x, ink: 1} : {})`). Doc should say so, or kernel should let the intro finish while held / look.mjs should wait.
- Run 2 (after ink:1 fix) exit 0 but the sheet still showed no dust trace anywhere: my first design derived dust from velocity, which is zero in every settled/held frame. Took run 3 to make dust a story channel (poster dust:1, hover dust from nearness). Docs say poster = telling moment and look.mjs shoots settled frames, but nothing warns that velocity-derived traces never appear in stills.
- look.mjs "checks it can make itself" never check that a trace/effect is visible; exit 0 told me nothing about Q8/Q11. I judged by eye.
- Doc gap: no guidance on reading ground-contact points (feet) for traces; I estimated from parts screenshot pixels. part.rest gives boxes only.
- Doc gap: story beat value forms `[1,1,0.9]` (keys) only shown as `[-0.05, 0]`; I guessed the list = keyframes. Worked.
- kernel index inconsistency: `ic.iso(-1,0,0)` works as documented; `trace(svg,{under:true})` OK. No misnamed APIs found.
- Worked well: examples + index sufficient to write 112 lines first try; build/validate clean; look.mjs one command; --zoom handy.
- Needed to read nothing forbidden.
