import { formatKm, formatMiles, type Trail } from '../core';
import { DifficultyBadge } from './DifficultyBadge';

export interface TrailGridProps {
  trails: readonly Trail[];
  /** Labels the list for assistive software. */
  caption?: string;
}

/**
 * Trails as cards.
 *
 * Cards rather than a table because a table of twelve trails needs horizontal
 * scrolling on a phone, which is where most people check a trail before
 * setting out. Each card carries its own distance and rating, so nothing
 * depends on reading across a row.
 *
 * Renders without a client directive: static HTML, no JavaScript.
 */
export function TrailGrid({ trails, caption = 'Trails' }: TrailGridProps) {
  return (
    <ul className="ps-trail-grid" aria-label={caption}>
      {trails.map((trail) => (
        <li className="ps-trail-card" key={trail.id}>
          <DifficultyBadge difficulty={trail.difficulty} showLabel={false} />
          <h3 className="ps-trail-card__name">
            {trail.name}
            {trail.oneWay ? <span className="ps-trail-tag">One way</span> : null}
          </h3>
          {trail.description ? (
            <p className="ps-trail-card__description">{trail.description}</p>
          ) : null}
          <p className="ps-trail-card__facts">
            <span className="ps-trail-pill">
              {formatMiles(trail.miles)} / {formatKm(trail.km)}
            </span>
            <DifficultyBadge difficulty={trail.difficulty} showMarker={false} />
            {trail.skateSkiing ? null : <span className="ps-trail-pill">Classic only</span>}
          </p>
        </li>
      ))}
    </ul>
  );
}
