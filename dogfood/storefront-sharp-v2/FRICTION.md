1. concepts.md has no storefront/awning story; Business & Payments gives no cut guidance for an icon whose faces are not self-evident. Had to guess which faces were the awning from the parts picture (scallops 0/1/4 hang below the awning's real lower edge; the first cut at y=162 left the scallops hanging outside the awning band).
2. SKILL.md "Check" step never says to capture look.mjs's exit code; I only got EXIT 0 by echoing $? myself.
3. Parts picture does not show hidden/internal edges, so the diagonal line crossing the scallops (the awning's own lower edge) was a surprise; found only in the look sheet.
4. icon.face's `before` arg wants a part or path; awning.paths[0] was a guess. I ended up not needing ghosts: moving the awning along v left no visible hole.
5. look.mjs "story-25/50/75" all read "out 10": my loop holds at out=1 across the three shots, so the sheet cannot show the beats distinctly. Not a doc error; a design flaw the sheet exposed.
6. `answer` change is 1.5% only; moving ~10 units is small at 0.5 intensity.
7. Worked: find.mjs, inspect.mjs axes line agreed with corners (no u,v needed), look.mjs one-command sheet, --zoom.
