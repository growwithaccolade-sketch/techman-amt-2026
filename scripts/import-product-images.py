#!/usr/bin/env python3
import io, json, os, re, sys
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCES = json.loads((ROOT / "scripts/product-image-sources.json").read_text())
OUT = ROOT / "public/products"
OUT.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
}

def fetch_bytes(url: str):
    session = requests.Session()
    r = session.get(url, headers=HEADERS, timeout=35, allow_redirects=True)
    r.raise_for_status()
    ctype = (r.headers.get("content-type") or "").lower()
    data = r.content

    if "text/html" in ctype or data[:64].lower().find(b"<html") >= 0:
        html = r.text
        patterns = [
            r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)',
            r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
            r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)',
        ]
        image_url = None
        for pattern in patterns:
            m = re.search(pattern, html, flags=re.I)
            if m:
                image_url = urljoin(r.url, m.group(1).replace("&amp;", "&"))
                break
        if not image_url:
            raise RuntimeError(f"No social product image found on {url}")
        ir = session.get(image_url, headers={**HEADERS, "Referer": r.url}, timeout=35, allow_redirects=True)
        ir.raise_for_status()
        return ir.content, image_url
    return data, r.url

def to_webp(data: bytes, path: Path):
    with Image.open(io.BytesIO(data)) as im:
        im.load()
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
        if im.mode == "RGBA":
            base = Image.new("RGB", im.size, "white")
            base.paste(im, mask=im.getchannel("A"))
            im = base
        else:
            im = im.convert("RGB")

        contained = ImageOps.contain(im, (1200, 1200), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (1200, 1200), "white")
        x = (1200 - contained.width) // 2
        y = (1200 - contained.height) // 2
        canvas.paste(contained, (x, y))
        canvas.save(path, "WEBP", quality=88, method=6)

failed = []
done = []
for slug, url in SOURCES.items():
    try:
        data, final_url = fetch_bytes(url)
        out = OUT / f"{slug}.webp"
        to_webp(data, out)
        done.append((slug, str(out.relative_to(ROOT)), final_url))
        print(f"OK {slug} -> {out.name}")
    except Exception as exc:
        failed.append((slug, url, str(exc)))
        print(f"FAIL {slug}: {exc}", file=sys.stderr)

if failed:
    print("\nFAILED DOWNLOADS:", file=sys.stderr)
    for slug, url, err in failed:
        print(f"- {slug}: {err} :: {url}", file=sys.stderr)
    sys.exit(2)

products_path = ROOT / "lib/products.ts"
text = products_path.read_text()
for slug in SOURCES:
    block_re = re.compile(r'(slug:\s*"' + re.escape(slug) + r'"[\s\S]*?image:\s*)"[^"]*"')
    text, count = block_re.subn(r'\1"/products/' + slug + r'.webp"', text, count=1)
    if count != 1:
        raise RuntimeError(f"Could not rewrite image for {slug}")
products_path.write_text(text)

print(f"\nImported {len(done)} real product images and rewired lib/products.ts")
