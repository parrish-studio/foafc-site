/*
 * Post-build smoke check: can the serverless function actually be loaded?
 *
 * A build can succeed while producing a function that throws the moment Vercel
 * imports it — ESM resolves imports eagerly, so one unresolvable module in the
 * graph takes down every request, with nothing visible until deploy. That
 * happened once already (see "Known wrinkles" in the README), so this runs as
 * part of `build` and fails the deploy rather than shipping a broken function.
 *
 * It also reports when the upstream bug behind the rolldown stub looks fixed,
 * so the workaround can be retired instead of lingering forever.
 */

import { createRequire } from 'node:module';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const appRoot = new URL('../', import.meta.url);
const functionRoot = new URL('.vercel/output/functions/_render.func/', appRoot);
const entry = new URL('apps/foafc/.vercel/output/server/entry.mjs', functionRoot);

const exists = async (url) => access(url).then(() => true, () => false);

if (!(await exists(entry))) {
  // A fully static build emits no function. Nothing to check.
  console.log('verify-build: no serverless function emitted, skipping.');
  process.exit(0);
}

try {
  await import(entry.href);
  console.log('verify-build: serverless entry imports cleanly.');
} catch (error) {
  console.error('\nverify-build: THE SERVERLESS FUNCTION CANNOT BE LOADED.');
  console.error('Every request to a server-rendered route would fail with');
  console.error('FUNCTION_INVOCATION_FAILED. Not deploying this.\n');
  console.error(error);
  process.exit(1);
}

// Is the rolldown workaround still needed?
try {
  const require = createRequire(fileURLToPath(appRoot));
  const adapterMiddleware = require.resolve('@astrojs/vercel/dist/serverless/middleware.js');
  const source = await readFile(adapterMiddleware, 'utf8');
  if (!/from ["']rolldown["']/.test(source)) {
    console.log(
      'verify-build: @astrojs/vercel no longer imports rolldown in its ' +
        'build-time middleware module. The stub in astro.config.mjs and ' +
        'src/stub-rolldown.mjs can probably be removed — try it.',
    );
  }
} catch {
  // Adapter internals moved or are unreadable; not worth failing a build over.
}
