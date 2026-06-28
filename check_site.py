#!/usr/bin/env python3
"""MBH site consistency checker — run from the Light Theme - Final Design folder."""
import os, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
TOOLS = ["quote.html","print-quote.html","night-light.html","engrave-preview.html"]
PAGES = glob.glob(os.path.join(ROOT,"*.html"))

PASS="\033[32mOK\033[0m"; FAIL="\033[31mFAIL\033[0m"
errors = 0

def check(label, ok):
    global errors
    print(f"  {'  OK' if ok else 'FAIL'}  {label}")
    if not ok: errors += 1

print("\n=== MBH Site Checker ===\n")

for page in sorted(PAGES):
    name = os.path.basename(page)
    with open(page, encoding="utf-8") as f:
        c = f.read()

    # Skip non-tool pages that intentionally omit site chrome
    is_tool = name in TOOLS or name in ("owner.html","review.html")
    is_site_page = name not in ("review.html","owner.html","palette-explorer.html","logos.html")

    print(f"[{name}]")

    if name in TOOLS:
        check("theme.css linked",       '<link rel="stylesheet" href="theme.css">' in c)
        check("site-header div",        'id="site-header"' in c)
        check("site-footer div",        'id="site-footer"' in c)
        check("site.js loaded",         'src="site.js"' in c)
        check("no old --panel conflict",'--panel:#FCF8F2' not in c)

    # Curly quotes in <script> blocks used as string delimiters (JS parse error risk)
    # Contractions like isn't / Here's are safe — skip \w'\w patterns
    scripts = re.findall(r'<script(?![^>]*src)[^>]*>(.*?)</script>', c, re.DOTALL)
    for i, s in enumerate(scripts):
        stripped = re.sub(r"\w[‘’]\w", "", s)  # remove safe contractions
        bad = [ch for ch in ['‘','’','“','”'] if ch in stripped]
        check(f"no curly-quote delimiters in inline script #{i+1}", not bad)

    # Broken internal hrefs
    hrefs = re.findall(r'href="([^"#:]+\.html)"', c)
    for h in set(hrefs):
        exists = os.path.isfile(os.path.join(ROOT, h))
        check(f"linked file exists: {h}", exists)

    print()

# Check TOOLS array in site.js matches actual files
print("[site.js]")
sjs = open(os.path.join(ROOT,"site.js"), encoding="utf-8").read()
tool_hrefs = re.findall(r'href:\s*"([^"]+\.html)"', sjs)
for h in tool_hrefs:
    exists = os.path.isfile(os.path.join(ROOT, h))
    check(f"TOOLS entry file exists: {h}", exists)

print()
if errors:
    print(f"\033[31m{errors} issue(s) found.\033[0m\n")
else:
    print("\033[32mAll checks passed.\033[0m\n")
