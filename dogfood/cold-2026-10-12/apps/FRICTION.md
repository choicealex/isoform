# Friction
- No check failed; look.mjs passed first run (exit 0). No errors to quote.
- inspect.mjs and concepts.md output are huge (40KB); a bare run floods context. A --brief flag would help.
- inspect says axes "not measured" for u/v partially; I did not need {u,v} override, but the doc gives no way to confirm the measured v was right except by eye.
- Guess: part face order [cap, body] inside a part (which paints on top). Looked fine on the sheet.
- Guess: which direction a drum's axis is (-v, found by comparing centres); docs say "side band runs along v" only for radio. Moved +v toward viewer.
- Guess: no effect and no trace for an abstract symbol; concepts.md says so, but rule 11 reads as if a trace is mandatory.
- look.mjs "hole" check says OK, but in the answer picture one pulled drum shows doubled edges near a neighbour (painter order, not after()'d); look.mjs did not flag it. Possible missed check / my unchecked flaw.
- Doc: look.md says to answer 12 questions; no way for a non-visual reader to be sure; I eyeballed a downscaled sheet only.
