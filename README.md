# KBLLB — motor de enlaces nativos para Kino TV

Versión 1.0.8. Devuelve el objeto Stream del contrato de Kino: `url`, `mime` opcional, `subtitles`, `audioTracks`, `label` y `alternatives`.

## Resolución

- Detecta URLs HTTPS directas expuestas en elementos `video`, `source` y metadatos habituales.
- Reconoce HLS (`.m3u8`), DASH (`.mpd`) y archivos `.mp4`, `.m4v`, `.webm`, `.mkv`.
- Prefiere manifiestos adaptativos HLS/DASH cuando son detectables y ordena alternativas con señales de calidad presentes en la URL.
- Extrae subtítulos SRT/VTT de etiquetas `<track>` cuando la página expone URLs directas.
- Intenta usar el navegador oculto de Kino como segundo método, si está disponible y autorizado.
- Resuelve archivos públicos compatibles de Internet Archive.

## Límites

Audio y subtítulos se incluyen solo si la fuente expone pistas utilizables. Las pistas de audio integradas en HLS o en archivos de vídeo las administra el reproductor nativo; el plugin no inventa URLs separadas. No mide la velocidad real de Internet ni garantiza idioma, calidad o estabilidad que la fuente no declare. No intenta superar DRM, inicios de sesión, CAPTCHA, paywalls o controles de acceso. Si no encuentra un stream directo, devuelve un error en lugar de una página HTML.

Las tarjetas de sitios externos son accesos a páginas, no títulos individuales. La búsqueda y episodios automáticos están implementados para Internet Archive; cada proveedor externo requiere un adaptador propio.

## Instalación

1. En Kino TV, abre Ajustes → Plugins.
2. Instala o actualiza desde `robertojuncochacon-oss/KbllB`.
3. Autoriza hosts y navegador oculto solo cuando estés de acuerdo.

Repositorio: https://github.com/robertojuncochacon-oss/KbllB
