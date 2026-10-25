# KBLLB Media Index para Kino TV

Plugin de Kino TV para organizar las fuentes externas del usuario, buscar vídeos de Internet Archive y reproducir en el reproductor de Kino los enlaces directos que una página exponga públicamente y que sean compatibles.

## Categorías

- Películas y series
- Anime y animación
- Deportes y TV en directo
- Documentales y archivos
- Herramientas y referencias

Incluye los enlaces externos indicados por el usuario: Fly Stream, BingeBang, Cinebros, Zenox, Redflix, Nexa, Flixer, Boredflix, Anichi, AnimeSalt, AniHQ, Mirrors, WatchCartoonOnline, KissCartoon, KimCartoon, GoStreamEast, Strmd, TheTVApp, AuraSports, DamiTV, Footballia, MLB Live, Time Soccer TV, Documentary Mania, Documentary Tube, Internet Archive, FMHY, Leonflix, GNU Wget, Orionoid, Sanet y Hatt.

## Reproducción

- Los resultados de Internet Archive pueden reproducirse si hay un archivo original MP4, M4V o WebM compatible.
- Para una página externa, KBLLB intenta localizar únicamente enlaces directos visibles en etiquetas públicas de vídeo o metadatos (MP4, M4V, WebM o HLS/M3U8).
- Muchas páginas usan reproductores JavaScript, APIs privadas, autenticación, cookies, tokens temporales, DRM o servidores de terceros. En esos casos, la página puede aparecer en KBLLB pero **no reproducirse dentro de Kino**. No se intenta eludir esas protecciones ni extraer credenciales.
- No he podido verificar la reproducción de cada uno de los sitios dentro de tu instalación de Kino; cada fuente requiere una prueba real. La presencia en el catálogo no garantiza que ofrezca un enlace directo compatible.

## Actualizar

1. Abre Ajustes → Plugins en Kino TV.
2. Selecciona KBLLB y pulsa Buscar actualización/Actualizar si aparece.
3. Si no actualiza, elimina el plugin y vuelve a instalarlo con `robertojuncochacon-oss/kBllB`.
4. Revisa y acepta la lista de hosts solicitados. La versión actual declara permiso de reproducción para servidores públicos para que Kino pueda intentar abrir vídeos servidos por CDNs externos.

Repositorio: https://github.com/robertojuncochacon-oss/kBllB
