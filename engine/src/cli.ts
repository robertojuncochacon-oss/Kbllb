import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse } from "yaml";
import { validateSource } from "./ingestion/policy.js";
import { allowedByRobots } from "./ingestion/robots.js";
import { parseM3U } from "./ingestion/parse-m3u.js";
import { parseHtmlLibrary } from "./ingestion/parse-html.js";
import { parseJsonLibrary } from "./ingestion/parse-json.js";
import { readJson, writeJsonAtomic } from "./cache/json-store.js";
import { startScheduler } from "./scheduler/cron.js";
import type { SourceConfig, MediaEntry } from "./core/types.js";

interface SourcesFile { sources: SourceConfig[]; }
interface Config {
  indexPath: string;
  reportPath: string;
  network: { userAgent: string; timeoutMs: number; maxRetries: number; baseDelayMs: number; jitterMs: number; obeyRobotsTxt: boolean; requestsPerMinutePerHost: number; };
  scheduler: { enabled: boolean; cron: string; timezone: string; staleDays: number; };
}
interface Catalog { version: number; updatedAt: string; entries: MediaEntry[]; }
const log = (level: string, event: string, fields: Record<string, string | number | boolean> = {}): void => process.stdout.write(JSON.stringify({ level, event, at: new Date().toISOString(), ...fields }) + "\n");
const pause = (ms: number): Promise<void> => new Promise(resolvePause => setTimeout(resolvePause, ms));

async function fetchWithRetry(url: string, config: Config): Promise<Response> {
  let lastMessage = "unknown";
  for (let attempt = 0; attempt <= config.network.maxRetries; attempt++) {
    try {
      const response = await fetch(url, { headers: { "user-agent": config.network.userAgent, accept: "application/json, application/x-mpegURL, text/plain, text/html;q=0.8" }, signal: AbortSignal.timeout(config.network.timeoutMs) });
      if (response.ok) return response;
      lastMessage = "HTTP " + response.status;
      if (response.status < 500 && response.status !== 429) break;
    } catch (error) { lastMessage = String(error); }
    if (attempt < config.network.maxRetries) await pause(config.network.baseDelayMs * (2 ** attempt) + Math.random() * config.network.jitterMs);
  }
  throw new Error(lastMessage);
}

async function runIndex(config: Config, sourceFile: SourcesFile, configPath: string): Promise<void> {
  const startedAt = new Date().toISOString();
  const indexPath = resolve(configPath, "..", config.indexPath);
  const reportPath = resolve(configPath, "..", config.reportPath, new Date().toISOString().replace(/[:.]/g, "-") + ".json");
  const previous = await readJson<Catalog>(indexPath, { version: 1, updatedAt: new Date(0).toISOString(), entries: [] });
  const current = new Map(previous.entries.map(entry => [entry.id, entry]));
  const errors: { sourceId: string; message: string }[] = [];
  const hostLastRequest = new Map<string, number>();
  for (const source of sourceFile.sources) {
    const policy = validateSource(source);
    if (!policy.ok) { errors.push({ sourceId: source.id, message: policy.error.message }); log("warn", "source_rejected", { sourceId: source.id, reason: policy.error.code }); continue; }
    try {
      const url = new URL(source.url);
      const minGap = Math.ceil(60000 / Math.max(1, config.network.requestsPerMinutePerHost));
      const last = hostLastRequest.get(url.host) ?? 0;
      if (Date.now() - last < minGap) await pause(minGap - (Date.now() - last));
      if (config.network.obeyRobotsTxt && !(await allowedByRobots(source.url, source.url, config.network.userAgent))) {
        throw new Error("robots.txt no permite acceder a la URL de la biblioteca");
      }
      hostLastRequest.set(url.host, Date.now());
      const response = await fetchWithRetry(source.url, config);
      const text = await response.text();
      let entries: MediaEntry[] = [];
      if (source.type === "m3u") entries = parseM3U(text, source);
      else if (source.type === "json") {
        entries = parseJsonLibrary(JSON.parse(text) as unknown, source);
      } else {
        entries = parseHtmlLibrary(text, source);
      }
      for (const entry of entries) current.set(entry.id, entry);
      log("info", "source_scanned", { sourceId: source.id, entries: entries.length });
    } catch (error) {
      const message = String(error);
      errors.push({ sourceId: source.id, message });
      log("error", "source_failed", { sourceId: source.id, message });
    }
  }
  const catalog: Catalog = { version: 1, updatedAt: new Date().toISOString(), entries: [...current.values()] };
  await writeJsonAtomic(indexPath, catalog);
  await writeJsonAtomic(reportPath, {
    startedAt, finishedAt: catalog.updatedAt,
    newEntries: catalog.entries.filter(entry => !previous.entries.some(old => old.id === entry.id)).length,
    updatedEntries: catalog.entries.filter(entry => previous.entries.some(old => old.id === entry.id && old.contentHash !== entry.contentHash)).length,
    staleEntries: 0, removedEntries: 0, recalculatedGroups: 0, sourceErrors: errors
  });
  log("info", "index_run_complete", { entries: catalog.entries.length, errors: errors.length, indexPath });
}

async function main(): Promise<void> {
  const configPath = resolve(process.argv[2] ?? "config.yaml");
  const sourcePath = resolve(process.argv[3] ?? "sources.yaml");
  const config = parse(await readFile(configPath, "utf8")) as Config;
  const sourceFile = parse(await readFile(sourcePath, "utf8")) as SourcesFile;
  const run = (): Promise<void> => runIndex(config, sourceFile, configPath);
  await run();
  if (config.scheduler.enabled) {
    startScheduler({ expression: config.scheduler.cron, timezone: config.scheduler.timezone, enabled: true, run });
    log("info", "scheduler_started", { cron: config.scheduler.cron, timezone: config.scheduler.timezone });
  }
}
main().catch(error => { log("error", "fatal", { message: String(error) }); process.exitCode = 1; });
