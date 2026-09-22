"""Composite rendered pieces into one master without seams, ghosts or blur bands.

Usage: python composite.py plan.json

plan.json:
{
  "size": [W, H],                       # master size in pixels
  "output": "master.png",
  "overlay": "regions.png",             # optional: master with each replaced region outlined, for checking
  "layers": [
    {"kind": "grid",    "image": "piece.png", "box": [x0, y0, x1, y1], "fit": {...}},
    {"kind": "subject", "image": "piece.png", "box": [...], "allowed": {"ellipses": [[cx, cy, rx, ry]], "rects": [[x0, y0, x1, y1]]},
                        "solid": {...}},
    {"kind": "fix",     "image": "piece.png", "box": [...], "allowed": {...}, "solid": {...},
                        "fit": {...}, "margin": 16}
  ]
}
All coordinates are in master pixels. Each piece image is resized to its box.

- grid: background sections, placed in order; overlaps are split by a watershed cut where the two renders agree.
- subject: replaces the subject (GrabCut cut-out inside "allowed") plus whatever differs from the canvas there.
- fix: replaces only what differs from the canvas inside "allowed".
- solid: an area inside a subject or fix that must be replaced entirely.
- fit (optional, any layer): an area of the piece that must line up with the canvas, such as the unchanged part of the animal around
  a fixed detail; the piece is warped (affine) onto the canvas there first, for when the model redrew it slightly moved or scaled.
- margin (optional, default 90): how far beyond the replaced area the cut may run; lower it when the piece differs from the
  canvas just outside the fix.
Every layer is blended across its cut with a Laplacian pyramid over a padded window; empty canvas never takes part.
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

# All six are absolute pixels or counts chosen for a 6624x2208 banner, which rebuilt cleanly with them; no other values or image
# sizes were tested, and none scales with image size.

# Pyramid levels for blending; the coarsest band is about 2^6 = 64 px, so tone fades gradually across a cut.
LEVELS = 6

# Canvas included around a box when blending: 3 x 2^LEVELS, so the coarsest band fades out inside the window before
# its edge, where a straight seam would otherwise show.
PAD = 192

# Distance a grid cut keeps from the outer edge of an overlap, where two pieces disagree most.
MARGIN = 40

# Default distance a subject or fix cut may run beyond the replaced area; pass a smaller per-layer margin for fixes
# whose surroundings were redrawn slightly moved.
OBJECT_MARGIN = 90

# Largest alignment shift accepted for grid and subject pieces, about 8 px of model drift for tiles rendered at half
# size and upscaled 2x; a larger shift is treated as a wrong match and ignored.
GRID_MAX_SHIFT = 16

# Smaller limit for fix pieces, which align on small areas where phase correlation more easily locks onto a wrong match.
OBJECT_MAX_SHIFT = 6

plan = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
base_dir = Path(sys.argv[1]).resolve().parent
W, H = plan["size"]
canvas = np.zeros((H, W, 3), np.float32)
covered = np.zeros((H, W), bool)
outlines = []


def resolve(path):
    path = Path(path)
    return path if path.is_absolute() else base_dir / path


def load(path, size):
    return np.asarray(Image.open(resolve(path)).convert("RGB").resize(size, Image.LANCZOS), dtype=np.float32)


def align(tile, target, weight, max_shift):
    a = cv2.cvtColor(target, cv2.COLOR_RGB2GRAY) * weight
    b = cv2.cvtColor(tile, cv2.COLOR_RGB2GRAY) * weight
    window = cv2.createHanningWindow((tile.shape[1], tile.shape[0]), cv2.CV_32F)
    (dx, dy), _ = cv2.phaseCorrelate(b, a, window)
    if abs(dx) > max_shift or abs(dy) > max_shift:
        return tile
    matrix = np.float32([[1, 0, dx], [0, 1, dy]])
    return cv2.warpAffine(tile, matrix, (tile.shape[1], tile.shape[0]), borderMode=cv2.BORDER_REFLECT)


def difference(tile, target, sigma):
    a = cv2.cvtColor(cv2.GaussianBlur(tile, (0, 0), sigma) / 255, cv2.COLOR_RGB2LAB)
    b = cv2.cvtColor(cv2.GaussianBlur(target, (0, 0), sigma) / 255, cv2.COLOR_RGB2LAB)
    return np.sqrt(((a - b) ** 2).sum(2))


def match_tone(tile, target, agree):
    if agree.sum() < 2000:
        return tile
    t = cv2.cvtColor(tile / 255, cv2.COLOR_RGB2LAB)
    r = cv2.cvtColor(target / 255, cv2.COLOR_RGB2LAB)
    for c in range(3):
        ratio = np.clip((r[..., c][agree].std() + 1e-6) / (t[..., c][agree].std() + 1e-6), 0.85, 1.15)
        t[..., c] = (t[..., c] - t[..., c][agree].mean()) * ratio + r[..., c][agree].mean()
    return np.clip(cv2.cvtColor(t, cv2.COLOR_LAB2RGB) * 255, 0, 255)


def pyramid_blend(old, new, mask):
    h, w = mask.shape
    levels = int(max(1, min(LEVELS, np.log2(min(h, w) / 8))))
    gm = [cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 1.0)]
    ga, gb = [old], [new]
    for _ in range(levels):
        gm.append(cv2.pyrDown(gm[-1]))
        ga.append(cv2.pyrDown(ga[-1]))
        gb.append(cv2.pyrDown(gb[-1]))
    out = ga[-1] * (1 - gm[-1][..., None]) + gb[-1] * gm[-1][..., None]
    for i in range(levels - 1, -1, -1):
        size = (ga[i].shape[1], ga[i].shape[0])
        la = ga[i] - cv2.pyrUp(ga[i + 1], dstsize=size)
        lb = gb[i] - cv2.pyrUp(gb[i + 1], dstsize=size)
        out = cv2.pyrUp(out, dstsize=size) + la * (1 - gm[i][..., None]) + lb * gm[i][..., None]
    return np.clip(out, 0, 255)


def blend_into(box, tile, mask):
    x0, y0, x1, y1 = box
    wx0, wy0, wx1, wy1 = max(0, x0 - PAD), max(0, y0 - PAD), min(W, x1 + PAD), min(H, y1 + PAD)
    old = canvas[wy0:wy1, wx0:wx1].copy()
    have = covered[wy0:wy1, wx0:wx1].copy()
    ix0, iy0 = x0 - wx0, y0 - wy0
    inner = np.zeros(have.shape, bool)
    inner[iy0:iy0 + tile.shape[0], ix0:ix0 + tile.shape[1]] = True
    filler = cv2.copyMakeBorder(tile, iy0, (wy1 - wy0) - iy0 - tile.shape[0], ix0, (wx1 - wx0) - ix0 - tile.shape[1], cv2.BORDER_REFLECT)
    new = old.copy()
    new[inner] = filler[inner]
    new[~have & ~inner] = filler[~have & ~inner]
    old[~have] = new[~have]
    full = np.zeros(have.shape, bool)
    full[inner] = mask.ravel()
    out = pyramid_blend(old, new, full)
    write = inner | have
    region = canvas[wy0:wy1, wx0:wx1]
    region[write] = out[write]
    covered[y0:y1, x0:x1] = True


def band_prior(inner, outer):
    if not inner.any() or not outer.any():
        return np.zeros(inner.shape, np.float32)
    d_in = cv2.distanceTransform((~inner).astype(np.uint8), cv2.DIST_L2, 5)
    d_out = cv2.distanceTransform((~outer).astype(np.uint8), cv2.DIST_L2, 5)
    return np.clip(1 - np.abs(d_in - d_out) / (d_in + d_out + 1e-3), 0, 1)


def watershed_cut(diff, new_marker, old_marker, prior):
    unknown = ~(new_marker | old_marker)
    scale = np.percentile(diff[unknown], 99) if unknown.any() else 1.0
    agree = 1.0 - np.clip(diff / max(scale, 1e-3), 0, 1)
    relief = (0.75 * agree + 0.25 * prior) * 254
    markers = np.zeros(diff.shape, np.int32)
    markers[old_marker] = 1
    markers[new_marker] = 2
    cv2.watershed(cv2.merge([relief.astype(np.uint8)] * 3), markers)
    mask = markers == 2
    boundary = markers == -1
    mask[boundary] = cv2.dilate(mask.astype(np.uint8), np.ones((3, 3), np.uint8))[boundary] > 0
    return mask


def place_grid(tile, box):
    x0, y0, x1, y1 = box
    have = covered[y0:y1, x0:x1]
    if not have.any():
        canvas[y0:y1, x0:x1] = tile
        covered[y0:y1, x0:x1] = True
        return
    target = np.where(have[..., None], canvas[y0:y1, x0:x1], 0)
    h, w = have.shape
    # the cut stays at least MARGIN inside the overlap, away from both of its edges
    near_new = cv2.distanceTransform(have.astype(np.uint8), cv2.DIST_L2, 5) < MARGIN
    new_marker = ~have | (have & near_new)
    edge_dist = np.minimum.reduce([np.arange(h)[:, None].repeat(w, 1), np.arange(h)[::-1][:, None].repeat(w, 1),
                                   np.arange(w)[None, :].repeat(h, 0), np.arange(w)[::-1][None, :].repeat(h, 0)])
    old_marker = have & (edge_dist < MARGIN) & ~new_marker
    tile = align(tile, target, have.astype(np.float32), GRID_MAX_SHIFT)
    diff = difference(tile, target, 2.0)
    unknown = have & ~new_marker & ~old_marker
    agree = unknown & (diff < np.percentile(diff[unknown], 40)) if unknown.any() else unknown
    tile = match_tone(tile, target, agree)
    diff = difference(tile, target, 2.0)
    mask = watershed_cut(diff, new_marker, old_marker, band_prior(new_marker, old_marker)) | ~have
    blend_into(box, tile, mask)


def cutout(tile, allowed):
    h, w = allowed.shape
    img = cv2.resize(tile, (w // 2, h // 2), interpolation=cv2.INTER_AREA).astype(np.uint8)
    al = cv2.resize(allowed.astype(np.uint8), (img.shape[1], img.shape[0]), interpolation=cv2.INTER_NEAREST)
    mask = np.full(al.shape, cv2.GC_BGD, np.uint8)
    mask[al > 0] = cv2.GC_PR_BGD
    ys, xs = np.nonzero(al)
    inner = np.zeros_like(al)
    cv2.ellipse(inner, (int(xs.mean()), int(ys.mean())), (int((xs.max() - xs.min()) * 0.275), int((ys.max() - ys.min()) * 0.275)), 0, 0, 360, 1, -1)
    mask[inner > 0] = cv2.GC_PR_FGD
    cv2.grabCut(img, mask, None, np.zeros((1, 65)), np.zeros((1, 65)), 6, cv2.GC_INIT_WITH_MASK)
    fg = ((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)).astype(np.uint8)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(fg)
    keep = np.zeros_like(fg)
    for i in range(1, count):
        if stats[i, cv2.CC_STAT_AREA] >= max(30, fg.sum() * 0.05):
            keep[labels == i] = 1
    return cv2.resize(keep, (w, h), interpolation=cv2.INTER_NEAREST).astype(bool)


def fit(tile, target, region):
    a = cv2.GaussianBlur(cv2.cvtColor(target, cv2.COLOR_RGB2GRAY), (0, 0), 1.5)
    b = cv2.GaussianBlur(cv2.cvtColor(tile, cv2.COLOR_RGB2GRAY), (0, 0), 1.5)
    criteria = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 500, 1e-6)
    _, warp = cv2.findTransformECC(a, b, np.eye(2, 3, dtype=np.float32), cv2.MOTION_AFFINE, criteria, region.astype(np.uint8), 5)
    h, w = region.shape
    return cv2.warpAffine(tile, warp, (w, h), flags=cv2.INTER_LANCZOS4 | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REFLECT)


def place_object(tile, box, allowed, solid, subject, max_shift=None, margin=OBJECT_MARGIN):
    x0, y0, x1, y1 = box
    target = canvas[y0:y1, x0:x1]
    h, w = allowed.shape
    outside = ~allowed
    if max_shift is None:
        max_shift = GRID_MAX_SHIFT if subject else OBJECT_MAX_SHIFT
    tile = align(tile, target, outside.astype(np.float32) if outside.any() else np.ones((h, w), np.float32), max_shift)
    rough = difference(tile, target, 2.0)
    agree = outside & (rough < np.percentile(rough[outside], 40)) if outside.sum() > 2000 else (rough < np.percentile(rough, 30))
    tile = match_tone(tile, target, agree)
    diff = difference(tile, target, 4.0)
    noise = np.percentile(diff[outside], 90) if outside.sum() > 2000 else np.percentile(diff[allowed], 50)
    changed = ((diff > max(noise * 1.5, 6.0)) & allowed).astype(np.uint8)
    changed = cv2.morphologyEx(changed, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    count, labels, stats, _ = cv2.connectedComponentsWithStats(changed)
    keep = np.zeros((h, w), np.uint8)
    for i in range(1, count):
        if stats[i, cv2.CC_STAT_AREA] >= max(60, int(allowed.sum() * 0.0015)):
            keep[labels == i] = 1
    keep = cv2.morphologyEx(keep, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25)))
    flood = keep.copy()
    cv2.floodFill(flood, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 1)
    keep = cv2.dilate(keep | (1 - flood), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (21, 21)))
    region = (keep > 0) | solid
    if subject:
        silhouette = cv2.dilate(cutout(tile, allowed).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31))) > 0
        region |= silhouette
    region &= allowed | solid
    edge = np.zeros((h, w), bool)
    edge[:4, :] = edge[-4:, :] = True
    edge[:, :4] = edge[:, -4:] = True
    region &= ~edge
    # what changed is the core; the cut around it runs where the piece and the canvas agree
    core = cv2.erode(region.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    extended = cv2.dilate((allowed | solid | region).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * margin + 1, 2 * margin + 1))) > 0
    extended &= ~edge
    old_marker = ~extended
    region = watershed_cut(difference(tile, target, 2.0), core, old_marker, band_prior(core, old_marker)) & extended
    region |= core
    blend_into(box, tile, region)
    outlines.append((box, region))


def shapes(h, w, origin, spec):
    ox, oy = origin
    m = np.zeros((h, w), np.uint8)
    for rx0, ry0, rx1, ry1 in (spec or {}).get("rects", []):
        m[max(0, ry0 - oy):max(0, ry1 - oy), max(0, rx0 - ox):max(0, rx1 - ox)] = 1
    for cx, cy, rx, ry in (spec or {}).get("ellipses", []):
        cv2.ellipse(m, (int(cx - ox), int(cy - oy)), (int(rx), int(ry)), 0, 0, 360, 1, -1)
    return m.astype(bool)


for layer in plan["layers"]:
    x0, y0, x1, y1 = layer["box"]
    tile = load(layer["image"], (x1 - x0, y1 - y0))
    x1, y1 = min(x1, W), min(y1, H)
    box = [x0, y0, x1, y1]
    tile = tile[: y1 - y0, : x1 - x0]
    if layer.get("fit"):
        tile = fit(tile, canvas[y0:y1, x0:x1], shapes(y1 - y0, x1 - x0, (x0, y0), layer["fit"]))
    if layer["kind"] == "grid":
        place_grid(tile, box)
        continue
    solid = shapes(y1 - y0, x1 - x0, (x0, y0), layer.get("solid"))
    allowed = shapes(y1 - y0, x1 - x0, (x0, y0), layer.get("allowed")) | solid
    place_object(tile, box, allowed, solid, layer["kind"] == "subject", margin=layer.get("margin", OBJECT_MARGIN))
    print(layer["image"], "replaced", int(outlines[-1][1].sum()), "px")

result = np.clip(canvas, 0, 255).astype(np.uint8)
Image.fromarray(result).save(resolve(plan["output"]))
if plan.get("overlay"):
    overlay = result.copy()
    for (bx0, by0, bx1, by1), region in outlines:
        contours, _ = cv2.findContours(region.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        cv2.drawContours(overlay[by0:by1, bx0:bx1], contours, -1, (255, 0, 255), 3)
    Image.fromarray(overlay).save(resolve(plan["overlay"]))
print("saved", resolve(plan["output"]))
