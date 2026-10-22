import { difficultyGlyph, difficultyLabel, type TrailDifficulty } from '../core';

export interface DifficultyBadgeProps {
  difficulty: TrailDifficulty;
  /** Show the Nordic shape marker. */
  showMarker?: boolean;
  /** Show the words ("More difficult"). */
  showLabel?: boolean;
}

/**
 * Difficulty as the standard Nordic marker and its words.
 *
 * Three signals carry the rating — shape, colour and text — so no one of them
 * has to be perceived. Rendering with `showLabel={false}` is only safe where
 * the words appear elsewhere on the same card, which is why the marker keeps
 * an accessible name of its own.
 */
export function DifficultyBadge({
  difficulty,
  showMarker = true,
  showLabel = true,
}: DifficultyBadgeProps) {
  const label = difficultyLabel(difficulty);

  return (
    <span className={`ps-trail-difficulty ps-trail-difficulty--${difficulty}`}>
      {showMarker ? (
        <span className="ps-trail-difficulty__glyph" role="img" aria-label={label}>
          {difficultyGlyph(difficulty)}
        </span>
      ) : null}
      {showLabel ? <span className="ps-trail-difficulty__label">{label}</span> : null}
    </span>
  );
}
