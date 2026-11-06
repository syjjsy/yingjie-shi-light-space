# Deployment guide

## GitHub Pages

GitHub Pages is the recommended Git-based public host for this project. A complete workflow is already included at `.github/workflows/deploy-pages.yml`.

1. Create a **public** GitHub repository. GitHub Free supports Pages for public repositories.
2. Push this project to the repository's `main` branch.
3. Open repository **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and run or monitor “Deploy to GitHub Pages”. Future pushes to `main` redeploy automatically.

The workflow uses GitHub's Pages metadata to set both `SITE_URL` and `BASE_PATH`, so it works for either:

- a user site such as `https://USERNAME.github.io/`; or
- a project site such as `https://USERNAME.github.io/REPOSITORY/`.

No API key, deployment token, paid plan, or committed secret is required. The workflow receives only the standard short-lived GitHub token with `contents: read`, `pages: write`, and `id-token: write` permissions.

## Gitee status

As checked on 2026-11-06, Gitee's official help center marks **Gitee Pages**, **Gitee Pages Pro**, and single-page-app Pages support as discontinued. Gitee can still be used as a Git repository or mirror, but it is not currently a native public website host for this project.

Practical options:

- keep the source on Gitee and upload the generated `dist/` folder to Retiehe;
- mirror the repository between Gitee and GitHub, with GitHub Pages performing the public deployment; or
- use a separately configured external host through a Gitee CI/CD pipeline if you already operate one.

Do not rely on old tutorials that instruct you to click a Gitee Pages service button.

## Retiehe deployment

### Confirmed platform facts (checked 2026-11-06)

- The platform advertises a free start and a customizable free subdomain.
- It accepts static folders/archives and supports automatic framework builds.
- The official deployment guide requires Node.js 22 and an API key created in the control panel.
- The official CLI supports creating/selecting a free-domain site and deploying a chosen output directory.
- The platform advertises HTTPS-accessible sites, global CDN nodes including mainland China, and a CN2 GIA server route.
- The official public pages examined did **not** state a numerical free-tier bandwidth, traffic, or storage quota, nor a definitive ICP-filing rule for every node. Confirm those values in the signed-in control panel before relying on them.

Do not buy a plan, domain, server, or paid add-on for this project.

### Free-account deployment (preferred)

The free path does not require an API key:

1. Run `npm run build`.
2. Zip the **contents** of `dist/`, so `index.html` is at the archive root.
3. In the Retiehe control panel, create or open a site with a free Retiehe subdomain.
4. Open the file manager and upload the ZIP, folder, or all files from `dist/` to the website root.
5. Confirm that the root contains `index.html`, `_astro/`, `research/`, and the other generated routes.

The prepared archive for this project is `yingjie-shi-light-space-retiehe.zip`. It contains production output only—no source files, `.env`, API keys, tests, or `node_modules`.

### Optional API deployment

API keys can be limited to upgraded accounts. Do not upgrade or purchase anything for this project merely to obtain automatic deployment; use the free direct-upload path above instead.

If API access is already included in the account, use this secure local setup:

1. In the Retiehe control panel, open the API-key menu and create a key. Do not paste it into a public chat or commit it.
2. Create `.env` from `.env.example`.
3. Set:

```dotenv
SITE_URL=https://your-free-subdomain.example
RTH_API_KEY=your-private-key
RTH_SITE_DOMAIN=your-free-subdomain.example
```

`.env` is ignored by Git. The key is passed to the official CLI only through the environment.

### First API deployment

If no free site exists yet, use the audited official CLI interactively once to create a free-domain site, or create it in the control panel. Decline Git automation unless the repository secret is configured deliberately.

Then run:

```bash
npm run deploy
```

The wrapper:

1. builds `dist/`;
2. downloads the official CLI from `https://host.retiehe.com/cli`;
3. verifies it against the SHA-256 inspected on 2026-11-05;
4. deploys `dist/` to `RTH_SITE_DOMAIN`;
5. removes the temporary CLI file.

If the CLI hash changes, the wrapper stops. Inspect the new script before updating the pinned hash. This is an intentional supply-chain safety check.

## Post-deployment verification

Open the public URL and check:

- `/`, `/research/`, all three research detail pages;
- `/publications/`, filtering, DOI links, BibTeX copy;
- `/photography/`, lightbox, arrow keys, and swipe;
- `/about/`, `/sitemap.xml`, `/robots.txt`;
- confirm that `/journal/` and `/rss.xml` are not present;
- CSS and SVG assets over HTTPS;
- 404 behavior and internal links;
- desktop and mobile navigation;
- English/Chinese toggle persistence.

Only report a deployment as successful after the public URL is reachable and these routes load.

### Manual fallback

If API deployment is unavailable, `npm run build` produces a complete static `dist/` folder. Upload the contents of `dist/` to the website root through Retiehe’s official file manager. Do not upload the project source, `.env`, originals, or `node_modules`.
