import assert from 'node:assert/strict';
import test from 'node:test';
import { registerCommands } from '../index.js';

test('CLI registers list and create commands', () => {
  const commands = [];
  registerCommands({ register: (name) => commands.push(name), apiGet() {}, apiPost() {} });
  assert.deepEqual(commands, ['module-template:list', 'module-template:create']);
});
