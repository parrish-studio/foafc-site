/**
 * Derived values and display formatting for trails.
 *
 * Formatting lives in the core, not the UI layer, so a Next.js consumer or a
 * future API route formats lengths and difficulty labels identically.
 */

import { TRAIL_DIFFICULTIES } from './parse';
import type { Trail, TrailDifficulty, TrailSummary } from './types';

const DIFFICULTY_LABELS: Record<TrailDifficulty, string> = {
  easy: 'Easy',
  'more-difficult': 'More difficult',
  'most-difficult': 'Most difficult',
};

/**
 * Trail-marker glyphs from the standard Nordic scale (green circle, blue
 * square, black diamond). Decorative: always render alongside the text label,
 * never instead of it.
 */
const DIFFICULTY_GLYPHS: Record<TrailDifficulty, string> = {
  easy: '●',
  'more-difficult': '■',
  'most-difficult': '◆',
};

export function difficultyLabel(difficulty: TrailDifficulty): string {
  return DIFFICULTY_LABELS[difficulty];
}

export function difficultyGlyph(difficulty: TrailDifficulty): string {
  return DIFFICULTY_GLYPHS[difficulty];
}

/** Position on the difficulty scale, easiest first. */
export function difficultyRank(difficulty: TrailDifficulty): number {
  return TRAIL_DIFFICULTIES.indexOf(difficulty);
}

export function formatMiles(miles: number): string {
  return `${miles.toFixed(2)} mi`;
}

export function formatKm(km: number): string {
  return `${km.toFixed(2)} km`;
}

/** Sort by length without mutating the input. */
export function sortTrailsByLength(
  trails: readonly Trail[],
  direction: 'longest-first' | 'shortest-first' = 'longest-first',
): Trail[] {
  const sign = direction === 'longest-first' ? -1 : 1;
  return [...trails].sort((a, b) => sign * (a.miles - b.miles) || a.name.localeCompare(b.name));
}

/** Sort by difficulty, easiest first, then by length. */
export function sortTrailsByDifficulty(trails: readonly Trail[]): Trail[] {
  return [...trails].sort(
    (a, b) =>
      difficultyRank(a.difficulty) - difficultyRank(b.difficulty) ||
      b.miles - a.miles ||
      a.name.localeCompare(b.name),
  );
}

export function summarizeTrails(trails: readonly Trail[]): TrailSummary {
  const byDifficulty = TRAIL_DIFFICULTIES.reduce(
    (acc, difficulty) => {
      acc[difficulty] = 0;
      return acc;
    },
    {} as Record<TrailDifficulty, number>,
  );

  let totalMiles = 0;
  let totalKm = 0;
  let skateSkiingCount = 0;

  for (const trail of trails) {
    totalMiles += trail.miles;
    totalKm += trail.km;
    if (trail.skateSkiing) skateSkiingCount += 1;
    byDifficulty[trail.difficulty] += 1;
  }

  return {
    count: trails.length,
    // Guard against float drift so totals render as clean two-decimal figures.
    totalMiles: Math.round(totalMiles * 100) / 100,
    totalKm: Math.round(totalKm * 100) / 100,
    skateSkiingCount,
    byDifficulty,
  };
}
