import assert from 'node:assert/strict';
import test from 'node:test';
import { ShowcaseStore } from '../store.js';

test('store creates its schema and scopes lists to an owner', async () => {
  const calls = [];
  const database = {
    async ensureTable(definition) { calls.push(['schema', definition]); },
    async executeCommand(command) {
      calls.push(['command', command]);
      return { rows: [{ id: 'one', title: 'Read contracts', created_at: '2026-01-01' }] };
    },
  };
  const store = new ShowcaseStore(database);
  await store.ensureSchema();
  const items = await store.list('account-1');
  assert.equal(calls[0][1].name, 'module_template_items');
  assert.deepEqual(calls[1][1].where, [{ column: 'owner_id', value: 'account-1' }]);
  assert.equal(items[0].title, 'Read contracts');
});
