import { execFile } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, readdir, rm, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const runFile = promisify(execFile);

const root = process.cwd();
const metadataPath = path.join(root, "src/data/photography.json");
const manifestPath = path.join(root, "src/data/photography.generated.json");
const outputDir = path.join(root, "public/photos");
const config = JSON.parse(await readFile(metadataPath, "utf8"));
const inputDir = Array.isArray(config)
  ? path.join(root, "src/assets/photos/inbox")
  : path.resolve(root, config.sourceDirectory ?? "图片");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp", ".heic", ".heif"]);
const naturalOrder = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

function slugFor(filename) {
  return path.basename(filename, path.extname(filename))
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

const discoveredRecords = Array.isArray(config)
  ? config
  : (await readdir(inputDir, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort(naturalOrder.compare)
      .map((source, index) => {
        const number = String(index + 1).padStart(2, "0");
        return {
          source,
          slug: slugFor(source),
          title: `Untitled ${number}`,
          titleZh: `无题 ${number}`,
          alt: `Untitled photograph ${number} by Yingjie Shi`,
          series: config.series ?? "Photography",
          ...(config.overrides?.[source] ?? {}),
        };
      });
const records = discoveredRecords;
const generated = [];
const temporaryDir = await mkdtemp(path.join(tmpdir(), "yingjie-photo-import-"));

const duplicateSlugs = records.map((record) => record.slug).filter((slug, index, all) => all.indexOf(slug) !== index);
if (duplicateSlugs.length) throw new Error(`Duplicate photo slugs: ${[...new Set(duplicateSlugs)].join(", ")}`);

await mkdir(outputDir, { recursive: true });
for (const filename of await readdir(outputDir)) {
  if (filename.endsWith(".webp")) await unlink(path.join(outputDir, filename));
}

try {
  for (const record of records) {
    if (!record.source || !record.slug || !record.title || !record.alt || !record.series) {
      throw new Error(`Photo records require source, slug, title, alt, and series: ${JSON.stringify(record)}`);
    }
    const originalInput = path.join(inputDir, record.source);
    await access(originalInput);
    const extension = path.extname(originalInput).toLowerCase();
    const input = extension === ".heic" || extension === ".heif"
      ? path.join(temporaryDir, `${record.slug}.jpg`)
      : originalInput;
    if (input !== originalInput) {
      await runFile("ffmpeg", ["-v", "error", "-y", "-i", originalInput, input]);
    }
    const metadata = await sharp(input).metadata();
    const widths = [640, 1280, 1920].filter((width) => width <= (metadata.width ?? width));
    if (!widths.length && metadata.width) widths.push(metadata.width);
    const variants = [];
    let renderedSize;
    for (const width of widths) {
      const filename = `${record.slug}-${width}.webp`;
      const destination = path.join(outputDir, filename);
      const output = await sharp(input)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 84, effort: 5 })
        .toFile(destination);
      renderedSize = { width: output.width, height: output.height };
      variants.push({ width, src: `/photos/${filename}` });
    }
    generated.push({
      ...record,
      width: renderedSize?.width,
      height: renderedSize?.height,
      variants,
    });
  }
} finally {
  await rm(temporaryDir, { recursive: true, force: true });
}

await writeFile(manifestPath, `${JSON.stringify(generated, null, 2)}\n`, "utf8");
console.log(`Imported ${generated.length} photo(s). GPS/EXIF metadata was not copied to generated files.`);
