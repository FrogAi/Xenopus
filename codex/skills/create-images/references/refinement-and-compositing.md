# Sectioned refinement and compositing

## Plan the sections

- Work from the frozen blueprint. Cover it with an overlapping grid (about a quarter of each section's width and height overlapping), and add one section per important subject, centred on it with room around it, so no subject is split between grid sections.
- Keep every section within the generator's current size limits (aspect ratio, longest edge, pixel count, side multiples), checked in the provider's documentation.
- Enlarge each section's crop about three times, as far as those limits allow, for the model's input and output size; a generator that picks its own size (Codex's built-in one returns about 1.5 megapixels at roughly, not exactly, the input's shape) caps that enlargement, and its results must be registered to their source crop before placing (the compositor's `fit` over the whole box), then scale results down into a master at about twice the blueprint's size; the downscale is what turns model detail into photographic sharpness.
- Send every section of a pass in parallel where the generator allows it, otherwise one after another. Keep the raw results out of the deliverable folder; copy only the chosen piece per section to it, overwriting the previous choice.

## Check every piece before using it

- Compare each result with its source at coarse scale; reject pieces where something moved, vanished, appeared or changed species.
- Look at every subject piece at full size yourself. Redo a wrong piece rather than accepting it; most redos are wrong details, which another try or a corrected input fixes, not a higher quality setting.
- Keep sharpness consistent: choose between tries by how well each matches its neighbours' detail at the same distance, not by which is sharpest, and measure detail (for example Laplacian variance) along joins. Renders of the same area can differ several-fold; a piece that comes out crisper than its surroundings is softened to match before it is placed, and one that comes out softer is re-rendered.

## Composite without seams

Never cross-fade two renders: wherever they differ, a fade shows both (ghosts, smudges, soft bands), and a fade that ends at a patch edge leaves a visible rectangle. Instead, for every piece:

1. Align it to what is already in place (phase correlation on the parts that should match; reject large shifts).
2. Match its tone to the canvas using only pixels where the two agree.
3. Decide which pixels it replaces:
   - **Grid overlaps:** cut the overlap with a watershed that runs where the two renders look most alike, so anything that differs lands wholly on one side, and keep the cut well inside the overlap, never on either of its edges.
   - **Subjects and fixes:** what must change is the core: the pixels that differ from the canvas (the new object and the old one it replaces, including its reflection and shadow), plus a cut-out of the subject itself (GrabCut seeded by its expected area), filled and slightly dilated. Mark an area solid only where everything in it must change (a re-rendered sky with new birds). Then let a watershed find the cut around the core, through an area extended well beyond it, where the piece and the canvas agree. Never cut along a fixed rectangle or ellipse: a straight or shaped edge through texture that differs is a visible seam, and a cut through something that differs leaves a ghost.
4. Blend across that cut with a Laplacian pyramid over a window padded beyond the piece, so tone fades out gradually while fine detail switches cleanly at the cut.
5. Never let empty canvas take part in a blend; fill it from the piece first.

A distinct object lying in an overlap must come from one piece only. Remove a leftover (a ghost reflection, a smudge, a stray shape) with a small section re-render: fill the spot with a smooth, low-resolution fill of its surroundings and describe only what should be there. Never clone-retouch from nearby pixels: even a small copied patch repeats distinctive glints, edges and specks at a fixed offset, which a careful review finds, and it can carry a whole wrong object with it. When a re-render of a small detail (a hand, a foot, an eye) redraws the unchanged part of the subject around it slightly moved or scaled, warp the piece onto the canvas over that unchanged part first (an affine fit, such as the compositor's `fit`), replace only the detail plus what touches it, and keep the cut close to it (the compositor's `margin`), so the cut never runs through parts that differ. A tighter crop doesn't help: the model reframes small crops even more. Rebuild the master from all chosen pieces in one pass after any change, rather than layering patches on an earlier master; then confirm that every layer actually landed (an outline overlay of each subject and fix region, and how much each replaced) before inspecting the overview and every changed area at full size. After any change to the compositor itself, rebuild a known master and compare it pixel by pixel.
