import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const manifest = JSON.parse(
  await readFile(new URL('../manifest.json', import.meta.url), 'utf8'),
);

test('module manifest declares its supplied whiteboard capabilities', () => {
  assert.deepEqual(manifest.capabilities, [
    'whiteboard:collaboration',
    'whiteboard:access-control',
    'whiteboard:getEmbedUrl',
    'whiteboard:fetchBoardData',
  ]);
});

test('module manifest requires the profile adapter and share gateway', () => {
  assert.deepEqual(manifest.requires, [
    '4387fae9-26dd-5a80-84b2-e5f4833b7fb9',
    '0da92508-63fa-53ed-918c-e6f08692a382',
  ]);
});
