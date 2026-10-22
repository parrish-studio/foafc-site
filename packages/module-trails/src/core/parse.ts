/**
 * Validating parser for trail-system data.
 *
 * Hand-rolled rather than schema-library based so the module core stays
 * dependency-free and portable. The parser is the single gate between whatever
 * a host hands us (JSON file today, CMS or API later) and the module's types.
 */

import type { Trail, TrailDifficulty, TrailSystem, TrailSystemMeta } from './types';

export const TRAIL_DIFFICULTIES: readonly TrailDifficulty[] = [
  'easy',
  'more-difficult',
  'most-difficult',
];

/** Thrown when input does not match the trail-system shape. */
export class TrailDataError extends Error {
  readonly path: string;

  constructor(path: string, message: string) {
    super(`${path}: ${message}`);
    this.name = 'TrailDataError';
    this.path = path;
  }
}

function describe(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'an array';
  return typeof value;
}

function asRecord(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TrailDataError(path, `expected an object, got ${describe(value)}`);
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TrailDataError(path, `expected a non-empty string, got ${describe(value)}`);
  }
  return value;
}

function asNumber(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TrailDataError(path, `expected a finite number, got ${describe(value)}`);
  }
  return value;
}

function asBoolean(value: unknown, path: string): boolean {
  if (typeof value !== 'boolean') {
    throw new TrailDataError(path, `expected a boolean, got ${describe(value)}`);
  }
  return value;
}

function asOptionalString(value: unknown, path: string): string | undefined {
  return value === undefined ? undefined : asString(value, path);
}

function asStringArray(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) {
    throw new TrailDataError(path, `expected an array, got ${describe(value)}`);
  }
  return value.map((entry, i) => asString(entry, `${path}[${i}]`));
}

function asDifficulty(value: unknown, path: string): TrailDifficulty {
  const found = TRAIL_DIFFICULTIES.find((candidate) => candidate === value);
  if (!found) {
    throw new TrailDataError(
      path,
      `expected one of ${TRAIL_DIFFICULTIES.join(', ')}, got ${JSON.stringify(value)}`,
    );
  }
  return found;
}

function parseTrail(value: unknown, path: string): Trail {
  const raw = asRecord(value, path);
  return {
    id: asString(raw.id, `${path}.id`),
    name: asString(raw.name, `${path}.name`),
    description: asOptionalString(raw.description, `${path}.description`),
    miles: asNumber(raw.miles, `${path}.miles`),
    km: asNumber(raw.km, `${path}.km`),
    difficulty: asDifficulty(raw.difficulty, `${path}.difficulty`),
    skateSkiing: asBoolean(raw.skateSkiing, `${path}.skateSkiing`),
    oneWay: asBoolean(raw.oneWay, `${path}.oneWay`),
    notes: asOptionalString(raw.notes, `${path}.notes`),
    dataCheck: asOptionalString(raw.dataCheck, `${path}.dataCheck`),
  };
}

function parseMeta(value: unknown, path: string): TrailSystemMeta {
  const raw = asRecord(value, path);
  return {
    name: asString(raw.name, `${path}.name`),
    location: asString(raw.location, `${path}.location`),
    trailCount: asNumber(raw.trailCount, `${path}.trailCount`),
    totalMilesLabel: asString(raw.totalMilesLabel, `${path}.totalMilesLabel`),
    mapPdf: asOptionalString(raw.mapPdf, `${path}.mapPdf`),
    access: asOptionalString(raw.access, `${path}.access`),
    funders: raw.funders === undefined ? undefined : asStringArray(raw.funders, `${path}.funders`),
  };
}

/**
 * Parse and validate a trail system. Throws {@link TrailDataError} with the
 * offending path so a bad CMS edit fails the build with a usable message
 * instead of rendering a broken page.
 */
export function parseTrailSystem(value: unknown, path = 'trailSystem'): TrailSystem {
  const raw = asRecord(value, path);
  const trails = raw.trails;
  if (!Array.isArray(trails)) {
    throw new TrailDataError(`${path}.trails`, `expected an array, got ${describe(trails)}`);
  }

  const parsed = trails.map((trail, i) => parseTrail(trail, `${path}.trails[${i}]`));

  const seen = new Set<string>();
  for (const trail of parsed) {
    if (seen.has(trail.id)) {
      throw new TrailDataError(`${path}.trails`, `duplicate trail id "${trail.id}"`);
    }
    seen.add(trail.id);
  }

  return {
    source: asOptionalString(raw.source, `${path}.source`),
    system: parseMeta(raw.system, `${path}.system`),
    trails: parsed,
    rules: asStringArray(raw.rules, `${path}.rules`),
    safety: asStringArray(raw.safety, `${path}.safety`),
    landmarks:
      raw.landmarks === undefined
        ? undefined
        : asStringArray(raw.landmarks, `${path}.landmarks`),
  };
}
