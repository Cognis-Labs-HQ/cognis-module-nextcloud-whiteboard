import assert from 'node:assert/strict';
import test from 'node:test';
import { Readable } from 'node:stream';
import { readJson } from '../reuse/http.js';

test('readJson parses a bounded JSON request', async () => {
  const request = Readable.from(['{"title":"hello"}']);
  assert.deepEqual(await readJson(request), { title: 'hello' });
});

test('readJson rejects invalid JSON', async () => {
  await assert.rejects(readJson(Readable.from(['{'])), /invalid_json/);
});
