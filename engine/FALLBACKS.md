# Kino TV: fallback policy and source portal

## Native playback and backup behavior

Kino's native player can automatically switch between alternate copies of the **same media item** when the primary direct stream is unavailable or unsupported. The plugin returns a primary `url` and up to eight `alternatives`; each alternative must be a direct playable URL, not a homepage, search result, or embedded player page.

This release adds that native fallback path for Internet Archive items only when the Archive metadata explicitly associates multiple MP4/WebM encodings with the same original file. Each alternative is labelled in Kino's server/source menu. This avoids silently switching to a different clip from the same archive collection.

## Source portal vs. native player

A source portal can show alternative websites for discovery, but those are **not equivalent to native-player fallback**. Kino's player cannot automatically play a website homepage. To make a provider eligible for native playback, the adapter must resolve the selected movie/episode/event to a direct, public, supported media URL (MP4 or HLS/DASH where supported), and the source must be authorized to distribute it. If a provider requires a login, DRM bypass, CAPTCHA bypass, or private player API, it is not an eligible fallback.

## Planned provider groups

- Public-domain / rights-verified films and documentaries: Internet Archive items whose individual metadata and rights allow the intended use.
- Documentary discovery: DocumentaryTube and DocumentaryMania as discovery links only until direct-media rights and endpoints are verified.
- Football history: Footballia as a discovery link only until an authorized direct playback integration is documented.
- Sports schedules: TimeSoccerTV as schedule/metadata, not a live stream provider.
- Anime and general entertainment: do not enable automatic cross-site playback unless a licensed API/feed or user-authorized library provides stable item IDs and direct playable URLs.

## Reliability policy

1. Never use a backup for a different title or episode.
2. Prefer HTTPS direct streams and formats supported by Kino's player.
3. Keep source labels visible so the user can choose a copy manually.
4. Do not claim a fallback works until it has been tested inside Kino on Android.
5. The Termux indexer and the Kino plugin are separate runtimes. A local index file is not automatically visible to Kino; connect them only through a reachable HTTPS endpoint or a documented Kino storage API.

## Validation status

The source change is committed, but runtime validation inside Kino has not yet been performed. The current fallback implementation covers multiple compatible encodings of the same Internet Archive original only; it does not yet implement cross-provider fallback for films, series, documentaries, or live sports.
