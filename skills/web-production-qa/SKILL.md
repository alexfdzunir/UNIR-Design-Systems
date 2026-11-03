---
name: web-production-qa
description: Auditar una web en producción frente a sus últimos diseños de Figma, comprobando escritorio, móvil y estados interactivos, y registrar incidencias verificadas en Notion y Figma. Usar ante una petición de QA web, contraste producción–Figma, revisión visual/funcional o registro de bugs de una web.
---

# web-production-qa

## Resultado

Entregar un QA contrastado con el diseño fuente: cobertura declarada, incidencias reproducibles con prioridad y evidencia, registro persistido en Notion y, cuando se haya pedido, comparativas en Figma. Una diferencia no es una incidencia hasta que se haya visto tanto en producción como en la referencia aplicable.

## Inicio

En el primer mensaje de una ejecución nueva, pedir juntas estas tres entradas; no volver a preguntar por las que ya estén en el contexto:

1. La URL de producción que se va a evaluar.
2. La URL de Figma con los últimos diseños.
3. La URL de Notion para el registro, opcional.

Si no hay URL de Notion, comunicar que se creará una página de QA con la tabla indicada en [el esquema de Notion](references/notion-qa-schema.md). Si no existe una sesión de navegador autenticada, pedir al usuario que la abra antes de intentar escribir.

Antes de escribir fuera del entorno local, confirmar el destino: la página/base de Notion y, si procede, el lienzo o página de QA de Figma. No modificar las pantallas fuente de Figma; las evidencias viven en un lienzo o sección de QA separado.

## Recopilación

1. Lee Figma antes de evaluar: identifica las rutas, sus frames de escritorio y móvil, los componentes reutilizados, los estados documentados y las variantes de modal/formulario. Captura las referencias necesarias. Carga la skill `figma-use` antes de cualquier escritura con `use_figma`.
2. Descubre el alcance real de producción mediante navegación y las rutas públicas (sitemap, menú, enlaces internos o CMS). Declara las rutas finalmente revisadas.
3. Evalúa, como mínimo, el viewport de escritorio del diseño y el móvil del diseño. Si Figma no define dimensiones, usa 1440 px y 375 px de ancho. Recorre la página para activar carga diferida antes de concluir que una imagen está rota.
4. Registra errores de consola, peticiones fallidas, imágenes sin cargar, desbordamiento horizontal, títulos/landmarks y enlaces sin destino. No conviertas una advertencia de analítica de terceros en un bug de producto sin impacto observable.

## Bucle de QA

Para cada ruta y viewport:

- Compara jerarquía, contenido, espaciado, imágenes, tipografía, breakpoints, footer y cabecera con su frame de Figma.
- Prueba navegación principal y móvil, enlaces de CTA y footer, modales, sliders, cookies y formularios sin enviar datos reales.
- Prueba estados, no solo la pantalla base: `hover`, `active`, foco por teclado y `:focus-visible`, `disabled`, error de formulario, apertura/cierre y `Escape` cuando corresponda.
- Comprueba que el foco se puede percibir, que el orden de tabulación es utilizable y que el menú móvil actualiza sus atributos ARIA si los declara.

Prioriza las pruebas propias de cada interfaz. Por ejemplo, no marques como fallo la ausencia de un estado `disabled` en un enlace que nunca puede estar deshabilitado, pero sí un CTA sin foco perceptible al navegar por teclado.

## Criterio de incidencia

Registra solo hallazgos reproducibles. Cada uno necesita:

- Ruta, viewport y pasos de reproducción.
- Resultado esperado, con el frame o nodo de Figma aplicable cuando exista.
- Resultado observado e impacto.
- Tipo: visual, funcional, accesibilidad, contenido, rendimiento o metadatos/SEO.
- Prioridad basada en impacto y alcance; usa las opciones ya existentes en Notion. Si se crea la tabla, usa `Crítica`, `Alta`, `Media` o `Baja`.
- Una captura de producción. Para una diferencia visual, sitúala junto a la referencia de Figma. Para un fallo de estado o destino, la comparación puede incluir la referencia estática y una anotación breve de la interacción medida.

No inventes el comportamiento esperado de una interacción que Figma no define. Describe el efecto comprobable y márcalo como decisión pendiente cuando el destino deseado requiera producto.

## Evidencia en Figma

Cuando el usuario pida documentación en Figma:

1. Inspecciona primero el nodo de destino y conserva cualquier edición manual ya presente.
2. Lee la [guía de comentarios para desarrollo](references/developer-comments.md) antes de redactar anotaciones o filas de Notion.
3. Crea o actualiza una sección de QA separada. En su cabecera incluye el título, el alcance y dos accesos visuales: `Ver producción`, que enlaza a la URL auditada, y `Abrir Notion`, que enlaza al registro cuando exista. Hazlos enlaces clicables reales cuando la herramienta lo permita, con icono de enlace externo y apariencia de botón o chip con contraste, borde/fondo, padding y estado de enlace; no muestres URLs sin formato. Omite `Abrir Notion` cuando no haya registro.
4. Añade un bloque por incidencia: identificador, severidad, resumen, Figma a la izquierda y producción a la derecha. Todos los textos nuevos del tablero, las tarjetas, la cabecera y las anotaciones usan `Proeduca Sans`; reutiliza el estilo del fichero si ya existe y no lo sustituyas por una fuente de sistema.
5. Construye todos los contenedores nuevos con auto layout: tablero y tarjetas en vertical; cabecera, comparativas, filas y anotaciones en horizontal cuando agrupen elementos en paralelo. Usa padding, gap y reglas de crecimiento del auto layout; las columnas de referencia y producción deben ajustarse dentro de su fila, en lugar de posicionarse con coordenadas. Solo las flechas o anotaciones realmente superpuestas pueden usar posicionamiento absoluto.
6. Sube las capturas de producción como assets y usa los screenshots/frames de Figma como referencia. Añade junto a cada hallazgo una anotación breve etiquetada `Cambio`, con el texto de corrección de la guía. No sustituyas componentes ni frames de diseño aprobados.
7. Vuelve a leer o capturar el tablero resultante y comprueba que conserva `Proeduca Sans`, los enlaces visibles de cabecera y su estructura al redimensionar una tarjeta. Si la sesión de Figma es larga, pide al usuario que confirme visualmente cada bloque de escritura antes de continuar.

## Registro en Notion

Lee [el esquema de Notion](references/notion-qa-schema.md) antes de escribir.

- Con una URL de Notion: inspecciona su tabla y sus opciones de select antes de crear filas. Crea una página/fila por incidencia y completa todas las columnas requeridas; no dejes vacíos `Link Issue`, `Prioridad` ni `Tipo`.
- Sin URL de Notion: crea una página de QA y una tabla siguiendo el esquema. Comunica al usuario la URL creada.
- Escribe en `Comentarios Producto` el mismo mensaje de corrección simple que aparece en Figma, siguiendo la [guía de comentarios para desarrollo](references/developer-comments.md). Incluye ruta, viewport y evidencia en una segunda frase breve; evita que la investigación técnica sustituya a la instrucción de corrección.
- Tras crear o editar, recarga la página y verifica que todas las incidencias persisten. Espera a que Notion guarde antes de cerrar una página recién creada.

## Cierre

Resume las rutas y viewports cubiertos, las pruebas de estados realizadas, qué no se pudo comprobar y las incidencias por prioridad. Enlaza Notion y el tablero de Figma cuando existan. Indica explícitamente si no se modificó Figma o Notion por falta de autorización o sesión.

