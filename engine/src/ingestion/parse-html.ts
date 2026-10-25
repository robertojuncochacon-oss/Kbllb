import { load } from "cheerio";
import { contentHash, detectFormat, extractLanguage, extractQuality, inferMediaType, makeEntryId, normalizeTitle } from "../normalizer/normalize.js";
import type { MediaEntry, SourceConfig } from "../core/types.js";

export function parseHtmlLibrary(html: string, source: SourceConfig, fetchedAt = new Date().toISOString()): MediaEntry[] {
  const $ = load(html);
  const out: MediaEntry[] = [];
  const seen = new Set<string>();
  $("video[src], source[src], a[href], meta[property='og:video'], meta[name='twitter:player:stream']").each((_index, node) => {
    const element = $(node);
    const raw = element.attr("src") ?? element.attr("href") ?? element.attr("content");
    if (!raw) return;
    let url: URL;
    try { url = new URL(raw, source.url); } catch { return; }
    if (url.protocol !== "https:" || !source.allowedHosts.includes(url.hostname) || seen.has(url.href)) return;
    const format = detectFormat(url.href, element.attr("type") ?? "");
    const title = (element.attr("title") ?? element.attr("alt") ?? $("meta[property='og:title']").attr("content") ?? $("title").first().text() ?? url.pathname.split("/").pop() ?? "Untitled").trim();
    if (format === "other" && !/\.(mp4|m3u8|mpd|webm|mp3)(?:[?#]|$)/i.test(url.href)) return;
    seen.add(url.href);
    const base = { id: makeEntryId(source.id, url.href), title, normalizedTitle: normalizeTitle(title), originalTitle: title, description: String($("meta[name='description']").attr("content") ?? $("meta[property='og:description']").attr("content") ?? "").slice(0, 2000), genres: [], mediaType: inferMediaType(title + " " + url.href), streamUrl: url.href, sourceUrl: source.url, sourceId: source.id, externalIds: {}, quality: extractQuality(title + " " + url.href), language: extractLanguage(title), format, subtitles: [], fetchedAt, contentHash: "", availability: { ok: false, checkedAt: fetchedAt } };
    out.push({ ...base, contentHash: contentHash(base) });
  });
  return out;
}
