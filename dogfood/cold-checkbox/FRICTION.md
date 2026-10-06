1. SKILL.md says "read the index down to var IF" but the index sits in a 140-line comment block cut at 400 cols; fine, but no line number given.
2. inspect.mjs says face 0 has an opening and "free it with icon.hole(0) before moving it". I did; the freed window face painted as a SOLID face (fill hid the see-through window and walls 1,2; rest looked like a solid slab). Nothing in SKILL/rules/kernel index warns that hole() on an EMPTY window (no content to show) makes it opaque. Cost one full iteration; fix was not freeing it.
3. Concepts for abstract symbols say "no effect" but gave no recipe for a blank/empty symbol; my story is small (answer changes 1.17% of the stage). look.mjs passed anyway (exit 0).
4. rule 10 vs a tick trace: unclear whether a drawn check mark counts as a "symbol" in the stage; I avoided it.
5. Parts paint order inside a part with hole faces is not documented.
6. look.mjs: poster = answer (press 1), so poster is near the answer pose; read-out "press …" mid-story is my own label. --edge needed twice? One was fine.
7. Worked well: look.mjs one command, parts picture with grid, radio.js example, concept-strike rule when nobody can pick.
