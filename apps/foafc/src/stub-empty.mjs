/*
 * Stand-in for `rolldown` in the output bundles. See the alias in
 * astro.config.mjs.
 *
 * @astrojs/vercel's build-time Edge Middleware generator imports rolldown, and
 * reaches the runtime bundle through the adapter's barrel file. It is never
 * called at runtime — this site has no middleware — but an ESM import is
 * resolved eagerly, so the unresolvable native binding crashed every request.
 *
 * Throwing here rather than returning undefined means that if a future change
 * does call it at runtime, it fails loudly instead of misbehaving quietly.
 */
export function rolldown() {
  throw new Error(
    'rolldown was called at runtime. It is a build-time dependency stubbed out ' +
      'in astro.config.mjs; see the comment there.',
  );
}

export default { rolldown };
