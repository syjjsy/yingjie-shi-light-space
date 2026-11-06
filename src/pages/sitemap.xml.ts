import { researchStories } from "../data/research";
import { withBase } from "../utils/paths";

export const prerender = true;

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] ?? character);

export async function GET({ site }: { site: URL }) {
  const paths = ["/", "/research/", "/publications/", "/photography/", "/about/", ...researchStories.map((story) => `/research/${story.slug}/`)];
  const urls = paths.map((path) => `<url><loc>${escapeXml(new URL(withBase(path), site).href)}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
