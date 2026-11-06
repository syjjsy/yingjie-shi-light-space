# Sources and verification log

Checked 2026-11-05 unless otherwise noted.

## Identity and originating profile

- User-provided facts: name, role, institution, research fields.
- Google Scholar profile: https://scholar.google.com.hk/citations?user=aV-yImMAAAAJ&hl=zh-CN
- An earlier user-owned local academic-homepage repository was used only as a discovery list and corroborating local source. Public metadata was rechecked before inclusion.

## Publication verification

- Crossref REST API exact-title queries supplied DOI, type, year, venue, authors, volume, issue, and pages for 27 records: https://api.crossref.org/
- Optica Publishing Group issue/article pages corroborated Optics Express, Optics Letters, and Photonics Research records: https://opg.optica.org/
- AIP publisher page corroborated the 2026 Applied Physics Letters paper: https://pubs.aip.org/aip/apl/article/129/10/101106/3404114/
- Elsevier publisher page corroborated the 2026 temporal-decoupling paper: https://www.sciencedirect.com/science/article/pii/S0143816626004586
- OpenAlex corroborated selected records and institutional authorship: https://openalex.org/works/W4415783632 and https://openalex.org/W4292664334
- arXiv and DBLP verified “Imaging through multimode fibres with physical prior” as a 2023 preprint, DOI `10.48550/arXiv.2311.03062`: https://arxiv.org/abs/2311.03062 and https://dblp.uni-trier.de/rec/journals/corr/abs-2311-03062.html
- Infrared and Laser Engineering publisher record/PDF verified DOI `10.3788/IRLA20220563`: https://www.spacejournal.cn/en/article/id/hwyjggc_hwyjggc_13054533-4fd9-49a1-b084-325f7f4a9a8d

`src/data/publications.ts` contains a source note per entry. Citation counts were excluded because they are mutable.

## Design references

- Apartamento Magazine: https://www.apartamentomagazine.com/
- Serpentine Galleries: https://www.serpentinegalleries.org/
- Andrew Heiss academic site: https://www.andrewheiss.com/
- Paul Reiffer photography site: https://www.paulreiffer.com/

References were analyzed for hierarchy, pacing, typography, content grouping, and image/text balance. No templates, code, images, or distinctive layouts were copied.

## Platform and technical sources

- Retiehe introduction: https://host-intro.retiehe.com/
- Retiehe official agent skill and examples: https://github.com/TuringArthur/retiehe_web_host
- Retiehe automatic deployment guide: https://github.com/TuringArthur/retiehe_web_host/blob/main/DEPLOY.md
- Astro 7.4 announcement: https://astro.build/blog/astro-740/
- Astro content collections reference: https://docs.astro.build/en/reference/modules/astro-content/

The Retiehe public introduction confirms free start, free customizable subdomain, framework/static deployment, global CDN including mainland China, and CN2 GIA. Numerical free-tier traffic/storage limits and a universal ICP-filing statement were not found in the public pages examined and remain pending control-panel confirmation.

## Visual assets

- `public/demo/light-study-*.svg`, `public/og.svg`, and `public/favicon.svg` are original project-native abstract vector studies created for this site.
- They are not photographs, research data, or claimed experimental figures.
- No third-party or AI-generated photography is published.

## Pending verification / author input

- Confirm the desired public email, if any.
- Confirm portrait, education timeline, ORCID, and social profiles before publication.
- Supply authored photographs and captions.
- Supply or approve journal writing.
- Confirm current Retiehe free-tier numerical quotas and node/ICP conditions inside the signed-in account.
