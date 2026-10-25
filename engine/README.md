# KBLLB index engine (Android / Termux)

Separate Node.js indexer for libraries you own or are licensed to process. It does not modify Kino TV itself. Kino runs the plugin in its own sandbox; this CLI runs in Termux and stores a JSON index. A transport between the index and Kino still requires a reachable HTTPS endpoint or a documented Kino storage API; see KINO-INTEGRATION.md.

## Install and run

    cd engine
    npm install
    npm test
    npm run build
    npm run index

The default config schedules daily scans at 03:00 in the configured timezone. The process must remain running for the scheduler to fire; on Android, Termux may need battery-optimization exemptions and a wake lock. To run one scan only, set scheduler.enabled to false.

## Current implementation status

- M3U: parses HTTPS media entries only when the target host is allowlisted.
- JSON: accepts records with explicit direct media URL fields (streamUrl, stream_url, file, url or mediaUrl); metadata-only records are not treated as playable.
- HTML: extracts direct media URLs explicitly present in common video/source/link/meta elements; it does not crawl paginated detail pages yet.
- Source authorization, HTTPS and host allowlists are checked. robots.txt is consulted for the configured library URL, requests have timeouts, retries with exponential backoff and jitter, and per-host spacing.
- Title normalization, quality/language detection, Levenshtein similarity, grouping, weighted scoring, BM25-style lexical search, JSON persistence and a cron scheduler are implemented as separate modules.
- The current CLI is an initial scaffold: incremental re-grouping, probing every stream's MIME/availability, historical reliability storage, stale/deleted-entry aging, full pagination, automatic fallback resolution, full test coverage target and Kino transport are not yet wired end-to-end. JSON writes are atomic but this is not a production-ready database.
- Semantic search is disabled in the sample config.

Only process sources you own or have permission to index and play. authorized=true is an operator declaration, not independent legal verification. The source allowlist is empty until you add your own libraries.
