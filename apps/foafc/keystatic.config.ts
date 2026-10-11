import { collection, config, fields } from '@keystatic/core';

/*
 * Keystatic in GitHub mode (ADR 0003). Editors sign in at /keystatic with their
 * own GitHub accounts and saves commit to `main`.
 *
 * Paths are relative to the REPOSITORY root, not to this Astro app, because
 * GitHub mode reads and writes through the GitHub API. That is why every path
 * below starts with `apps/foafc/`.
 */
export default config({
  storage: {
    kind: 'github',
    repo: { owner: 'parrish-studio', name: 'foafc-site' },
  },
  ui: {
    brand: { name: 'Friends of A Fierce Chase' },
  },
  collections: {
    news: collection({
      label: 'News',
      path: 'apps/foafc/src/content/news/*',
      slugField: 'title',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['title', 'date', 'draft'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { isRequired: true },
          },
        }),
        date: fields.date({
          label: 'Date',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'apps/foafc/src/assets/news',
          // Written into the entry file, which sits in src/content/news/,
          // so Astro's image() resolves it relative to that file.
          publicPath: '../../assets/news/',
        }),
        coverAlt: fields.text({
          label: 'Cover image alt text',
          description: 'Describe the photo for people who cannot see it. Required if there is a cover image.',
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description:
            'Drafts are not published. Untick when the post is ready to go live.',
          defaultValue: false,
        }),
        body: fields.markdoc({ label: 'Body' }),
      },
    }),
  },
});
