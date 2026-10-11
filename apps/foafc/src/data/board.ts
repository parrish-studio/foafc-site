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
}

export const BOARD: readonly BoardMember[] = [
  { name: 'John Chase', role: 'Chief Executive Officer' },
  { name: 'Susan Chase', role: 'Treasurer' },
  { name: 'Megan Anderson', role: 'Secretary' },
  { name: 'Justin Easter', role: 'Director' },
  { name: 'Wayne Hardy', role: 'Director' },
  { name: 'Joseph Hennessey', role: 'Director' },
  { name: 'Elisa Schine', role: 'Director' },
  { name: 'Pam Hall', role: 'Director' },
  { name: 'Jeneve Parrish', role: 'Director' },
  { name: 'James Pullen', role: 'Director' },
];
