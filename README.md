# KBLLB Media Index para Kino TV

Plugin de Kino TV que organiza un directorio de fuentes multimedia por categorías y permite buscar/reproducir vídeos compatibles alojados en Internet Archive.

## Estructura

- `kino-plugin.json`: manifiesto que Kino lee al instalar el plugin.
- `plugin.js`: entrada ES module única. Kino carga un único archivo JavaScript; por eso el catálogo y los proveedores están reunidos en este archivo.
- `README.md`: instalación, límites y pruebas manuales.

## Categorías incluidas

- Películas y series
- Anime y animación
- Deportes y TV en directo
- Documentales y archivos
- Herramientas y referencias

El directorio contiene los enlaces proporcionados para Fly Stream, BingeBang, Cinebros, Zenox, Redflix, Nexa, Flixer, Boredflix, Anichi, AnimeSalt, AniHQ, Mirrors, WatchCartoonOnline, KissCartoon, KimCartoon, GoStreamEast, Strmd, TheTVApp, AuraSports, DamiTV, Footballia, MLB Live, Time Soccer TV, Documentary Mania, Documentary Tube, Internet Archive, FMHY, Leonflix, GNU Wget, Orionoid, Sanet y Hatt.

## Reproducción y límites

- La reproducción integrada está implementada únicamente para archivos originales MP4/M4V/WebM compatibles alojados en Internet Archive.
- Las demás fuentes aparecen como **localizadores** con su dirección externa en la descripción; no se extraen ni se descifran sus reproductores.
- No hay scraping de páginas de terceros ni extracción automática de enlaces HLS/DASH, cookies, tokens o enlaces protegidos. Las páginas externas pueden cambiar, exigir cuenta, no estar disponibles o no tener autorización para reproducir su contenido.
- Verifica que tienes derecho a acceder al contenido y cumple las condiciones del servicio y las leyes aplicables.

## Instalar en Kino TV

1. Publica este repositorio en GitHub; Kino necesita que el repositorio sea público para leer los archivos.
2. En GitHub, abre **Settings → General → Danger Zone → Change repository visibility → Public**.
3. En **About → ⚙ → Topics**, añade el topic `kino-plugin` para que pueda descubrirse en la sección comunitaria.
4. En Kino TV abre **Ajustes → Plugins → Agregar** y escribe `robertojuncochacon-oss/kBllB`.
5. Revisa los hosts solicitados y acepta solo si estás de acuerdo.

## Validación recomendada

La guía oficial de Kino recomienda validar el plugin con el SDK del proyecto de referencia antes de publicarlo:

- https://kinotvapp.github.io/kino-plugins/
- https://github.com/kinotvapp/kino-plugin-archive

Cuando tengas Node.js 18 o superior, clona el repositorio y ejecuta el validador del SDK si has copiado la carpeta `sdk/` del plugin de referencia. También conviene probar `search`, `home`, `browse` y `resolve` en una instalación real de Kino TV.

## Estado

Código inicial creado para Kino TV. La compatibilidad de instalación y la reproducción deben confirmarse con el validador oficial y una prueba dentro de Kino TV; no se afirma que los sitios externos funcionen siempre.
