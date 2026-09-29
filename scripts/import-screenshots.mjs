#!/usr/bin/env node
// Imports screenshots into public/images as optimised WebP, and records their
// sizes in lib/screenshots.json for the <Screenshot> component.
//
//   npm run screenshots              # import from $SCREENSHOTS_DIR or ../grounded-assets/screenshots
//   npm run screenshots:check        # list the slots still missing, import nothing
//
// Slots are defined in lib/screenshot-slots.json. A slot's image is
// <slot>.png (or .webp, .jpg) in the screenshots directory. Only use
// screenshots of the public demo instance: never screenshots of a real install.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const here = import.meta.dirname;
const slots = JSON.parse(readFileSync(join(here, '../lib/screenshot-slots.json'), 'utf8'));
const manifestPath = join(here, '../lib/screenshots.json');
const outDir = join(here, '../public/images');
const srcDir = resolve(process.env.SCREENSHOTS_DIR ?? join(here, '../../grounded-assets/screenshots'));
const checkOnly = process.argv.includes('--check');
const maxWidth = 1600;

const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
const findSource = (slot) =>
  ['png', 'webp', 'jpg', 'jpeg'].map((ext) => join(srcDir, `${slot}.${ext}`)).find((p) => existsSync(p));

if (checkOnly) {
  const missing = Object.keys(slots).filter((s) => !manifest[s]);
  const available = missing.filter((s) => findSource(s));
  console.log(`${Object.keys(slots).length} slots, ${Object.keys(slots).length - missing.length} imported.`);
  if (missing.length) console.log(`Missing:\n${missing.map((s) => `  ${s}${findSource(s) ? '  (available to import)' : ''}`).join('\n')}`);
  process.exit(available.length ? 1 : 0);
}

const { default: sharp } = await import('sharp');
mkdirSync(outDir, { recursive: true });
let imported = 0;
for (const slot of Object.keys(slots)) {
  const src = findSource(slot);
  if (!src) continue;
  const out = join(outDir, `${slot}.webp`);
  const info = await sharp(src)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(out);
  manifest[slot] = { src: `/images/${slot}.webp`, width: info.width, height: info.height };
  imported++;
  console.log(`${slot}: ${src} -> public/images/${slot}.webp (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KiB)`);
}
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`);
const missing = Object.keys(slots).filter((s) => !sorted[s]);
console.log(`\n${imported} imported from ${srcDir}. ${missing.length} slot(s) still missing${missing.length ? `: ${missing.join(', ')}` : ''}.`);
