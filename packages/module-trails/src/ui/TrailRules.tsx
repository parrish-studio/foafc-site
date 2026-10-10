import type { HeadingLevel } from './heading';

export interface TrailRulesProps {
  rules: readonly string[];
  heading?: string;
  /** Pick the level that fits the host page's outline. */
  headingLevel?: HeadingLevel;
}

export function TrailRules({
  rules,
  heading = 'Trail etiquette',
  headingLevel = 2,
}: TrailRulesProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <section className="ps-trail-rules">
      <Heading>{heading}</Heading>
      <ul className="ps-trail-rules__list">
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </section>
  );
}
