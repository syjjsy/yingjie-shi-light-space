# AGENTS.md

## Project identity

This is Yingjie Shi's public personal site: an academic archive and photography portfolio. The central idea is “a researcher of light, recording the world with light.” Preserve the editorial, cinematic, quiet design. Do not convert it into a generic CV, SaaS landing page, or programmer portfolio.

## Non-negotiable content rules

- Never invent papers, affiliations, education, awards, biography, contact details, opinions, journeys, photographs, or private life.
- Public publication metadata lives in `src/data/publications.ts`. Add an item only after checking title, authors, year, venue, DOI, and type against at least one authoritative registry or publisher; record the source.
- Google Scholar is an index and profile link, not an infallible API. If it is blocked, use Crossref, the publisher, OpenAlex, arXiv, or DBLP and maintain a pending-verification list instead of guessing.
- The blog/journal and RSS feed are disabled. Do not restore journal content or public routes unless the author explicitly asks.
- Keep secrets out of source control. `.env` is ignored; `RTH_API_KEY` is read only at deploy time.

## Structure

- `src/pages/`: static routes and sitemap/robots output.
- `src/layouts/`, `src/components/`: shared interface.
- `src/styles/global.css`: design system implementation.
- `src/data/`: profile, research, publication, and photography metadata.
- `图片/`: private local photo source, ignored by Git.
- `public/photos/`: generated, metadata-stripped responsive images.
- `scripts/import-photos.mjs`: photography importer.
- `scripts/deploy-retiehe.mjs`: audited official Retiehe CLI wrapper.
- `tests/site.test.mjs`: built-output and internal-link checks.

## Design rules

- Palette: paper `#eee9df`, ink `#1f211f`, oxblood `#8e2e25`, muted blue-grey `#50626a`.
- Typography: local/system literary serif for display, system sans for interface, system mono for evidence labels. Do not add Google Fonts.
- Use asymmetry, white space, thin rules, large editorial titles, and restrained motion.
- Motion must support `prefers-reduced-motion`.
- Maintain keyboard focus, semantic headings, alt text, mobile navigation, and readable line lengths.
- Treat research diagrams as explanatory abstractions, never experimental results.

## Required checks

Run before claiming completion or deployment:

```bash
npm run check
npm test
```

For visual changes, review at 1440, 1920, 768, 390, and 375 CSS pixels. Check the home, publications, photography, research detail, and about routes. Perform at least two visual passes after substantive redesigns.

## Content workflows

- Paper: verify, edit `src/data/publications.ts`, run checks, deploy.
- Photos: place originals in the ignored `图片/` directory, run `npm run photos:import`, review generated assets, build and deploy.

## Deployment

Supported targets are Retiehe direct upload and GitHub Pages. Gitee may host or mirror the source, but its Pages product is currently discontinued. Do not purchase a plan, domain, server, or paid add-on. Follow `DEPLOYMENT.md`.
