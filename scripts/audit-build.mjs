import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const failures = [];

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory)) {
    const target = path.join(directory, entry);
    if ((await stat(target)).isDirectory()) output.push(...await walk(target));
    else output.push(target);
  }
  return output;
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
let totalBytes = 0;
let largest = { file: "", bytes: 0 };

for (const file of files) {
  const size = (await stat(file)).size;
  totalBytes += size;
  if (size > largest.bytes) largest = { file, bytes: size };
  check(size <= 5 * 1024 * 1024, `${path.relative(dist, file)} exceeds Retiehe's 5 MB per-file limit`);
}

for (const file of htmlFiles) {
  const relative = path.relative(dist, file);
  const html = await readFile(file, "utf8");
  check(/<!doctype html>/i.test(html), `${relative}: missing HTML doctype`);
  check(/<html[^>]+lang=(?:"[^"]+"|'[^']+')/i.test(html), `${relative}: missing document language`);
  check(/<title>[^<]+<\/title>/i.test(html), `${relative}: missing page title`);
  check(/<meta[^>]+name="description"[^>]+content="[^"]+"/i.test(html), `${relative}: missing meta description`);
  check(/<link[^>]+rel="canonical"[^>]+href="https:\/\//i.test(html), `${relative}: missing HTTPS canonical URL`);
  check((html.match(/<h1(?:\s|>)/gi) || []).length === 1, `${relative}: expected exactly one h1`);
  check(!/<script[^>]+src="https?:\/\//i.test(html), `${relative}: loads third-party JavaScript`);
  check(!/Lorem ipsum|candidate-only|RTH_API_KEY/i.test(html), `${relative}: contains placeholder or secret-like text`);

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    check(/\balt=(?:"[^"]*"|'[^']*')/i.test(match[0]), `${relative}: image is missing alt text`);
  }
}

for (const required of ["404.html", "robots.txt", "sitemap.xml", "site.js", ".nojekyll"]) {
  check(files.some((file) => path.relative(dist, file) === required), `missing required output: ${required}`);
}

if (failures.length) {
  console.error(`Build audit failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Build audit passed: ${htmlFiles.length} HTML pages, ${files.length} files, ${(totalBytes / 1024 / 1024).toFixed(2)} MB total.`);
  console.log(`Largest file: ${path.relative(dist, largest.file)} (${(largest.bytes / 1024).toFixed(1)} KB).`);
  console.log("Checked titles, descriptions, canonical URLs, heading structure, image alternatives, third-party scripts, placeholder leakage, and Retiehe file limits.");
}
