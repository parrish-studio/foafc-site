import { difficultyGlyph, difficultyLabel, type TrailDifficulty } from '../core';

export interface DifficultyBadgeProps {
  difficulty: TrailDifficulty;
}

/**
 * Difficulty shown as the standard Nordic marker plus its text label. The glyph
 * is decorative; the label carries the meaning, so the badge does not rely on
 * colour or shape alone.
 */
export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`ps-trail-difficulty ps-trail-difficulty--${difficulty}`}>
      <span className="ps-trail-difficulty__glyph" aria-hidden="true">
        {difficultyGlyph(difficulty)}
      </span>
      {difficultyLabel(difficulty)}
    </span>
  );
}
