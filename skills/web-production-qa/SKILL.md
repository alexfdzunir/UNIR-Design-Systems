---
name: web-production-qa
description: Auditar exhaustivamente una web en producción contra Figma, componente a componente y módulo a módulo en escritorio, móvil y estados interactivos, y registrar incidencias verificadas en Notion y Figma. Usar ante una petición de QA web, contraste producción–Figma, revisión visual/funcional o registro de bugs de una web.
---

# web-production-qa

## Resultado

Entregar un QA trazable hasta el diseño fuente. Cada ruta queda cubierta por una matriz que enlaza frame de Figma, viewport, módulo, componente y estado con una de estas salidas: `OK`, `Incidencia`, `No especificado` o `Bloqueado`. No declarar un QA completo mientras la matriz tenga celdas sin revisar.

Una diferencia es una incidencia solo tras comprobarla en producción y en la referencia aplicable. La precisión importa: captura, mide y contrasta la discrepancia más pequeña que sea perceptible, funcional o semánticamente relevante; no conviertas diferencias de antialiasing o carga transitoria en bugs.

## Inicio

En el primer mensaje de una ejecución nueva, pedir juntas estas tres entradas; no volver a preguntar por las que ya estén en el contexto:

1. URL de producción que se va a evaluar.
2. URL de Figma con los últimos diseños.
3. URL de Notion para el registro, opcional.

Si no hay URL de Notion, comunicar que se creará una página de QA con la tabla indicada en [el esquema de Notion](references/notion-qa-schema.md). Si no existe una sesión de navegador autenticada, pedir al usuario que la abra antes de intentar escribir.

Antes de escribir fuera del entorno local, confirmar el destino: la página/base de Notion y, si procede, el lienzo o página de QA de Figma. No modificar las pantallas fuente de Figma; las evidencias viven en un lienzo o sección de QA separado.

## Matriz de cobertura

Lee [la matriz de cobertura](references/coverage-matrix.md) antes de navegar. Es el registro de trabajo: constrúyela antes de probar y ciérrala antes de informar resultados.

1. Lee Figma antes de evaluar. Para cada página y breakpoint, identifica el frame fuente, todos sus módulos, componentes reutilizados, variantes y estados diseñados. Carga `figma-use` antes de cualquier escritura con `use_figma`.
2. Descubre el alcance público real: sitemap, navegación, enlaces internos, CMS y rutas alcanzables. Declara qué rutas se excluyen y por qué.
3. Mapea cada frame de Figma contra su ruta de producción y registra sus dimensiones reales. Usa el ancho de Figma; solo usa 1440 px y 375 px cuando el diseño no lo defina. Añade los breakpoints intermedios si un módulo cambia de composición.
4. Descompón cada pantalla completa en zonas y módulos visibles. Después lista los componentes interactivos que contiene cada módulo. Un componente repetido se prueba en cada contexto que altere contenido, fondo, ancho, estado o comportamiento.

La matriz debe conservar los enlaces a Figma y producción. Una ruta sin frame, un módulo sin equivalente, un comportamiento no diseñado o un estado no alcanzable no se omite: se declara como `No especificado` o `Bloqueado`, con la razón.

## Ejecución: pasadas de alta fidelidad

Realiza las pasadas en este orden para cada ruta y viewport. Espera a que carguen tipografías, imágenes, animaciones y carga diferida antes de capturar; desplázate hasta el final y vuelve a inspeccionar elementos con lazy load. Repite la captura en estado estable y, cuando ayude, con movimiento reducido.

### 1. Pantalla y módulos

Compara el frame entero y después cada módulo, de arriba abajo. Revisa estructura, orden, visibilidad, anchuras, alturas, contenedores, alineación, gap, padding, fondo, borde, radio, sombras, recortes, imágenes, iconos, copy, tipografía, color y jerarquía. Contrasta la posición sticky/fixed, los cambios de orden y los elementos que aparecen o desaparecen entre breakpoints.

Usa capturas comparables y una superposición, medición del DOM o regla visual cuando permita detectar diferencias pequeñas. Aísla una incidencia por corrección: no agrupar bajo "diseño distinto" varias discrepancias de módulos o controles.

### 2. Componentes y contenido

Para cada componente de la matriz, confirma su variante, contenido, assets, tamaño, estados disponibles y contexto. Cubre al menos:

- Cabecera, navegación, menús multinivel, buscador, breadcrumbs, CTAs y controles de idioma/perfil.
- Hero, cards, listados, grids, carruseles, tabs, acordeones, filtros, paginación, vídeo y embeds cuando existan.
- Formularios: label, ayuda, obligatorio, placeholder, validación, error, éxito, reset y prevención de doble envío, sin enviar datos reales.
- Modales, banners, cookies, avisos, tooltips, notificaciones, chat y cualquier capa superpuesta.
- Footer, enlaces legales/sociales, suscripción y destinos externos.

Comprueba títulos, metadatos, idioma, imágenes alternativas, landmarks, relaciones label–campo y destinos de enlace. Registra como incidencia una discrepancia de copy, asset o SEO aunque no cambie la composición.

### 3. Estados, interacción y teclado

Prueba los estados que Figma muestra y los que la interfaz expone: reposo, hover, active/pressed, foco con teclado y `:focus-visible`, disabled, selected, loading, vacío, error, éxito, abierto/cerrado y hover de enlaces. Para controles que abren contenido, comprueba clic, `Enter`, `Space` cuando aplique, `Escape`, clic fuera, retorno de foco, bloqueo de scroll y atributos ARIA visibles en el DOM.

Recorre el flujo completo con teclado: skip link si existe, orden de tabulación, foco perceptible, ausencia de trampas y cierre de overlays. No presupongas variantes que el control no puede tener; marca su estado como `No aplicable` en la matriz.

### 4. Responsive y resiliencia

Repite los módulos que cambian de forma en todos los tamaños documentados, incluido el paso de escritorio a móvil. Comprueba scroll horizontal, recortes, áreas táctiles, teclado móvil, imágenes responsivas, texto largo, zoom 200 % y orientación si el producto lo soporta. Revisa errores de consola, recursos fallidos y destinos rotos, sin elevar avisos de terceros sin impacto observable.

## Criterio de incidencia

Registra solo hallazgos reproducibles. Cada incidencia necesita:

- Ruta, viewport, módulo/componente, estado y pasos de reproducción.
- Resultado esperado, con el frame o nodo de Figma aplicable cuando exista.
- Resultado observado e impacto.
- Tipo: visual, funcional, accesibilidad, contenido, rendimiento o metadatos/SEO.
- Prioridad basada en impacto y alcance; usa las opciones ya existentes en Notion. Si se crea la tabla, usa `Crítica`, `Alta`, `Media` o `Baja`.
- Captura de producción. Para diferencia visual, sitúala junto a la referencia Figma; para interacción, muestra el estado que permite reproducirla.

No inventes el comportamiento esperado de una interacción sin definición. Describe el efecto comprobable, márcalo como decisión pendiente y separa esa falta de definición de cualquier fallo de implementación observable.

## Evidencia en Figma

Cuando el usuario pida documentación en Figma:

1. Inspecciona primero el nodo de destino y conserva cualquier edición manual ya presente.
2. Lee la [guía de comentarios para desarrollo](references/developer-comments.md) antes de redactar anotaciones o filas de Notion.
3. Crea o actualiza una sección de QA separada. En su cabecera incluye el título, el alcance y dos accesos visuales: `Ver producción`, que enlaza a la URL auditada, y `Abrir Notion`, que enlaza al registro cuando exista. Hazlos enlaces clicables reales cuando la herramienta lo permita, con icono de enlace externo y apariencia de botón o chip con contraste, borde/fondo, padding y estado de enlace; no muestres URLs sin formato. Omite `Abrir Notion` cuando no haya registro.
4. Añade un bloque por incidencia: identificador, severidad, resumen, Figma a la izquierda y producción a la derecha. Todos los textos nuevos del tablero, las tarjetas, la cabecera y las anotaciones usan `Proeduca Sans`; reutiliza el estilo del fichero si ya existe y no lo sustituyas por una fuente de sistema.
5. Construye todos los contenedores nuevos con auto layout: tablero y tarjetas en vertical; cabecera, comparativas, filas y anotaciones en horizontal cuando agrupen elementos en paralelo. Usa padding, gap y reglas de crecimiento del auto layout; las columnas de referencia y producción deben ajustarse dentro de su fila, en lugar de posicionarse con coordenadas. Solo las flechas o anotaciones realmente superpuestas pueden usar posicionamiento absoluto.
6. Sube las capturas de producción como assets y usa los screenshots/frames de Figma como referencia. Añade junto a cada hallazgo una anotación breve etiquetada `Cambio`, con el texto de corrección de la guía. No sustituyas componentes ni frames de diseño aprobados.
7. Vuelve a leer o capturar el tablero resultante y comprueba que conserva `Proeduca Sans`, los enlaces visibles de cabecera, las columnas separadas por un gap visible y su estructura al redimensionar una tarjeta. Si la sesión de Figma es larga, pide al usuario que confirme visualmente cada bloque de escritura antes de continuar.

## Registro en Notion

Lee [el esquema de Notion](references/notion-qa-schema.md) antes de escribir.

- Con una URL de Notion: inspecciona su tabla y sus opciones de select antes de crear filas. Crea una página/fila por incidencia y completa todas las columnas requeridas; no dejes vacíos `Link Issue`, `Prioridad` ni `Tipo`.
- Sin URL de Notion: crea una página de QA y una tabla siguiendo el esquema. Comunica al usuario la URL creada.
- Escribe en `Comentarios Producto` el mismo mensaje de corrección simple que aparece en Figma, siguiendo la [guía de comentarios para desarrollo](references/developer-comments.md). Incluye ruta, viewport y evidencia en una segunda frase breve; evita que la investigación técnica sustituya a la instrucción de corrección.
- Tras crear o editar, recarga la página y verifica que todas las incidencias persisten. Espera a que Notion guarde antes de cerrar una página recién creada.

## Cierre

Entrega la matriz cerrada o lista explícitamente sus celdas `No especificado` y `Bloqueado`. Resume rutas, módulos, componentes, viewports y estados cubiertos; separa los hallazgos por prioridad e indica qué no se pudo comprobar. Enlaza Notion y el tablero de Figma cuando existan. Indica explícitamente si no se modificó Figma o Notion por falta de autorización o sesión.
