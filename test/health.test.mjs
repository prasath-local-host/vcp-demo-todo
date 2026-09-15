import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
// The endpoint has no imports or TypeScript-only syntax, so execute its actual source.
const source = await readFile(new URL('../app/api/health/route.ts', import.meta.url), 'utf8');
const health = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
test('health returns the deployed revision at request time, not at build time', async () => {
  const previous = process.env.VCP_SOURCE_REVISION;
  try {
    delete process.env.VCP_SOURCE_REVISION;
    assert.equal((await health.GET().json()).revision, 'local');
    process.env.VCP_SOURCE_REVISION = 'a'.repeat(40);
    assert.deepEqual(await health.GET().json(), { status: 'ok', revision: 'a'.repeat(40) });
    process.env.VCP_SOURCE_REVISION = 'b'.repeat(40);
    assert.equal((await health.GET().json()).revision, 'b'.repeat(40));
  } finally {
    if (previous === undefined) delete process.env.VCP_SOURCE_REVISION;
    else process.env.VCP_SOURCE_REVISION = previous;
  }
});
