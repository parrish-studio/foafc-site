import type { ImageMetadata } from 'astro';
import jeneveParrishPhoto from '../assets/board/jeneve-parrish.jpg';
import johnChasePhoto from '../assets/board/john-chase.webp';

/**
 * Board of directors.
 *
 * Names and board roles only, plus whatever each member has chosen to add. The
 * source document (a governance record in the org's Drive) also lists each
 * member's occupation and HOME ADDRESS. The addresses are deliberately not
 * reproduced here — this repository is public and the site is public. Do not
 * add them.
 *
 * Occupations were left out too; they are personal details the board has not
 * agreed to publish. A member who wants their work mentioned can say so in
 * their own bio, as two have.
 */

export interface BoardMember {
  name: string;
  role: string;
  /**
   * A sentence or two, in the member's own words where they have supplied
   * them. Everyone else carries PLACEHOLDER_BIO until they do.
   */
  bio: string;
  /**
   * Optional portrait. Members who have not supplied one fall back to the
   * logo mark; see `people__portrait` in global.css, which styles the two
   * cases differently — a photo fills the circle, the mark sits inside it.
   */
  photo?: ImageMetadata;
  /**
   * Where the face sits in the photo, as a CSS `object-position` value, for
   * the circular crop on the About page. Omit it for a square or
   * already-centred photo. Every portrait frames differently, so this belongs
   * with the person rather than in a stylesheet.
   */
  photoPosition?: string;
}

/**
 * Deliberately terse. It renders eight times, so anything longer stops being a
 * quiet placeholder and becomes the loudest thing on the page.
 */
export const PLACEHOLDER_BIO = 'Bio coming soon.';

export const BOARD: readonly BoardMember[] = [
  {
    name: 'John Chase',
    role: 'Chief Executive Officer',
    bio: 'A Fierce Chase cross-country ski trails (1999–present). Northern Light Mayo Hospital Med/Surg RN (2006–present). US National Biathlon Team (1984). I am passionate about sharing a high-quality cross-country skiing experience with the public.',
    photo: johnChasePhoto,
  },
  { name: 'Susan Chase', role: 'Treasurer', bio: PLACEHOLDER_BIO },
  { name: 'Megan Anderson', role: 'Secretary', bio: PLACEHOLDER_BIO },
  { name: 'Justin Easter', role: 'Director', bio: PLACEHOLDER_BIO },
  { name: 'Wayne Hardy', role: 'Director', bio: PLACEHOLDER_BIO },
  { name: 'Joseph Hennessey', role: 'Director', bio: PLACEHOLDER_BIO },
  { name: 'Elisa Schine', role: 'Director', bio: PLACEHOLDER_BIO },
  { name: 'Pam Hall', role: 'Director', bio: PLACEHOLDER_BIO },
  {
    name: 'Jeneve Parrish',
    role: 'Director',
    bio: 'A Maine-based engineer, maker and mom whose work centers on craft, community and a deep sense of place. She co-founded Rest Day Sauna, a hand-built, wood-fired sauna serving Monson and the Appalachian Trail community, built around rest, ritual and connection. A lifelong maker, cook and hacker, she brings a hands-on, design-driven approach to everything. She is a staff engineer at a San Francisco tech company.',
    photo: jeneveParrishPhoto,
    // Tall frame with a lot of hat; the face sits below centre.
    photoPosition: 'center 70%',
  },
  { name: 'James Pullen', role: 'Director', bio: PLACEHOLDER_BIO },
];

/**
 * Trail history. PLACEHOLDER dates and wording, with one exception.
 *
 * The prototype's timeline reads "2012 · Placeholder" too — the structure is
 * real, the content was never written. Someone who knows the story needs to
 * replace this.
 *
 * 2024 is real: the determination letter in the Drive gives March 20, 2024.
 *
 * NOTE, 2026-11-01: John Chase's bio above dates the trails to 1999, which is
 * the first hard founding date anyone has given and contradicts the invented
 * 2012 below. Confirm with him before rewriting the timeline around it.
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
