/**
 * Trails module — types.
 *
 * Framework-free: nothing in `src/core` may import a UI framework.
 */

/** Standard Nordic difficulty scale. */
export type TrailDifficulty = 'easy' | 'more-difficult' | 'most-difficult';

export interface Trail {
  /** Stable slug, used as a key and for deep links. */
  id: string;
  name: string;
  /** One line on what the trail is like. Shown on the card. */
  description?: string;
  /** Length in miles. */
  miles: number;
  /** Length in kilometres. */
  km: number;
  difficulty: TrailDifficulty;
  /** Whether skate skiing is allowed on this trail. */
  skateSkiing: boolean;
  /** Whether the trail is travelled in one direction only. */
  oneWay: boolean;
  /** Short public-facing note, e.g. "Longest trail". */
  notes?: string;
  /**
   * Internal data-quality flag. Not for display — it records a value that needs
   * confirming against the source, so UI layers must ignore it.
   */
  dataCheck?: string;
}

export interface TrailSystemMeta {
  name: string;
  location: string;
  /** Count as published by the organisation; may differ from `trails.length` while data is incomplete. */
  trailCount: number;
  /** Pre-formatted total, e.g. "8.3+ miles", because the published figure is approximate. */
  totalMilesLabel: string;
  /** Link to a downloadable map, if there is one. */
  mapPdf?: string;
  /** How to reach the trailhead, e.g. "Off Elliottsville Rd near Mathews Rd". */
  access?: string;
  /** Organisations that funded the trail system. */
  funders?: string[];
}

export interface TrailSystem {
  /** Where the data came from. Provenance only; not for display. */
  source?: string;
  system: TrailSystemMeta;
  trails: Trail[];
  /** Etiquette rules, in the order they should be shown. */
  rules: string[];
  /** Safety guidance, one point per line. */
  safety: string[];
  /** Named features on the system — bridges, parking, crossings. */
  landmarks?: string[];
}

export interface TrailSummary {
  count: number;
  totalMiles: number;
  totalKm: number;
  skateSkiingCount: number;
  /** Trail counts per difficulty, in scale order. */
  byDifficulty: Record<TrailDifficulty, number>;
}
