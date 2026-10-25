# KBLLB Media Index para Kino TV

Plugin de Kino TV para organizar fuentes externas y buscar títulos de Internet Archive. La versión 1.0.4 corrige los patrones de archivos y episodios y mejora la selección de enlaces de vídeo.

## Qué hace ahora

- Busca títulos públicos en Internet Archive y muestra vídeos que tengan un archivo compatible.
- Para páginas que exponen directamente varias URLs de vídeo, prioriza HLS/M3U8, que permite al reproductor adaptar la calidad a los cambios de conexión. Si la página expone varias calidades como MP4/WebM, presenta alternativas etiquetadas cuando se puede reconocer la resolución.
- Cuando el navegador oculto de Kino logra capturar varios streams de una página que realmente inicia un reproductor, los ordena por HLS y por resolución reconocible y presenta alternativas.
- Corrige la detección de extensiones de vídeo y nombres de episodios que impedía encontrar archivos de Internet Archive.

## Límite importante sobre la velocidad

Kino no entrega al plugin una medición fiable y directa de la velocidad actual de Internet ni de las capacidades del dispositivo. Por eso KBLLB no puede prometer que mida el ancho de banda en tiempo real ni elegir siempre el bitrate perfecto. La opción más inteligente disponible es priorizar HLS cuando la fuente lo ofrece, porque el reproductor puede ajustar la calidad; si solo hay archivos progresivos, KBLLB usa la información que la página publica y ofrece alternativas cuando las encuentra.

## Fuentes externas

Se conservan las fuentes externas añadidas anteriormente: Fly Stream, BingeBang, Cinebros, Zenox, Redflix, Nexa, Flixer, Boredflix, Anichi, AnimeSalt, AniHQ, Mirrors, WatchCartoonOnline, KissCartoon, KimCartoon, GoStreamEast, Strmd, TheTVApp, AuraSports, DamiTV, Footballia, MLB Live, Time Soccer TV, Documentary Mania, Documentary Tube, Internet Archive, FMHY, Leonflix, GNU Wget, Orionoid, Sanet y Hatt.

**Una página de inicio no es una película.** Para que una de esas webs permita buscar títulos, enumerar temporadas/capítulos y reproducirlos dentro del reproductor nativo de Kino, hace falta un adaptador específico que entienda su catálogo y su reproductor. El navegador oculto solo puede capturar peticiones de vídeo cuando la página abre un contenido; no convierte automáticamente una portada en un catálogo completo.

KBLLB solo intenta usar URLs públicas y reproducibles que la fuente expone. No elude DRM, inicios de sesión, CAPTCHA, muros de pago ni protecciones de reproductores.

## Actualizar

1. Abre Ajustes → Plugins en Kino TV.
2. Actualiza KBLLB a la versión **1.0.4**.
3. Si no aparece la actualización, elimina y vuelve a instalar `robertojuncochacon-oss/kBllB`.
4. Si Kino solicita permisos de navegador oculto o reproducción desde servidores externos, revisa el consentimiento antes de aceptarlo.

Repositorio: https://github.com/robertojuncochacon-oss/kBllB
