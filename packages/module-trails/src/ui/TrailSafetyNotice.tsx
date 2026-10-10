import type { HeadingLevel } from './heading';

export interface TrailSafetyNoticeProps {
  notice: string;
  heading?: string;
  /** Pick the level that fits the host page's outline. */
  headingLevel?: HeadingLevel;
}

export function TrailSafetyNotice({
  notice,
  heading = 'Safety',
  headingLevel = 2,
}: TrailSafetyNoticeProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <section className="ps-trail-safety">
      <Heading>{heading}</Heading>
      <p className="ps-trail-safety__text">{notice}</p>
    </section>
  );
}
