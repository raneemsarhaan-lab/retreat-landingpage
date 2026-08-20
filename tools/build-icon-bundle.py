#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the icon handover bundle from assets/icons/*.svg.

Produces, from the currentColor source files:

    assets/icons/orange/       19 SVG, #F5AE2B
    assets/icons/white/        19 SVG, #FFFFFF
    assets/icons/png/orange/   19 PNG, 512x512, transparent
    assets/icons/png/white/    19 PNG, 512x512, transparent
    strategy-retreat-icons.zip the four folders plus a README, for handover

The PNGs are rendered with the Chromium that Playwright installs, so run
`npm install playwright` first if node_modules is missing. Everything else
is standard library.

Usage:  python3 tools/build-icon-bundle.py
"""

import io
import os
import re
import shutil
import subprocess
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
SRC = os.path.join(REPO, 'assets', 'icons')
ZIP = os.path.join(REPO, 'strategy-retreat-icons.zip')
BUNDLE = 'strategy-retreat-icons'

COLOURS = [('orange', '#F5AE2B'), ('white', '#FFFFFF')]
PNG_SIZE = 512
CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'


def source_icons():
    names = sorted(
        os.path.splitext(f)[0] for f in os.listdir(SRC) if f.endswith('.svg'))
    if not names:
        sys.exit('no source icons in %s' % SRC)
    return names


def write_colour_svgs(names):
    for folder, hexv in COLOURS:
        out = os.path.join(SRC, folder)
        if not os.path.isdir(out):
            os.makedirs(out)
        for n in names:
            svg = io.open(os.path.join(SRC, n + '.svg'), encoding='utf-8').read()
            svg = svg.replace('stroke="currentColor"', 'stroke="%s"' % hexv)
            svg = svg.replace('fill="currentColor"', 'fill="%s"' % hexv)
            if 'currentColor' in svg:
                sys.exit('%s: unreplaced currentColor' % n)
            io.open(os.path.join(out, n + '.svg'), 'w', encoding='utf-8').write(svg)
        print('  svg/%s  %d icons' % (folder, len(names)))


RASTERIZE_JS = r"""
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const [srcRoot, outRoot, size] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: %(chromium)r });
  for (const colour of ['orange', 'white']) {
    const src = path.join(srcRoot, colour);
    const out = path.join(outRoot, colour);
    fs.mkdirSync(out, { recursive: true });
    for (const f of fs.readdirSync(src).filter(f => f.endsWith('.svg'))) {
      const svg = fs.readFileSync(path.join(src, f), 'utf8')
        .replace('width="24" height="24"', `width="${size}" height="${size}"`);
      const p = await b.newPage({ viewport: { width: +size, height: +size } });
      await p.setContent(
        `<style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>${svg}`);
      await p.screenshot({ path: path.join(out, f.replace('.svg', '.png')), omitBackground: true });
      await p.close();
    }
  }
  await b.close();
})();
""" % {'chromium': CHROMIUM}


def write_pngs():
    script = os.path.join(REPO, '.icon-rasterize.js')
    io.open(script, 'w', encoding='utf-8').write(RASTERIZE_JS)
    try:
        subprocess.check_call(
            ['node', script, SRC, os.path.join(SRC, 'png'), str(PNG_SIZE)], cwd=REPO)
    finally:
        os.remove(script)
    for folder, _ in COLOURS:
        n = len(os.listdir(os.path.join(SRC, 'png', folder)))
        print('  png/%s  %d icons at %dpx' % (folder, n, PNG_SIZE))


def readme_text():
    """Plain-text README for the zip, with the usage table read from README.md."""
    md = io.open(os.path.join(SRC, 'README.md'), encoding='utf-8').read()
    uses = re.findall(r'\| `([^`]+\.svg)` \| ([^|]+?) \|', md)
    width = max(len(n) for n, _ in uses)
    lines = [
        'THE STRATEGY RETREAT 2026 - ICON SET',
        '====================================',
        '',
        '%d icons, in orange and in white, as SVG and as PNG.' % len(uses),
        '',
        'FOLDERS',
        '  svg/orange   %d SVG, colour #F5AE2B' % len(uses),
        '  svg/white    %d SVG, colour #FFFFFF' % len(uses),
        '  png/orange   %d PNG, %d x %d, transparent background' % (len(uses), PNG_SIZE, PNG_SIZE),
        '  png/white    %d PNG, %d x %d, transparent background' % (len(uses), PNG_SIZE, PNG_SIZE),
        '',
        'WHICH TO USE',
        '  SVG for anything on screen or in print - it stays sharp at any size and',
        '  is what the website itself uses. PNG for tools that will not take an SVG',
        '  (PowerPoint, Word, most social schedulers). The white PNGs look blank in',
        '  a file browser because the background is transparent; drop one on a dark',
        '  slide and it appears.',
        '',
        'HOW THEY ARE DRAWN',
        '  24 x 24 grid. Outline icons use a 1.7 stroke with round caps and joins;',
        '  two are solid instead (sparkle, play). Same grid and same weight across',
        '  the set, which is what makes them read as one family at any size.',
        '',
        'COLOURS',
        '  Orange  #F5AE2B   the retreat gold, used on light and on navy',
        '  White   #FFFFFF   for navy and photographic backgrounds only',
        '  Do not recolour them to anything else, and do not add a drop shadow or',
        '  an outline - the set is built to sit flat on its background.',
        '',
        'DO NOT SUBSTITUTE',
        '  No icon library is used anywhere on the site. If a new icon is needed,',
        '  it should be drawn on this same grid at this same weight rather than',
        '  pulled from Font Awesome, Material or similar - a library icon will not',
        '  match and it shows immediately when they sit in a row.',
        '',
        'THE SET',
    ]
    for name, use in uses:
        lines.append('  %-*s  %s' % (width, name, use))
    lines += ['', '%d icons. Generated from assets/icons/ in the landing page '
                  'repository.' % len(uses), '']
    return '\r\n'.join(lines)


def write_zip():
    entries = []
    for colour, _ in COLOURS:
        for kind, folder in (('svg', os.path.join(SRC, colour)),
                             ('png', os.path.join(SRC, 'png', colour))):
            for f in sorted(os.listdir(folder)):
                entries.append((os.path.join(folder, f),
                                '%s/%s/%s/%s' % (BUNDLE, kind, colour, f)))
    with zipfile.ZipFile(ZIP, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr(BUNDLE + '/README.txt', readme_text())
        for src, arc in entries:
            z.write(src, arc)
    print('  %s  %d files, %d KB'
          % (os.path.basename(ZIP), len(entries) + 1, os.path.getsize(ZIP) // 1024))


if __name__ == '__main__':
    icons = source_icons()
    print('%d source icons' % len(icons))
    write_colour_svgs(icons)
    write_pngs()
    write_zip()
