import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const locales = ['en', 'de', 'id', 'ja'];

test('locale files have matching keys', async () => {
  const keySets = await Promise.all(locales.map(async (locale) => {
    const xml = await readFile(new URL(`../languages/${locale}/strings.xml`, import.meta.url), 'utf8');
    return [...xml.matchAll(/name="([^"]+)"/g)].map((match) => match[1]).sort();
  }));
  for (const keys of keySets.slice(1)) assert.deepEqual(keys, keySets[0]);
});

test('browser code avoids full-page navigation APIs', async () => {
  const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /window\.location\.(?:href|replace|reload)/);
});
