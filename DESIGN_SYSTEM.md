# Design system

## Direction study

Three directions were compared before implementation:

| Direction | Visual language | Strength | Risk |
| --- | --- | --- | --- |
| Darkroom Folio | Warm paper, charcoal, oxblood, large literary serif, thin technical annotations, abstract optical traces | Joins research, photography, and writing without making one subordinate to another | Requires disciplined spacing and restrained motion |
| Nocturne Observatory | Near-black field, grey-blue light, sparse white type, long cinematic transitions | Strong photographic immersion and a sense of hidden vision | Dense publication reading becomes tiring; can feel like a technology demo |
| Annotated Contact Sheet | White grid, mono captions, numbered plates, small editorial serif, archive-first interaction | Excellent evidence handling and maintainability | Too clinical for the desired private, literary character |

**Selected: Darkroom Folio.** It treats the site as a book handled in a dim optical laboratory: warm paper for reading, charcoal for quiet authority, oxblood for light paths and evidence marks. Research diagrams are abstract explanations; photography remains visually dominant when real work arrives; journal typography stays calm.

## Reference synthesis

- Apartamento: slow editorial pacing, direct story taxonomy, a publication-like relationship between image and text.
- Serpentine: oversized exhibition titles, short contextual descriptions, and clear event/reader hierarchy.
- Contemporary photography portfolios: full-bleed impact and series-level navigation, but the site avoids sales-heavy gallery patterns.
- Research homepages such as Andrew Heiss: concise factual biography, durable plain links, source transparency, and accessible text.
- Optical research itself supplies the graphic language: concentric transient echoes, ray paths, relay walls, and time annotations.

No one site is copied. The result combines editorial pacing, art-institution scale, photography restraint, and academic evidence labels.

## Tokens

- Paper: `#eee9df`
- Light paper: `#f7f3ea`
- Ink: `#1f211f`
- Oxblood: `#8e2e25`
- Blue-grey: `#50626a`
- Muted text: `#686862`
- Hairline: 20% ink

## Typography

- Display: Iowan Old Style / Palatino / Noto Serif SC / Songti SC / Georgia.
- Interface: Avenir Next / Noto Sans SC / PingFang SC / system sans.
- Evidence labels: SFMono / Consolas / system mono.
- No remote font request. This prioritizes privacy, lawful system fonts, mainland-China reliability, and performance.

## Layout

- Maximum shell: 1480px; desktop gutters 40px; mobile gutters 15px.
- Editorial headings use 3-column composition: index, title, note.
- Content lists use hairline rules rather than cards and shadows.
- Mobile layout preserves hierarchy by stacking evidence notes beneath titles.

## Motion and access

- Slow reveal and optical echo motion only.
- All motion collapses under `prefers-reduced-motion`.
- Semantic landmarks, skip link, keyboard menus, labelled controls, alt text, dialog lightbox, and visible textual status are required.
- Colour contrast and reading width take precedence over decorative atmosphere.
