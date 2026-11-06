import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import test from "node:test";
import { fileURLToPath } from "node:url";

const distUrl = new URL("../dist/", import.meta.url);
const dist = fileURLToPath(distUrl);
const basePath = (process.env.BASE_PATH || "").replace(/\/$/, "");

async function files(directory) {
  const entries = await readdir(directory);
  const results = [];
  for (const entry of entries) {
    const target = path.join(directory, entry);
    if ((await stat(target)).isDirectory()) results.push(...await files(target));
    else results.push(target);
  }
  return results;
}

test("build contains every required public route", async () => {
  for (const route of ["index.html", "research/index.html", "publications/index.html", "photography/index.html", "about/index.html", "404.html", "sitemap.xml", "robots.txt"]) {
    const content = await readFile(new URL(route, distUrl), "utf8");
    assert.ok(content.length > 20, `${route} should not be empty`);
  }
});

test("enlarged identity typography is scoped to the home page", async () => {
  const home = await readFile(new URL("index.html", distUrl), "utf8");
  const research = await readFile(new URL("research/index.html", distUrl), "utf8");
  const styles = await readFile(new URL("../src/styles/global.css", import.meta.url), "utf8");
  assert.match(home, /<body class="home-page">/);
  assert.doesNotMatch(research, /<body class="home-page">/);
  assert.match(styles, /\.site-nav a, \.language-toggle \{[^}]*font-size: \.74rem;/s);
  assert.match(styles, /\.hero-cn \{[^}]*font-size: \.84rem;/s);
  assert.match(styles, /\.hero-meta \{[^}]*font-size: \.75rem;/s);
  assert.match(styles, /\.home-page \.hero-cn \{ font-size: 1\.25rem; \}/);
  assert.match(styles, /\.home-page \.hero-meta \{ font-size: 1\.125rem; \}/);
  assert.match(styles, /@media \(min-width: 981px\) \{\s*\.home-page \.site-nav a \{ font-size: 1\.125rem; \}/s);
});

test("about page contains the portrait and complete education history", async () => {
  const html = await readFile(new URL("about/index.html", distUrl), "utf8");
  const portrait = fileURLToPath(new URL("../public/profile/yingjie-shi-portrait.webp", import.meta.url));
  const metadata = await sharp(portrait).metadata();
  assert.equal(metadata.width, 335);
  assert.equal(metadata.height, 335);
  assert.match(html, /profile\/yingjie-shi-portrait\.webp/);
  assert.equal((html.match(/data-education-entry(?=[\s>])/g) || []).length, 4);
  assert.match(html, /南京理工大学/);
  assert.match(html, /巴黎西岱大学/);
  assert.match(html, /湘潭大学/);
  assert.match(html, /国家公派联合培养博士研究生/);
  assert.doesNotMatch(html, /18873291855|syj@njust\.edu\.cn/i, "private resume contact details must not be published");
});

test("media URLs can be hosted separately for text-only deployment targets", async () => {
  const paths = await readFile(new URL("../src/utils/paths.ts", import.meta.url), "utf8");
  const about = await readFile(new URL("../src/pages/about.astro", import.meta.url), "utf8");
  const photography = await readFile(new URL("../src/pages/photography.astro", import.meta.url), "utf8");
  assert.match(paths, /PUBLIC_MEDIA_BASE_URL/);
  assert.match(about, /withMediaBase\(profile\.portrait\)/);
  assert.match(photography, /withMediaBase\(variant\.src\)/);
});

test("publication archive is complete and interactive", async () => {
  const html = await readFile(new URL("publications/index.html", distUrl), "utf8");
  assert.match(html, /10\.1063\/5\.0346094/i);
  assert.match(html, /10\.1364\/OE\.575753/i);
  assert.match(html, /data-publication-filters/);
  assert.match(html, /data-copy-bibtex/);
  assert.equal((html.match(/data-publication(?=[\s>])/g) || []).length, 29, "every publication should appear on the archive page");
  assert.equal((html.match(/data-author-role="co-first"/g) || []).length, 5, "co-first author records should be labeled");
  assert.equal((html.match(/data-author-role="corresponding"/g) || []).length, 4, "corresponding author records should be labeled");
  assert.match(html, /共同第一作者/);
  assert.match(html, /通讯作者/);
  const styles = await readFile(new URL("../src/styles/global.css", import.meta.url), "utf8");
  assert.match(styles, /\.publication-item\[hidden\]\s*\{[^}]*display:\s*none\s*!important;/s, "filtered publications should be visually hidden");
  assert.doesNotMatch(html, /href="[^"]*\/publications\/[^"#?]+\//, "publications must not generate individual detail pages");
  assert.doesNotMatch(html, /candidate-only|Lorem ipsum/i);
});

test("research archive contains every resume project and patent", async () => {
  const html = await readFile(new URL("research/index.html", distUrl), "utf8");
  assert.equal((html.match(/data-research-project(?=[\s>])/g) || []).length, 4);
  assert.equal((html.match(/data-patent(?=[\s>])/g) || []).length, 9);
  assert.match(html, /2022-JCJQZD-XXX-2025-XXX/);
  assert.match(html, /62031018/);
  assert.match(html, /202511342900\.9/);
  assert.match(html, /202211659814\.7/);
  assert.match(html, /师瑛杰/);
  assert.doesNotMatch(html, /18873291855|syj@njust\.edu\.cn/i, "private resume contact details must not be published");
});

test("blog and editorial placeholder notes are absent", async () => {
  const all = await files(dist);
  const html = (await Promise.all(all.filter((file) => file.endsWith(".html")).map((file) => readFile(file, "utf8")))).join("\n");
  assert.ok(!all.some((file) => path.relative(dist, file).startsWith("journal/")));
  assert.ok(!all.some((file) => path.relative(dist, file) === "rss.xml"));
  assert.doesNotMatch(html, /href="[^"]*\/journal\/|application\/rss\+xml/i);
  assert.doesNotMatch(html, /A blank page for the first note/);
  assert.doesNotMatch(html, /No authored photographs have been imported yet|INTERFACE STUDY|Interface study|尚未提供的个人信息|暂不公开|有意保持不完整/i);
});

test("photography archive contains every imported photograph", async () => {
  const all = await files(dist);
  const html = await readFile(new URL("photography/index.html", distUrl), "utf8");
  const script = await readFile(new URL("../public/site.js", import.meta.url), "utf8");
  const manifest = JSON.parse(await readFile(new URL("../src/data/photography.generated.json", import.meta.url), "utf8"));
  assert.equal(manifest.length, 82);
  assert.deepEqual(Object.fromEntries(["City", "Nature", "Humanities"].map((series) => [series, manifest.filter((photo) => photo.series === series).length])), {
    City: 44,
    Nature: 12,
    Humanities: 26,
  });
  assert.equal((html.match(/data-gallery-item(?=[\s>])/g) || []).length, manifest.length);
  assert.match(html, /data-photo-category="city"/);
  assert.match(html, /data-photo-category="nature"/);
  assert.match(html, /data-photo-category="humanities"/);
  assert.equal(all.filter((file) => file.endsWith(".webp") && path.relative(dist, file).startsWith("photos/")).length, manifest.reduce((total, photo) => total + photo.variants.length, 0));
  assert.match(script, /event\.key === "ArrowLeft"/);
  assert.match(script, /event\.key === "ArrowRight"/);
  assert.match(html, /data-lightbox-prev/);
  assert.match(html, /data-lightbox-next/);
});

test("photograph dimensions preserve rendered orientation and aspect ratio", async () => {
  const manifest = JSON.parse(await readFile(new URL("../src/data/photography.generated.json", import.meta.url), "utf8"));
  const styles = await readFile(new URL("../src/styles/global.css", import.meta.url), "utf8");
  for (const photo of manifest) {
    const largest = photo.variants.at(-1);
    const rendered = await sharp(fileURLToPath(new URL(`../public${largest.src}`, import.meta.url))).metadata();
    assert.equal(photo.width * rendered.height, photo.height * rendered.width, `${photo.source} should keep its rendered aspect ratio`);
  }
  assert.match(styles, /\.photo-study img \{[^}]*height: auto;[^}]*object-fit: contain;/s);
  assert.match(styles, /\.gallery-demo-card img \{[^}]*height: auto;[^}]*object-fit: contain;/s);
  assert.doesNotMatch(styles, /\.photo-study img \{[^}]*object-fit: cover;/s);
  assert.match(styles, /\.photo-category-grid \{[^}]*columns: 3 280px;/s);
  assert.match(styles, /\.gallery-demo-card:hover img[^}]*transform: scale\(1\.045\)/s);
});

test("all internal HTML links resolve", async () => {
  const all = await files(dist);
  const htmlFiles = all.filter((file) => file.endsWith(".html"));
  const available = new Set(all.map((file) => `/${path.relative(dist, file)}`));
  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
      const href = match[1].split(/[?#]/)[0];
      if (!href || href.startsWith("//")) continue;
      const localHref = basePath && href.startsWith(`${basePath}/`) ? href.slice(basePath.length) : href;
      const target = localHref.endsWith("/") ? `${localHref}index.html` : localHref;
      assert.ok(available.has(target), `${path.basename(file)} links to missing ${target}`);
    }
  }
});
