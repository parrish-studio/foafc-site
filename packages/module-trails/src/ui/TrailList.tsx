import { formatKm, formatMiles, type Trail } from '../core';
import { DifficultyBadge } from './DifficultyBadge';

export interface TrailListProps {
  trails: readonly Trail[];
  /** Table caption, also used to label the scrollable region. */
  caption?: string;
}

/**
 * Trail data as a table: it is tabular, and a table keeps row/column
 * relationships available to screen readers. The wrapper is a focusable region
 * so the table can be scrolled horizontally by keyboard on narrow viewports.
 *
 * Renders without any client directive, so it ships as static HTML with no
 * JavaScript. Add `client:*` only if interactive filtering is added later.
 */
export function TrailList({ trails, caption = 'Trails' }: TrailListProps) {
  return (
    <div className="ps-trail-table-scroll" role="region" aria-label={caption} tabIndex={0}>
      <table className="ps-trail-table">
        <caption className="ps-trail-table__caption">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Trail</th>
            <th scope="col">Length</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Skate skiing</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          {trails.map((trail) => (
            <tr key={trail.id}>
              <th scope="row" className="ps-trail-table__name">
                {trail.name}
                {/* Explicit space so the tag is not read as part of the name. */}
                {trail.oneWay ? (
                  <>
                    {' '}
                    <span className="ps-trail-tag">One way</span>
                  </>
                ) : null}
              </th>
              <td>
                <span className="ps-trail-length">{formatMiles(trail.miles)}</span>
                <span className="ps-trail-length ps-trail-length--secondary">
                  {formatKm(trail.km)}
                </span>
              </td>
              <td>
                <DifficultyBadge difficulty={trail.difficulty} />
              </td>
              <td>{trail.skateSkiing ? 'Yes' : 'No'}</td>
              <td>{trail.notes ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
