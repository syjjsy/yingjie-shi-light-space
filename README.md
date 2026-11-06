# Yingjie Shi — Light Space

An editorial, bilingual personal site for Yingjie Shi (师瑛杰): computational-imaging research and an authored photography archive.

## Stack

- Astro 7.4 static output
- TypeScript and plain CSS
- Lightweight browser JavaScript for language, filters, copy, menu, reveal, and lightbox
- Sharp-based local photo import with EXIF/GPS removal by omission
- No database, online font provider, paid API, or production backend

## Local use

```bash
npm install
npm run dev
```

Build and verify:

```bash
npm run check
npm test
npm run audit
```

The production files are written to `dist/`.

## Content

- Publications: `src/data/publications.ts`
- Research summaries: `src/data/research.ts`
- Photography metadata: `src/data/photography.json`

All 29 publications are rendered on one filterable archive page; no per-paper routes are generated. See `CONTENT_GUIDE.md` before adding material.

## Deployment

For a free Retiehe account, build the site and upload the generated ZIP or the contents of `dist/` through the control-panel file manager:

```bash
npm run build
```

API deployment is optional and may require an upgraded account. It is not required for this site. Details and safety constraints are in `DEPLOYMENT.md`.

The repository also includes `.github/workflows/deploy-pages.yml` for GitHub Pages. Gitee can host or mirror the source repository, but Gitee's official help currently marks Gitee Pages as discontinued; see `DEPLOYMENT.md` for the current options.
