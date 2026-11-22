// Entry program for the make.fun bounty "Post a GTA 6 meme on X" (gta6-meme-x-01).
//
// The entry itself is the X post; this program's only job is to hand the
// grader the post's address: it copies POST.json from the repository root
// into the output directory, where the house reads it, fetches the post
// from X and builds the dossier the judge sees. Nothing else is written.
//
// Local dry run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');

// Fail loudly on a malformed post file instead of handing the gate junk.
const parsed = JSON.parse(readFileSync(source, 'utf8')) as { url?: unknown };
if (typeof parsed.url !== 'string' || !parsed.url.includes('/status/')) {
  console.error(`POST.json in ${botDir} does not name an X post`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, target);

// Read the copy back: the gate trusts this file with the whole entry, so
// confirm what landed in the output directory before calling it done.
const landed = JSON.parse(readFileSync(target, 'utf8')) as { url?: unknown };
if (landed.url !== parsed.url) {
  console.error(`copied POST.json does not match the repository one`);
  process.exit(1);
}
console.log(`POST.json copied to ${target} (${statSync(target).size} bytes): ${parsed.url}`);
