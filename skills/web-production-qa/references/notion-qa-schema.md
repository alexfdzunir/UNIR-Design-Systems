# Esquema de Notion para QA de producción

Usa este esquema tanto al crear una tabla nueva como al verificar una tabla existente. Si la tabla existente usa otros nombres, mapea cada propiedad antes de crear incidencias; no dejes sin completar el equivalente.

| Columna | Tipo | Cómo completarla |
| --- | --- | --- |
| `Issue` | Título | Identificador estable y resumen: `[QA-01] Mensajes de validación en inglés`. |
| `Link Issue` | URL | Enlace directo al bloque de QA en Figma. Si no hay Figma, enlaza la ruta de producción afectada. Nunca dejar vacío. |
| `Prioridad` | Select | Usa las opciones de la tabla. En una tabla creada por la skill: `Crítica`, `Alta`, `Media`, `Baja`. |
| `Tipo` | Select | Usa las opciones de la tabla. En una tabla creada por la skill: `Visual`, `Funcional`, `Accesibilidad`, `Contenido`, `Rendimiento`, `Metadatos/SEO`. |
| `Estado` | Select | Usa el flujo existente. En una tabla creada por la skill: `Backlog`, `En curso`, `Resuelto`, `No reproducible`; una incidencia nueva empieza en `Backlog`. |
| `Fecha creación` | Fecha de creación o fecha | Nunca dejar vacía. Configúrala como propiedad de creación automática al crear una tabla y verifica que queda poblada. Si la tabla existente usa una fecha manual, asigna la fecha actual. |
| `Comentarios Producto` | Texto enriquecido | Incluye ruta y viewport, pasos, esperado, observado, impacto y dónde está la evidencia. |

Para crear una tabla nueva, nómbrala `QA <nombre del producto> <mes año>` y crea al menos esas columnas. Antes de cerrar el QA, comprueba que cada fila tiene valor en `Link Issue`, `Prioridad`, `Tipo`, `Estado`, `Fecha creación` y `Comentarios Producto`; el cuerpo de la página no sustituye el comentario de la tabla.

## Valores de prioridad

- `Crítica`: bloqueo de conversión, seguridad, indisponibilidad o incumplimiento legal amplio.
- `Alta`: funcionalidad principal rota, enlace clave sin destino, discrepancia que impide completar una tarea o problema de accesibilidad grave.
- `Media`: discrepancia visible importante, contenido/localización incorrecta o estado interactivo degradado sin bloquear todo el flujo.
- `Baja`: detalle de acabado sin impacto funcional directo.

## Regla de enlace

El valor de `Link Issue` debe llevar a una evidencia concreta: el bloque de incidencia de Figma si se creó, o la URL exacta de producción reproducible. Cuando haya ambas, usa Figma en la columna y añade producción en `Comentarios Producto`.
