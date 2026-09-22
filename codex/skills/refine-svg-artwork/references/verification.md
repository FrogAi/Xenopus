# SVG verification and review coverage

## Source and visual evidence

Parse the SVG as XML and check duplicate IDs, unresolved references, clipping, viewBox, and dependencies relevant to its delivery. Confirm that an SVG offered as a true vector master does not merely wrap a bitmap. Successful parsing does not prove visual quality.

Record the reviewed source and render paths, dimensions, and hashes. Keep the candidate stable while reviewers inspect it. Each review records the actual files or crops examined, their bounds and scale, findings, and coverage limits. Creating crops or assigning them is not evidence that anyone opened them.

Render directly from source at the largest requested pixel size and inspect at native resolution. For small icons, also inspect the actual small display size for silhouette, legibility, stroke balance, and detail that disappears. For transparent artwork, inspect against the intended backgrounds. Compare the whole composition with the approved artwork before judging small defects.

Use overlapping native-resolution crops that cover every pixel, plus an overview and subject close-ups. Adapt tile dimensions to the viewer so they are actually shown at original scale. The helper below creates lossless crop files, an overview, and an index of bounds and hashes. It requires Python and Pillow. Inspect every indexed crop and keep the examination record separately.

```powershell
python scripts/prepare_review.py rendered.png review-folder
```

Make contrast-enhanced diagnostic copies for relevant flat or dark regions when they can reveal subtle banding, specks, or seams. Label them as diagnostics and retain the normal render as authority. Confirm suspected defects on tighter enlarged crops and, where pixel ambiguity matters, a freshly rendered vector region at higher scale.

Compare source geometry and the full composition stack when a shape appears disconnected, doubled, distorted, or incorrectly transparent. Include transforms, clipping, masks, reused groups, and covering layers. An isolated component's appearance does not establish what reaches the final viewer. References support only details their angle, resolution, and variant reveal. Consistent perspective can change apparent widths and counts; do not force a frontal photograph onto an oblique illustration.

For each supported finding, keep its location, requirement, evidence, disposition, and repair recheck. Every confirmed in-scope defect needs repair and verification, including small defects visible only when enlarged. Optional style alternatives do not become mandatory repairs. Stop when the requested coverage and checks hold, without launching additional review rounds solely to manufacture findings.

## Animation and target renderers

For animated SVGs, inspect every frame, not only the held pose, for distortion, clipping at the frame or its container, and jitter. Run an automated per-frame check, such as bounds against the safe area and unintended direction reversals of moving parts, plus an independent review. Write scale factors and their offsets with enough precision that frames do not stretch or shake; tenths are too coarse. Verify a recreation against the original frame by frame at zoom, not by eye at thumbnail size. Independent reviews help, but their measurements can be wrong, so recheck at higher zoom when a measurement conflicts with your own inspection or the user's, and rerun the review after each rebuild, because fixes introduce new faults.

When the artwork is shown by a renderer other than a browser, such as Qt's SVG module on an embedded device, render every changed file and frame with that renderer on the target device itself when it is reachable, saying so when it is not, and compare it with the browser render. Qt 5's SVG renderer ignores clip-path, masks, filters, and paint-order, drawing the content as if they were absent; it can also draw an arc whose endpoints are nearly a diameter apart on the wrong side, and drops zero-length round-capped lines. Cut shapes to their container geometrically, split such arcs, and give dots real length.

## High-resolution exports

Prefer the project's working renderer. Check the actual saved SVG and PNG or other requested derivative, rather than assuming the render script succeeded. Verify dimensions, aspect ratio, transparency, relevant color profile and metadata, complete composition, border pixels, clipping, gradients, and soft effects. Derive each raster export from the vector master rather than enlarging a smaller PNG. Render fractional viewBox coordinates consistently; preserve the artwork's aspect ratio within unavoidable integer-pixel rounding.

When a browser cannot render a large canvas completely, render source regions at the final pixel scale. Give each region a margin sufficient for its strokes, filters, masks, and soft shadows. Discard the margins and join the cores at integer pixel boundaries without resizing or blending. A margin that works for one scene is not a universal filter bound.

Validate this export path against same-scale, centered single-region controls across representative vertical and horizontal joins, including filtered and high-contrast contours, and check all frame edges. Complete native coverage must include those joins and borders. Do not accept a source hash or correct dimensions as evidence of a complete, seamless image.

A change of renderer, scaling, margins, color handling, or export recipe invalidates affected output review. Re-render, freeze the new files, and review the actual final output. Small rerender differences may be antialiasing variation, but inspect them and distinguish an observed visual defect from an unexplained pixel difference. Do not require byte-identical independent rendering as a substitute for visual evidence. Saved copies of the reviewed artifact must match it exactly.

If website-served derivatives, alternate crops, or overlays are part of the request, inspect those actual delivery paths as well. Do not claim to have verified an unspecified publication or viewport.
