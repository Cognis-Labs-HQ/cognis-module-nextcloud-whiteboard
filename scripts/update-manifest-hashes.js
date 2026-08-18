import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const manifest = JSON.parse(await readFile('manifest.json', 'utf8'));
const paths = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
  .trim().split('\n').filter((path) => path && path !== 'manifest.json').sort();
manifest.files = await Promise.all(paths.map(async (path) => ({
  path,
  sha256: createHash('sha256').update(await readFile(path)).digest('hex'),
})));
await writeFile('manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
