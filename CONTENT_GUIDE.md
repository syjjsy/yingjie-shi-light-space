# Content guide

## Update a research project or patent

1. Edit the corresponding object in `src/data/research.ts`; projects and patents are rendered together on the research archive page and do not have separate detail pages.
2. Preserve masked project names and numbers exactly as supplied. Do not infer or expand confidential fields.
3. Patent records use the application number stated in the source CV. Do not describe an application as granted unless that status has been independently confirmed.
4. Keep the source CV outside Git because its filename and document contents include private contact details.
5. Run `npm run check` and `npm test`, then inspect both language modes on the research page.

## Add a publication

1. Confirm that the work belongs to this Yingjie Shi.
2. Verify title, full author order, year, venue, type, DOI, volume/issue/pages against Crossref and preferably the publisher or another independent academic registry.
3. Add one object to `src/data/publications.ts`, keeping newest first.
4. State the verification sources in `source`. Do not store a citation count.
5. Set `featured: true` only when the work should appear in curated contexts.
6. Run `npm test` and inspect the publication filter and BibTeX copy interaction.

For a work lacking a reliable DOI or author match, do not publish it. Record it in `SOURCES.md` under “Pending verification” until it can be resolved.

## Import photography

1. Put original photos in one of the three category folders: `图片/城市/`, `图片/自然/`, or `图片/人文/`. The entire `图片/` directory is ignored by Git, so originals are never pushed to the repository.
2. Run `npm run photos:import`. JPG, PNG, TIFF, WebP, HEIC, and HEIF files are discovered automatically. HEIC/HEIF files are converted temporarily with `ffmpeg` before responsive WebP generation.
3. The importer clears old generated `.webp` files, creates variants at up to 640, 1280, and 1920 pixels, and updates the manifest read by the home and photography pages.
4. Inspect `public/photos/` and `src/data/photography.generated.json`, then run `npm test`.
5. The importer rebuilds images without copying metadata, which removes GPS/EXIF from public variants.

Optional custom titles, alt text, series, dates, and captions can be added by filename under `overrides` in `src/data/photography.json`:

```json
"overrides": {
  "城市/DSC00039.JPG": {
    "title": "Rain Window",
    "titleZh": "雨窗",
    "alt": "Rain on a window at dusk",
    "series": "Fragments",
    "date": "2026-11",
    "caption": "Optional caption"
  }
}
```

### Replace a photograph

1. Replace the file in its category folder while keeping the same filename.
2. Run `npm run photos:import`, then `npm test`.

### Remove or reorder photographs

- Remove a file from its category folder and rerun the importer to remove its generated WebP files from the public output.
- Category order is configured in `src/data/photography.json`; files inside each category use natural filename order.
- The first available photograph from City, Nature, and Humanities is used on the home page.
- Never put original camera files directly in `public/photos/`; that directory is generated and cleaned by the importer.

## Blog status

The blog, journal routes, content collection, and RSS feed are disabled. Restore them only when a new public blog is requested.
