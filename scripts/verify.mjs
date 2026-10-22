#!/usr/bin/env node
/*
 * Repo invariants — the checks that were being run by hand, one grep at a time.
 *
 * Each of these has already caught a real bug in this project at least once.
 * `tsc` and `astro check` cover types; this covers the rules that live in
 * CLAUDE.md and in the shape of the repo, which no type checker can see.
 *
 * Run it with `pnpm verify`. It needs a build on disk for the rendered-text
 * check; that one is skipped with a notice if `dist/` is absent.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const failures = [];
const notes = [];

function fail(check, file, line, message) {
  failures.push({ check, where: line ? `${file}:${line}` : file, message });
}

function gitList(...args) {
  return execFileSync('git', [...args, '-z'], { cwd: root, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean);
}

/** Every file git tracks, so build output and node_modules stay out of scope. */
const tracked = gitList('ls-files');

/*
 * Tracked files plus anything untracked that is not ignored — the set that
 * could reach a commit. Only the secret scan uses this: a key in a file you
 * have not added yet is still one `git add .` away from a public repo.
 */
const committable = [...tracked, ...gitList('ls-files', '--others', '--exclude-standard')];

const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.mjs', '.cjs', '.astro', '.css', '.json',
  '.md', '.mdoc', '.mdx', '.html', '.yml', '.yaml', '.txt',
]);

const textFiles = tracked.filter((f) => TEXT_EXTENSIONS.has(path.extname(f)));

/** Read a tracked file, or null if it is binary or unreadable. */
function read(relative) {
  try {
    return readFileSync(path.join(root, relative), 'utf8');
  } catch {
    return null;
  }
}

function eachLine(relative, fn) {
  const text = read(relative);
  if (text === null) return;
  text.split('\n').forEach((line, i) => fn(line, i + 1));
}

// ---------------------------------------------------------------------------
// 1. "A Fierce Chase" — capital A, always.
//
// The A is an initial, not an article. It reads like a typo, so it keeps
// getting "corrected" — by people and by autocorrect alike.
// Docs are exempt: they quote the prototype and the logo guide, both of which
// get this wrong, and quoting them accurately is the point.
// ---------------------------------------------------------------------------
{
  const inScope = (f) => f.startsWith('apps/') || f.startsWith('packages/');
  const lowercaseA = /\ba fierce chase\b/i;

  for (const file of textFiles.filter(inScope)) {
    eachLine(file, (line, n) => {
      const match = line.match(lowercaseA);
      if (match && match[0][0] === 'a') {
        fail('capital-A', file, n, `"${match[0]}" — the A is an initial, capitalise it`);
      }
    });
  }
}

// ---------------------------------------------------------------------------
// 2. Package boundaries (CLAUDE.md, non-negotiable rules 1 and 2).
//
// Packages are written as if they had already been extracted to their own
// repo. A reference to the app is the one mistake that makes that untrue, and
// it compiles fine right up until the day someone tries the extraction.
// ---------------------------------------------------------------------------
{
  const packageFiles = tracked.filter((f) => f.startsWith('packages/'));

  for (const file of packageFiles) {
    if (path.extname(file) === '.astro') {
      fail('boundary', file, null, 'no .astro inside packages — UI layers are React');
    }
  }

  const reachesOut = /from\s+['"](\.\.\/)*apps\/|from\s+['"]@foafc\/|require\(['"]@foafc\//;
  for (const file of packageFiles.filter((f) => TEXT_EXTENSIONS.has(path.extname(f)))) {
    eachLine(file, (line, n) => {
      const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
      if (reachesOut.test(code)) {
        fail('boundary', file, n, 'packages must not import from apps');
      }
    });
  }
}

// ---------------------------------------------------------------------------
// 3. No hard-coded colours outside packages/tokens.
//
// A client reskin is meant to be a token-file swap and nothing else. One
// stray hex in a component is all it takes for that to stop being true.
// ---------------------------------------------------------------------------
{
  const inScope = (f) =>
    (f.startsWith('apps/') || f.startsWith('packages/')) &&
    !f.startsWith('packages/tokens/') &&
    ['.css', '.astro', '.tsx', '.ts'].includes(path.extname(f));

  const hex = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/;

  for (const file of textFiles.filter(inScope)) {
    eachLine(file, (line, n) => {
      // Comments explain the tokens; they are not what ships to the browser.
      const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
      const match = code.match(hex);
      if (match) {
        fail('tokens', file, n, `hard-coded colour ${match[0]} — use a token`);
      }
    });
  }
}

// ---------------------------------------------------------------------------
// 4. Secrets. The repo is public because Vercel's Hobby plan requires it.
// ---------------------------------------------------------------------------
{
  const patterns = [
    [/\bghp_[A-Za-z0-9]{20,}/, 'GitHub personal access token'],
    [/\bgithub_pat_[A-Za-z0-9_]{20,}/, 'GitHub fine-grained token'],
    [/\bsk_live_[A-Za-z0-9]{10,}/, 'Stripe live key'],
    [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key id'],
    [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private key'],
  ];

  const scannable = committable.filter((f) => TEXT_EXTENSIONS.has(path.extname(f)));
  for (const file of scannable) {
    if (file === 'scripts/verify.mjs') continue; // the patterns live here
    eachLine(file, (line, n) => {
      for (const [pattern, what] of patterns) {
        if (pattern.test(line)) fail('secrets', file, n, `looks like a ${what}`);
      }
    });
  }

  for (const file of committable) {
    const name = path.basename(file);
    if (name === '.env' || (name.startsWith('.env.') && !name.endsWith('.example'))) {
      fail('secrets', file, null, 'environment file is tracked — it should not be');
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Trail data parses.
//
// The parser is the gate between the data file and the pages. Running it here
// means a bad edit fails fast and with a path, rather than at build time.
// ---------------------------------------------------------------------------
{
  try {
    const { parseTrailSystem } = await import('../packages/module-trails/src/core/parse.ts');
    parseTrailSystem(JSON.parse(read('packages/module-trails/data/trails.json')));
  } catch (error) {
    if (error?.code === 'ERR_UNKNOWN_FILE_EXTENSION' || error?.code === 'ERR_MODULE_NOT_FOUND') {
      notes.push('trail data: skipped — this Node cannot import TypeScript directly');
    } else {
      fail('trail-data', 'packages/module-trails/data/trails.json', null, String(error.message ?? error));
    }
  }
}

// ---------------------------------------------------------------------------
// 6. Rendered text, for the whitespace Astro eats.
//
// Astro drops the newline between a line of text and an expression on the next
// line, so `the\n{ORG.shortName}` renders as "theA Fierce Chase". It is
// invisible in the source and obvious on the page. This looks for the symptom
// in the built HTML instead: a word running straight into a capital, a digit
// or punctuation-then-letter.
// ---------------------------------------------------------------------------
{
  const dist = path.join(root, 'apps/foafc/dist/client');
  if (!existsSync(dist)) {
    notes.push('rendered text: skipped — no build found, run `pnpm build` first');
  } else {
    // Words that legitimately run letters together. Keep this short: every
    // entry here is a check that no longer runs.
    const allowed = [/PayPal/g, /GitHub/g, /YouTube/g, /OpenStreetMap/g, /JavaScript/g];
    const suspicious = /[a-z]{2,}(?:[A-Z][a-z]|\d|[:;,.][A-Za-z])/g;

    const { globSync } = await import('node:fs');
    for (const file of globSync('**/*.html', { cwd: dist })) {
      let text = readFileSync(path.join(dist, file), 'utf8')
        .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;|&#\d+;/gi, ' ');
      for (const word of allowed) text = text.replace(word, ' ');

      for (const match of text.matchAll(suspicious)) {
        fail('rendered-text', `apps/foafc/dist/client/${file}`, null,
          `"${match[0]}" — missing space, probably swallowed by an Astro expression`);
      }
    }
  }
}

// ---------------------------------------------------------------------------

for (const note of notes) console.log(`  · ${note}`);

if (failures.length === 0) {
  console.log(`verify: ${tracked.length} tracked files, no problems found.`);
  process.exit(0);
}

const byCheck = new Map();
for (const failure of failures) {
  if (!byCheck.has(failure.check)) byCheck.set(failure.check, []);
  byCheck.get(failure.check).push(failure);
}

for (const [check, list] of byCheck) {
  console.error(`\n${check}:`);
  for (const { where, message } of list) console.error(`  ${where}\n    ${message}`);
}
console.error(`\nverify: ${failures.length} problem(s).`);
process.exit(1);
