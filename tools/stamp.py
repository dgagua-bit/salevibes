#!/usr/bin/env python3
"""Stamp a release version on every page, so visitors get the new version right away and never a mix.

GitHub Pages lets browsers keep files for 10 minutes. Without a version on the file names, a visitor right after a
release can get new pages with old scripts (or the other way round) and see a broken page until they refresh.

What it does in every *.html at the site root:
  - assets/css/*.css and assets/js/*.js links get ?v=<version>;
  - an import map (placed before the first module script) sends every module import (./assets/js/x.js) to
    x.js?v=<version>, so all modules of a page load from the same release.
Running it again replaces the previous stamp. Version = UTC time (YYYYMMDDHHMM) unless given.

Run before each release:   python3 tools/stamp.py
"""
import glob
import json
import os
import re
import sys
import time

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
version = sys.argv[1] if len(sys.argv) > 1 else time.strftime("%Y%m%d%H%M", time.gmtime())
if not re.fullmatch(r"\w+", version):
    sys.exit("version must be letters/digits")

modules = sorted(os.path.relpath(p, root).replace(os.sep, "/") for p in glob.glob(os.path.join(root, "assets/js/**/*.js"), recursive=True))
import_map = '<script type="importmap" data-stamp>' + json.dumps({"imports": {f"./{m}": f"./{m}?v={version}" for m in modules}}, separators=(",", ":")) + "</script>\n"

changed = 0
for page in sorted(glob.glob(os.path.join(root, "*.html"))):
    with open(page, encoding="utf-8") as f:
        s = original = f.read()
    s = re.sub(r'(href="assets/css/[\w./-]+\.css)(\?v=\w+)?"', rf'\1?v={version}"', s)
    s = re.sub(r'(src="assets/js/[\w./-]+\.js)(\?v=\w+)?"', rf'\1?v={version}"', s)
    s = re.sub(r'<script type="importmap" data-stamp>.*?</script>\n?', "", s, flags=re.S)
    first_module = s.find('<script type="module"')
    if first_module >= 0:
        s = s[:first_module] + import_map + s[first_module:]
    if s != original:
        with open(page, "w", encoding="utf-8") as f:
            f.write(s)
        changed += 1
print(f"stamped {changed} pages with v={version} ({len(modules)} modules)")
