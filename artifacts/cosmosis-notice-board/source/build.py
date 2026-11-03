#!/usr/bin/env python3
"""Build the combined A4 PDF and four five-page sets; no web or DB calls."""
from pathlib import Path
import json
from boardkit import render, OUT
import architecture, database, workflows, ui

groups=[('01-application-architecture',architecture.PAGES),
        ('02-database-schemas',database.PAGES),
        ('03-core-workflows',workflows.PAGES),
        ('04-ui-design',ui.PAGES)]

pages=[]
manifest=[]
for group,functions in groups:
    items=[]
    for fn in functions:
        num=len(pages)+1
        items.append((num,fn)); pages.append((num,fn))
    warnings,texts=render(items,OUT/f'Cosmosis-{group}-A4.pdf')
    manifest.append(dict(file=f'Cosmosis-{group}-A4.pdf',pages=len(items),boards=[n for n,_ in items]))

warnings,texts=render(pages,OUT/'Cosmosis-complete-notice-board-A4-20-pages.pdf')
(OUT/'source/layout-check.json').write_text(json.dumps(dict(warnings=warnings,text=texts),indent=2))
(OUT/'source/manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(dict(pages=len(pages),warnings=warnings,outputs=manifest),indent=2))
if warnings: raise SystemExit('Layout warnings need review before handoff.')
