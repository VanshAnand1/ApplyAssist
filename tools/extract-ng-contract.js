#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distRoot = join(__dirname, '..', 'dist', 'client');
const indexPath = join(distRoot, 'index.html');

if (!existsSync(indexPath)) {
  console.warn(
    '[extract-ng-contract] Skipping: dist/client/index.html not found. Run the build before this script.'
  );
  process.exit(0);
}

const html = readFileSync(indexPath, 'utf8');
const marker = 'id="ng-event-dispatch-contract"';

if (html.includes('src="/assets/ng-event-dispatch-contract.js"')) {
  console.log(
    '[extract-ng-contract] Inline script already extracted. No changes needed.'
  );
  process.exit(0);
}

const markerIndex = html.indexOf(marker);
if (markerIndex === -1) {
  console.log(
    '[extract-ng-contract] No inline ng-event dispatch contract found. Nothing to extract.'
  );
  process.exit(0);
}

const scriptStart = html.lastIndexOf('<script', markerIndex);
const scriptEnd = html.indexOf('</script>', markerIndex);

if (scriptStart === -1 || scriptEnd === -1) {
  console.error(
    '[extract-ng-contract] Failed to locate script boundaries for ng-event dispatch contract.'
  );
  process.exit(1);
}

const scriptClose = scriptEnd + '</script>'.length;
const scriptBlock = html.slice(scriptStart, scriptClose);
const inlineContent = html
  .slice(html.indexOf('>', scriptStart) + 1, scriptEnd)
  .trim();

if (!inlineContent) {
  console.log(
    '[extract-ng-contract] Inline ng-event dispatch contract is empty. Nothing to extract.'
  );
  process.exit(0);
}

const assetsDir = join(distRoot, 'assets');
if (!existsSync(assetsDir)) {
  mkdirSync(assetsDir, { recursive: true });
}

const outputFilename = 'ng-event-dispatch-contract.js';
const outputPath = join(assetsDir, outputFilename);
writeFileSync(outputPath, `${inlineContent}\n`, 'utf8');

const replacementTag =
  '<script id="ng-event-dispatch-contract" type="text/javascript" src="/assets/ng-event-dispatch-contract.js"></script>';
const updatedHtml = html.replace(scriptBlock, replacementTag);
writeFileSync(indexPath, `${updatedHtml}\n`, 'utf8');

console.log(
  `[extract-ng-contract] Extracted ng-event dispatch contract to assets/${outputFilename}.`
);
