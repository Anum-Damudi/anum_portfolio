#!/usr/bin/env python3
"""
Splits a single-file portfolio (HTML + <style> + inline <script>s)
into a clean frontend/ folder.

Usage:
    python split_portfolio.py original.html
    python split_portfolio.py original.html my_output_folder
"""
import re
import sys
from pathlib import Path

src = Path(sys.argv[1] if len(sys.argv) > 1 else "original.html")
out = Path(sys.argv[2] if len(sys.argv) > 2 else "frontend")
html = src.read_text(encoding="utf-8")

(out / "css").mkdir(parents=True, exist_ok=True)
(out / "js").mkdir(parents=True, exist_ok=True)

# ---- 1. <style> blocks -> css/styles.css ---------------------------------
styles = re.findall(r"<style[^>]*>(.*?)</style>", html, flags=re.S | re.I)
(out / "css" / "styles.css").write_text(
    "\n\n".join(s.strip() for s in styles) + "\n", encoding="utf-8"
)
first = True


def style_repl(_m):
    global first
    if first:
        first = False
        return '<link rel="stylesheet" href="css/styles.css">'
    return ""


html = re.sub(r"<style[^>]*>.*?</style>", style_repl, html, flags=re.S | re.I)

# ---- 2. inline <script> blocks -> js/*.js (order preserved) --------------
# (matcher, filename). First match wins. Scripts with src= are left alone.
rules = [
    (lambda tag, body: "tailwind.config" in body, "tailwind-config.js"),
    (lambda tag, body: 'id="portfolio-enhancements-script"' in tag, "enhancements.js"),
    (lambda tag, body: 'id="minigame-enhancements-script"' in tag, "minigame.js"),
]
used = set()


def script_repl(m):
    tag, body = m.group(1), m.group(2)
    if re.search(r"\bsrc\s*=", tag):  # external script (Tailwind CDN, Lucide...)
        return m.group(0)
    if not body.strip():
        return m.group(0)
    name = "main.js"
    for test, fname in rules:
        if test(tag, body):
            name = fname
            break
    if name in used:  # safety: never overwrite
        name = f"extra-{len(used)}.js"
    used.add(name)
    (out / "js" / name).write_text(body.strip() + "\n", encoding="utf-8")
    return f'<script src="js/{name}"></script>'


html = re.sub(r"<script([^>]*)>(.*?)</script>", script_repl, html, flags=re.S | re.I)

(out / "index.html").write_text(html, encoding="utf-8")

print(f"Done! Created folder: {out}/")
for p in sorted(out.rglob("*")):
    if p.is_file():
        print("  ", p.relative_to(out), f"({p.stat().st_size:,} bytes)")
