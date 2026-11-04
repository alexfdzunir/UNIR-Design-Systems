# Matriz de cobertura de QA de producción

La matriz evita que el QA se quede en una comparación de la primera pantalla. Es una lista de comprobación viva: constrúyela con la referencia Figma y complétala mientras se navega en producción.

## Filas obligatorias

Una fila representa una comprobación concreta. Usa una fila por combinación significativa de:

| Campo | Contenido |
| --- | --- |
| Ruta / flujo | URL exacta o paso de un flujo que se está auditando. |
| Referencia Figma | URL o nodo del frame/variante correspondiente. |
| Viewport | Ancho × alto, zoom si aplica y orientación en móvil. |
| Zona / módulo | Bloque de página: cabecera, hero, grid, formulario, footer, etc. |
| Componente / variante | Control específico y variante o contenido que se ve en ese contexto. |
| Estado / escenario | Reposo, hover, foco, error, menú abierto, vacío, etc. |
| Comparación | Qué se revisó: visual, contenido, interacción, accesibilidad, SEO/metadatos o rendimiento. |
| Resultado | `OK`, identificador de incidencia, `No especificado`, `No aplicable` o `Bloqueado`. |
| Evidencia | Captura, URL de producción y referencia de Figma; para un `OK`, basta una evidencia por módulo/estado representativo. |

No repitas filas de un componente idéntico por inercia. Sí añade una nueva cuando cambie su viewport, variante, contexto visual, contenido, comportamiento, orden responsive o regla de accesibilidad.

## Construcción del inventario

1. Empieza por los frames, páginas y breakpoints publicados en Figma. Anota el nodo y la ruta que representan.
2. Desglosa cada frame en módulos visuales de primer nivel, de arriba abajo. Incluye overlays y elementos sticky/fixed aunque no estén en el flujo normal.
3. Para cada módulo, extrae los controles o componentes que reciban foco, respondan al puntero, cambien estado, carguen datos o dirijan una navegación.
4. Añade las variantes visibles de Figma y los estados que producción exponga. Para formulario, menú, diálogo, carrusel, tabs, acordeón o filtro, representa cada estado relevante como escenario propio.
5. Añade todos los breakpoints definidos. Si solo hay desktop y móvil, inspecciona una anchura intermedia al menos cuando la composición cambia o existe una media query.

## Mínimos por clase

| Clase | Escenarios que deben tener fila cuando existan |
| --- | --- |
| Enlace o CTA | reposo, hover, foco teclado, activo, destino y nueva pestaña si procede |
| Botón | reposo, hover, foco, pressed, disabled/loading y acción resultante |
| Menú / navegación | cerrado, abierto, cada nivel, cierre, `Escape`, foco y enlaces internos/externos |
| Campo / formulario | reposo, foco, con valor, error, éxito, obligatorio, teclado, submit y mensajes |
| Selector, tabs, acordeón, carrusel, filtro | reposo, seleccionado, interacción, teclado y contenido resultante |
| Modal, banner, cookie, tooltip | apertura, cierre, foco inicial/final, `Escape`, clic fuera y scroll de fondo |
| Media | desktop/móvil, carga diferida, recorte, alt/caption y error observable |
| Contenido repetido | primer, intermedio y último item; variante truncada o copy largo si existe |

## Cierre de cobertura

Una matriz está cerrada solo cuando:

- Todas las rutas y frames acordados tienen filas en sus tamaños aplicables.
- Cada módulo visible tiene al menos una comparación visual y de contenido.
- Cada control interactivo tiene estados y comportamiento representados según la tabla anterior.
- Los cambios responsive tienen una fila por tamaño o transición.
- Cada `Incidencia` tiene una evidencia y una fila de Notion/Figma si el encargo lo exige.
- `No especificado`, `No aplicable` y `Bloqueado` incluyen motivo, en vez de ocultar una parte no probada.

Un resultado `OK` significa que se ha contrastado el alcance de la fila, no que la ruta completa queda aprobada.
