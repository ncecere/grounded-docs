#!/usr/bin/env node
// Refreshes openapi/grounded.yaml from the Grounded repository.
//
//   npm run sync:openapi                     # from ../golang/grounded, or $GROUNDED_REPO
//   npm run sync:openapi -- v0.2.1           # from GitHub, at a tag or commit
//
// The docs describe one Grounded release: sync the spec from that release's tag.
import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const target = new URL('../openapi/grounded.yaml', import.meta.url).pathname;
const ref = process.argv[2];

if (ref) {
  const url = `https://raw.githubusercontent.com/ncecere/grounded/${encodeURIComponent(ref)}/api/openapi.yaml`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`GET ${url}: ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  writeFileSync(target, await res.text());
  console.log(`openapi/grounded.yaml <- ${url}`);
} else {
  const repo = resolve(process.env.GROUNDED_REPO ?? join(import.meta.dirname, '../../golang/grounded'));
  const source = join(repo, 'api/openapi.yaml');
  if (!existsSync(source)) {
    console.error(`${source} not found. Set GROUNDED_REPO, or pass a tag: npm run sync:openapi -- v0.2.1`);
    process.exit(1);
  }
  copyFileSync(source, target);
  console.log(`openapi/grounded.yaml <- ${source}`);
}
console.log('Review the diff, then rebuild: the API reference is generated from it at build time.');
