import { contentHash, detectFormat, extractLanguage, extractQuality, inferMediaType, makeEntryId, normalizeTitle } from "../normalizer/normalize.js";
import type { MediaEntry, SourceConfig } from "../core/types.js";
function record(value: unknown): Record<string, unknown> { return typeof value === "object" && value !== null ? value as Record<string, unknown> : {}; }
function str(value: unknown): string { return typeof value === "string" || typeof value === "number" ? String(value) : ""; }
export function parseJsonLibrary(input: unknown, source: SourceConfig, fetchedAt = new Date().toISOString()): MediaEntry[] {
  const root = record(input);
  const response = record(root.response);
  const items = Array.isArray(root.items) ? root.items : Array.isArray(root.entries) ? root.entries : Array.isArray(root.results) ? root.results : Array.isArray(response.docs) ? response.docs : [];
  const out: MediaEntry[] = [];
  for (const raw of items) {
    const item = record(raw);
    const urlValue = str(item.streamUrl ?? item.stream_url ?? item.file ?? item.url ?? item.mediaUrl);
    if (!urlValue) continue;
    let url: URL;
    try { url = new URL(urlValue, source.url); } catch { continue; }
    if (url.protocol !== "https:" || !source.allowedHosts.includes(url.hostname)) continue;
    const title = str(item.title ?? item.name ?? item.originalTitle ?? item.identifier) || url.pathname.split("/").pop() || "Untitled";
    const mime = str(item.mime ?? item.mimeType ?? item.type);
    const format = detectFormat(url.href, mime);
    const yearRaw = Number(item.year);
    const durationRaw = Number(item.durationSeconds ?? item.duration);
    const genresRaw = item.genres ?? item.genre ?? [];
    const genres = (Array.isArray(genresRaw) ? genresRaw : [genresRaw]).map(str).filter(Boolean);
    const base = { id: makeEntryId(source.id, url.href), title, normalizedTitle: normalizeTitle(title), originalTitle: str(item.originalTitle) || title, description: str(item.description).slice(0, 2000), ...(Number.isInteger(yearRaw) && yearRaw > 1800 && yearRaw < 2200 ? { year: yearRaw } : {}), genres, ...(str(item.thumbnail ?? item.poster) ? { thumbnail: str(item.thumbnail ?? item.poster) } : {}), ...(Number.isFinite(durationRaw) && durationRaw > 0 ? { durationSeconds: durationRaw } : {}), mediaType: inferMediaType(title + " " + url.href), streamUrl: url.href, sourceUrl: source.url, sourceId: source.id, externalIds: {}, quality: extractQuality(title + " " + url.href), language: extractLanguage(title), format, subtitles: [], fetchedAt, contentHash: "", availability: { ok: false, checkedAt: fetchedAt } };
    out.push({ ...base, contentHash: contentHash(base) });
  }
  return out;
}
