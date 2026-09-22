import hashlib
import json
from pathlib import Path
import sys

from PIL import Image

source = Path(sys.argv[1])
destination = Path(sys.argv[2])
destination.mkdir(parents=True, exist_ok=True)
Image.MAX_IMAGE_PIXELS = None

with Image.open(source) as rendered:
  rendered.load()
  width, height = rendered.size
  tile_width = min(1536, width)
  tile_height = min(1200, height)
  step_x = max(1, tile_width * 3 // 4)
  step_y = max(1, tile_height * 3 // 4)
  columns = set(range(0, width - tile_width + 1, step_x))
  rows = set(range(0, height - tile_height + 1, step_y))
  columns.add(width - tile_width)
  rows.add(height - tile_height)
  tiles = []

  for row, top in enumerate(sorted(rows)):
    for column, left in enumerate(sorted(columns)):
      bounds = [left, top, left + tile_width, top + tile_height]
      name = f'native-r{row:02d}-c{column:02d}.png'
      target = destination / name
      rendered.crop(bounds).save(target)
      tiles.append({'bounds': bounds, 'file': name, 'sha256': hashlib.sha256(target.read_bytes()).hexdigest()})

  overview = rendered.copy()
  overview.thumbnail((1536, 1024), Image.Resampling.LANCZOS)
  overview.save(destination / 'overview.png')

index = {
  'dimensions': [width, height],
  'source': str(source.resolve()),
  'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
  'tiles': tiles,
}
(destination / 'index.json').write_text(json.dumps(index, indent=2) + '\n', encoding='utf-8')
print(f'Prepared {len(tiles)} native crops. Creation does not establish examination.')
