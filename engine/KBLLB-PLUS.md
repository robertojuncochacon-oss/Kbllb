# KBLLB Plus — curación de fuentes para Kino TV

Branch: `KBLLB-plus`

## Fuentes incluidas
- Internet Archive: búsqueda y reproducción de archivos directos compatibles cuando los metadatos del elemento lo permiten y los derechos de ese elemento autorizan el uso.
- DocumentaryTube y DocumentaryMania: catálogo/descubrimiento de documentales; la tarjeta abre la web y no garantiza reproducción nativa.
- Footballia: descubrimiento de partidos históricos; no se trata como fuente de retransmisión en directo.
- TimeSoccerTV: programación deportiva; no se trata como proveedor de vídeo en directo.
- Anichi y AnimeSalt: descubrimiento de catálogos de anime; no se presupone que ofrezcan una URL directa autorizada para el reproductor.

## Política de respaldo
El respaldo nativo se ofrece solo cuando existen varias codificaciones MP4/WebM asociadas explícitamente al mismo archivo original de Internet Archive. No se cambia a otro sitio web para el mismo título sin resolver y verificar que ese sitio ofrece el mismo contenido en una URL directa y autorizada. Una página de inicio o un iframe no son una fuente de vídeo nativa.

## Límites actuales
- Los catálogos de terceros están presentados como enlaces de descubrimiento, no como integraciones de reproducción completas.
- No se ha verificado la ejecución dentro de la aplicación Kino TV.
- No se ha ejecutado el build ni las pruebas en esta rama.
- No se promete compatibilidad universal: depende de los formatos que admita el reproductor y de las restricciones de cada fuente.

## Validación recomendada
1. Instalar la rama `KBLLB-plus` como plugin independiente en Kino.
2. Comprobar que aparecen las cinco categorías.
3. Buscar un título del Internet Archive con una licencia apropiada.
4. Probar la reproducción y una variante alternativa del mismo elemento.
5. Comprobar que los enlaces de descubrimiento abren su página, sin etiquetarlos como reproducción nativa.
