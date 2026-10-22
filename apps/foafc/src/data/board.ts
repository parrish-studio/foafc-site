/**
 * Board of directors.
 *
 * Names and board roles only. The source document (a governance record in the
 * org's Drive) also lists each member's occupation and HOME ADDRESS. The
 * addresses are deliberately not reproduced here — this repository is public
 * and the site is public. Do not add them.
 *
 * Occupations were left out too; they are personal details the board has not
 * agreed to publish. Add them, or real bios, once the board provides them —
 * `docs/project-brief.md` lists bios as an outstanding content gap.
 */

export interface BoardMember {
  name: string;
  role: string;
  /**
   * A sentence or two. PLACEHOLDER — nobody has written real ones.
   *
   * There are none in the organisation's Drive; the board brief lists bios as
   * outstanding. These say something true and general so the page has its
   * shape, and must be replaced before launch rather than left to become the
   * official word on anyone.
   */
  bio: string;
}

const PLACEHOLDER_BIO =
  'Bio coming soon. Like everyone on this board, a volunteer who gives time to keep the trails open.';

export const BOARD: readonly BoardMember[] = [
  { name: 'John Chase', role: 'Chief Executive Officer', bio: PLACEHOLDER_BIO },
  { name: 'Susan Chase', role: 'Treasurer', bio: PLACEHOLDER_BIO },
  { name: 'Megan Anderson', role: 'Secretary', bio: PLACEHOLDER_BIO },
  { name: 'Justin Easter', role: 'Director', bio: PLACEHOLDER_BIO },
  { name: 'Wayne Hardy', role: 'Director', bio: PLACEHOLDER_BIO },
  { name: 'Joseph Hennessey', role: 'Director', bio: PLACEHOLDER_BIO },
  { name: 'Elisa Schine', role: 'Director', bio: PLACEHOLDER_BIO },
  { name: 'Pam Hall', role: 'Director', bio: PLACEHOLDER_BIO },
  { name: 'Jeneve Parrish', role: 'Director', bio: PLACEHOLDER_BIO },
  { name: 'James Pullen', role: 'Director', bio: PLACEHOLDER_BIO },
];

/**
 * Trail history. PLACEHOLDER dates and wording.
 *
 * The prototype's timeline reads "2012 · Placeholder" too — the structure is
 * real, the content was never written. Someone who knows the story needs to
 * replace this.
 */
export const TRAIL_HISTORY = [
  { year: '2012', entry: 'Neighbors begin imagining a connected trail network.' },
  { year: '2017', entry: 'A first community work day puts tools and hands on the ground.' },
  { year: '2024', entry: 'The organisation becomes a 501(c)(3) public charity.' },
  { year: '2025', entry: 'New shared stewardship goals shape the next season.' },
] as const;

/**
 * Projects & Impact. PLACEHOLDER categories, taken from the prototype.
 *
 * Plausible — the photo archive shows grooming equipment, bridges and erosion
 * work — but nobody has confirmed these are what the organisation wants to
 * claim. Replace with real projects before launch.
 */
export const PROJECTS = [
  'Trail grooming',
  'Bridges & boardwalks',
  'Signs & wayfinding',
  'Habitat & volunteer tools',
] as const;
