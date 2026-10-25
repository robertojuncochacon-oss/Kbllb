# Integración provisional con Kino TV

## Límite del entorno

El plugin de Kino se ejecuta en el entorno de plugins de Kino. El indexador de esta carpeta se ejecuta como proceso Node.js persistente en Android/Termux. No se debe asumir que el plugin puede leer archivos locales de Termux, abrir localhost, ejecutar cron o compartir una base de datos con el proceso Android.

Para unir ambos procesos hace falta una URL HTTPS alcanzable desde Kino (por ejemplo, un endpoint propio protegido que sirva un catálogo de medios autorizado) o una API de almacenamiento documentada por Kino. No se ha configurado ni publicado ese endpoint y no se ha conectado aún el catálogo a plugin.js.

## Referencias estables

- Película: `kbllb:movie:<canonicalId>`
- Serie: `kbllb:series:<canonicalId>`
- Episodio: `kbllb:episode:<canonicalId>:s<season>e<episode>`

La función Kino `search(query)` debe devolver un único ítem por grupo deduplicado. `episodes(ref)` debe devolver episodios con referencias estables. `resolve(ref)` debe devolver un stream directo HTTPS que el reproductor acepte, y probar las alternativas del grupo cuando la fuente primaria falle.

## Contrato Stream esperado

- `url`: URL HTTPS directa a un archivo o manifiesto reproducible.
- `mime`: opcional; solo indicar `video/mp4` cuando se conoce que corresponde.
- `headers`: solo cabeceras legítimas necesarias para una fuente autorizada.
- `subtitles`: solo pistas directas y compatibles.
- `alternatives`: fuentes de respaldo del mismo contenido.

Los controles play/pause/seek normalmente los gestiona el reproductor. No se declaran hooks que el contrato de Kino no documente.

## Estado de implementación

El contrato anterior es provisional. Antes de afirmar que la reproducción está integrada, falta implementar un endpoint/almacenamiento accesible, adaptar el índice a ese contrato y probarlo dentro de la app Kino TV.
