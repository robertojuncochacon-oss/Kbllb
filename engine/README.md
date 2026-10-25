# KBLLB index engine (Android / Termux)

Separate Node.js indexer for libraries you own or are licensed to process. It does not modify Kino TV itself. Kino runs the plugin in its own sandbox; this CLI runs in Termux and stores a JSON index. A transport between the index and Kino still requires a reachable HTTPS endpoint or a Kino-supported storage API.

## Setup

    cd engine
    npm install
    npm test
    npm run build
    npm run index

Current support: M3U entries are parsed only for HTTPS URLs on allowlisted hosts. JSON currently reports metadata counts but does not pretend metadata is a playable stream. HTML requires a source-specific adapter and is not scraped generically. Robots policy, retry settings, scheduler, deduplication, scoring and search modules are present, but the production CLI does not yet wire all of them into one end-to-end daily pipeline. Incremental deletion aging, media probing and the full Kino transport remain TODO.

Only process sources you own or have permission to index and play. authorized=true is an operator declaration, not independent legal verification.
