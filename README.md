# KBLLB — Link Selector Engine para Kino TV

Versión 1.0.5. Organiza fuentes, busca vídeos compatibles de Internet Archive y ordena URLs de vídeo que una fuente exponga directamente o que el navegador oculto de Kino capture durante una reproducción real.

## Selección de enlaces

- En modo automático, prioriza HLS/M3U8 porque puede permitir adaptación de calidad durante la reproducción.
- Si la URL indica una resolución, utiliza esa pista para ordenar alternativas. Si no se puede deducir, no inventa una resolución.
- Ordena los streams capturados por el navegador de Kino y devuelve alternativas cuando existen.
- Corrige patrones de extensiones y episodios para elementos de Internet Archive.

## Límites

El contrato actual de `resolve(ref)` no aporta por sí solo idioma preferido, pistas de subtítulos, velocidad de Internet en tiempo real ni estado del dispositivo. Por ello, esta versión no puede garantizar audio latino/castellano, detectar subtítulos en todos los reproductores ni medir el bitrate real. Esos datos requieren que cada fuente los exponga y un adaptador específico. La reputación de un servidor tampoco garantiza rapidez.

La preferencia HLS es una heurística, no una prueba de mayor velocidad. Las alternativas aparecen cuando se pueden obtener. El plugin no intenta acceder a contenido protegido ni eludir controles de acceso.

## Fuentes

Se conservan los enlaces externos configurados anteriormente. Las tarjetas de fuentes son accesos a páginas, no títulos individuales. Para buscar títulos, listar temporadas/capítulos y reproducir dentro del reproductor nativo de Kino, cada sitio requiere un adaptador propio. La búsqueda y los episodios implementados actualmente se limitan a elementos compatibles de Internet Archive.

## Actualizar

1. En Kino TV, abre Ajustes → Plugins y actualiza KBLLB a 1.0.5.
2. Si no aparece, elimina y vuelve a instalar `robertojuncochacon-oss/kBllB`.
3. Revisa los permisos de navegador oculto y hosts externos que solicite Kino.

Repositorio: https://github.com/robertojuncochacon-oss/kBllB
