import type { HeadingLevel } from './heading';

export interface TrailSafetyNoticeProps {
  /** One point per line. */
  safety: readonly string[];
  heading?: string;
  /** Pick the level that fits the host page's outline. */
  headingLevel?: HeadingLevel;
}

/**
 * Safety guidance as a list.
 *
 * A list rather than a paragraph: these are separate instructions, people scan
 * rather than read them, and a wall of text before going out in winter is the
 * least likely thing to be absorbed.
 */
export function TrailSafetyNotice({
  safety,
  heading = 'Safety',
  headingLevel = 2,
}: TrailSafetyNoticeProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <section className="ps-trail-safety">
      <Heading>{heading}</Heading>
      <ul className="ps-trail-rules__list">
        {safety.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
