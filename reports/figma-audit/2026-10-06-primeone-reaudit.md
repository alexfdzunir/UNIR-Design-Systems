# Audit Report: Design system - PrimeOne (reauditoría)

**Fecha:** 2026-10-06
**Archivo:** [Design system - PrimeOne](https://www.figma.com/design/lWpcnToQVkqEqFifm67QaG/Design-system---PrimeOne) (`lWpcnToQVkqEqFifm67QaG`)
**Alcance:** Reauditoría tras las correcciones · librería completa (132 páginas, 119 con contenido)
**Componentes analizados:** 331
**Score de salud:** 57/100 (62 base menos 5 por 1 problema crítico)

## Resumen ejecutivo

- **Score de 18 a 57.** Los 8 duplicados de la primera auditoría están resueltos. Queda 1 que entonces se pasó por alto: `fileupload`.
- **Scopes de variables**: de 2.999 con `ALL_SCOPES` a 61. Las 284 primitivas ya no salen en los selectores.
- **Naming**: 0 `Property 1`, 0 valores genéricos y 0 erratas. Los componentes custom están en kebab-case y en inglés.
- **1 duplicado exacto**: `fileupload` en FileUpload (`12371:104640`) y en FileUpload Popup (`505:29350`).
- **22 componentes con props o valores en español**, casi todos de Agenda, Question y Tareas+.
- **Sin cambios** en estados (botones sin foco), effect styles (126 de 129 duplicados) y los 20 huérfanos: no entraban en esta ronda.
- **"No usados" no es prescindible**: 25 plantillas de Code Connect apuntan a sus componentes. Moverlos a otro archivo rompería esas plantillas.

## Score de salud

| Métrica | Peso | Puntos | Motivo |
|---|---|---|---|
| Naming consistente | 25 | 18 | 44 de 331 componentes (13%): 2 con el nombre duplicado `fileupload`, 20 fuera de kebab-case (14 logos, 3 piezas de documentación y los 3 backups de Button) y 22 con props o valores en español. Ya no quedan `Property 1`, valores genéricos ni erratas. |
| Sin huérfanos | 20 | 15 | Los mismos 20 sets sin instancias: en esta ronda no se ha borrado nada. |
| Variantes completas | 25 | 14 | Sin cambios: botones sin foco, ítems de menú sin disabled, wrappers de formulario sin invalid ni disabled y 16 escalas de tamaño distintas. |
| Sin duplicados | 15 | 5 | Sin cambios: 126 de 129 effect styles en grupos duplicados, 6 pares de text styles idénticos y `zinc/50` = `neutral/50`. |
| Organización por páginas | 15 | 10 | Corregidos la errata de `FileUpload` y los espacios sobrantes en 13 páginas. Siguen las notas de trabajo en los nombres, 2 páginas vacías y un 28% de componentes con descripción. |
| **Base** | 100 | **62** | |
| Penalización | | **-5** | 1 crítico x 5 |
| **Total** | | **57** | |

## Antes y después

Cambios aplicados entre las dos auditorías: renombrado de componentes, props y valores, scopes de variables y nombres de página. No se ha borrado nada ni se han añadido estados. Code Connect se republicó (127 componentes) con las plantillas ajustadas a los nombres nuevos.

| Métrica | Primera auditoría | Ahora |
|---|---|---|
| Score de salud | 18 | **57** |
| Duplicados exactos (críticos) | 8 (+1 no detectado) | 1 |
| Componentes con problemas de naming | unos 60 (estimado) | 44 (contado) |
| Props `Property 1` | 11 | 0 |
| Valores genéricos (`State4`, `Variant2`) | 4 sets | 0 |
| Erratas en nombres, props y valores | 14 | 0 |
| Variables con `ALL_SCOPES` | 2.999 | 61 |
| Primitivas en todos los selectores | 284 | 0 |
| Páginas con erratas o espacios sobrantes | 13 | 0 |
| Componentes huérfanos | 20 | 20 |
| Effect styles en grupos duplicados | 126 de 129 | 126 de 129 |
| Componentes con descripción | 28% | 28% |

## Problemas críticos (1)

Duplicado exacto que ya existía en la primera auditoría y se pasó por alto al contar a mano. Esta vez la comprobación se hace por script sobre los 331 nombres.

| Componente | Ubicaciones (id) | Acción |
|---|---|---|
| `fileupload` | FileUpload `12371:104640` (custom) y FileUpload Popup `505:29350` (PrimeOne) | Renombrar el del popup a `fileupload-popup`, como su plantilla de Code Connect. No rompe nada: Code Connect va por node-id. |

> Casi duplicados, no críticos: `_inputchat-button-small` e `inputchat-button-small` (dos botones pequeños de InputChat, candidatos a unificar) y `_tieredmenu` frente a `tieredmenu`.

## Advertencias de naming (42)

Componentes que siguen fuera de la convención del archivo: kebab-case, en minúscula y en inglés.

### Fuera de kebab-case (20)

| Componentes | Página | Nota |
|---|---|---|
| 14 logos: `Logos`, `Logos Small`, `Logo UNIR`, `Logo MIU`, `Logotipo Qualentum`... | Logos | Son assets de marca. Si se quiere esa excepción, conviene documentarla. |
| `_Page Header`, `_Component Label`, `_Section Header` | Internal Components | Piezas de documentación: `_page-header`, `_component-label`, `_section-header`. |
| `_button-large_backup`, `_button_backup`, `_button-small_backup` | Button (Backup) | `_` en medio del nombre. Son backups sin uso. |

### Props o valores en español (22)

| Componente | Página | Props o valores |
|---|---|---|
| `agenda` | Agenda | `Filtro: Día, Tres días, Semana, Semana académica, mes, Agenda` |
| `agenda-weekday-cell` | Agenda | `Inicio: Lunes...Domingo` |
| `agenda-calendar-card` | Agenda | `Color: Verde, Morado` |
| `agenda-event-card` | Agenda | `State: Cancelado, Pendiente, Sin evento` |
| `agenda-month-body-cell` | Agenda | Booleanos `Eventos` y `Evento-todo el día 2..4` |
| `agenda-month-cell` | Agenda | Booleano `Link - Más eventos` |
| `agenda-time-cell` | Agenda | Booleano `Todo el día` |
| `question` | Question | `Rol`, `Tipo`, `Estado` y booleano `Añadir Respuesta` |
| `_question-options-generic` | Question | `State: Desplegado` |
| `_question-radio-true-false` | Question | `Correcta` |
| `task-column` | Tareas+ | `Type: Pendientes, Completadas, Vencidas/Descartadas` |
| `_task-type` | Tareas+ | `Tipo` |
| `_task-priority` | Tareas+ | `Prioridad` |
| `_task-due` | Tareas+ | `Estado` |
| `perfil` | Perfil | Nombre del set (en Code Connect es `profile`) |
| `sidebar` | Sidebar | Booleano `Perfil` |
| `sidebar-menu-item` | Sidebar | `Item: Mi espacio` |
| `tapbar-icon` | Tap Bar | `Item: Trámites, Académico, Mensajes...` |
| `_chatbox-attachment-card`, `_inputchat-attachment-card` | Chatbox, InputChat | `Item: Imagen, Archivo, Texto...` y `Foto` |
| `pdfviewer-bottom-bar` | PDF Viewer | `Tipo: Paginador, Editor` |
| `datatable-toolbar` | DataTable | Booleano `Añadir fila` |

> Los valores de dominio (días de la semana, estados de una tarea) pueden quedarse en español si el equipo lo decide. En ese caso conviene documentarlo como excepción y traducir solo los nombres de las props.

### Valores sin escala común

- Booleanos: `False/True` en 237 props, `No/Yes` en 36 y `Off/On` en 21.
- Tamaños: 16 escalas distintas en las props `Size`. Las más usadas son `Normal/Small/Large` (21 sets), `md/sm` (12), `Default/Small/Large` (10), `M/S` (8), `Medium/Small` (6), `XS..XL` (5) y `Desktop/Mobile` (5). Las otras 9 tienen 1 o 2 usos.
- Sets de una sola variante, que deberían ser componentes simples: `tapbar`, `menubar-menuitem-text`, `_profile-content`, `_question-options-generic`.

## Estilos y variables (133)

Comparación por valor, no por nombre. Effect styles y text styles siguen igual que en la primera auditoría. Las variables ya tienen scopes.

### Effect styles (126 de 129 en grupos duplicados, 117 sin uso)

| Grupo | Nº | Valor | Acción |
|---|---|---|---|
| `*/focus/ring/shadow` | 71 | Drop shadow 0/0/0, negro alpha 0 (invisible) | Eliminar |
| `*/overlay/shadow` y sombras de popups | 22 | 0 2 4 -2 + 0 4 6 -1, negro 10% | Un solo `overlay/shadow` |
| `*/shadow` de campos | 12 | 0 1 2, `#121217` 5% | Un solo `form/field/shadow` |
| `dialog`, `drawer`, `overlay/modal` | 3 | 0 8 10 -6 + 0 20 25 -5 | Un solo `overlay/modal/shadow` |
| `message/*` y `toast/*` por severidad | 12 | 0 4 8, casi negro 4% | Un estilo compartido |
| `button/raised`, `splitbutton/raised` y otros 2 pares | 6 | Idénticos | Uno por pareja |

### Text styles (6 pares idénticos)

| Estilo A | Estilo B | Valor |
|---|---|---|
| `Body/Body M Medium` | `Label/Label L Medium` | Medium 16/20 |
| `Body/Body M Regular` | `Label/Label L Regular` | Regular 16/20 |
| `Body/Body S Medium` | `Label/Label M Medium` | Medium 14/20 |
| `Body/Body S Regular` | `Label/Label M Regular` | Regular 14/20 |
| `Body/Body XS Medium` | `Label/Label S Medium` | Medium 12/16 |
| `Body/Body XS Regular` | `Label/Label S Regular` | Regular 12/16 |

> Sin uso: `Headline-1` y `Headline-2`. `Body/* Bold` sigue usando el peso SemiBold.

### Variables

| Colección | Variables | Con ALL_SCOPES | Ocultas | Sin descripción |
|---|---|---|---|---|
| Primitive | 297 | 0 | 284 | 292 |
| Semantic/Color Scheme | 82 | 0 | 0 | 82 |
| Semantic/Common | 60 | 2 | 0 | 60 |
| Component/Color Scheme | 347 | 0 | 1 | 347 |
| Component/Common | 1.687 | 57 | 0 | 1.687 |
| Custom | 1.099 | 2 | 0 | 1.099 |
| App | 6 | 0 | 0 | 6 |
| typography | 35 | 0 | 0 | 35 |

> Las 61 con `ALL_SCOPES` son 60 offsets (`focus/ring/offset`, `arrow/offset`, `group/offset`), para los que Figma no tiene scope, y `proeduca-fileupload/items/number`. Queda una primitiva duplicada: `zinc/50` = `neutral/50`.

## Componentes huérfanos (20)

Component sets o componentes con 0 instancias en todo el archivo. Son los mismos 20 de la primera auditoría, con los nombres nuevos.

| Componente | Página | Id | Variantes | Code Connect |
|---|---|---|---|---|
| `media-button` | Media button | `18725:23541` | 24 | No |
| `task-column` | Tareas+ | `19102:38482` | 12 | Sí |
| `Logo UNIR Universidad Internacional de la Rioja` | Logos | `18259:29802` | 8 | No |
| `country-dependency` | Dependencies | `12564:133364` | 6 | No |
| `Logos Small` | Logos | `18265:47810` | 6 | No |
| `timeline-progress` | Timeline | `16727:34245` | 5 | No |
| `skeleton-text` | Skeleton Text | `12596:140304` | 4 | Sí |
| `progressspinner-prime` | ProgressSpinner | `367:12862` | 4 | Sí |
| `_stepper-step-header-status` | Stepper | `12431:106006` | 3 | No |
| `fileupload-items` | FileUpload | `14270:60870` | 3 | No |
| `agenda-event-row` | Agenda | `17343:53101` | 3 | No |
| `buttonchip` | Chip | `18045:130597` | 3 | Sí |
| `Logo grid` | Logos | `18264:47304` | 3 | No |
| `_question-options` | Question | `12273:9704` | 2 | No |
| `confirmdialog` | ConfirmDialog | `323:12317` | 2 | Sí |
| `tieredmenu-popup` | TieredMenu | `2403:47612` | 2 | Sí |
| `pdfviewer-bottom-bar` | PDF Viewer | `12532:122291` | 2 | Sí |
| `menubar-separator`, `megamenu-separator`, `contextmenu-separator` | Menubar, MegaMenu, ContextMenu | `6598:27027`, `6580:31703`, `6580:27001` | 1 | No |

### Notas

- 7 de los 20 tienen Code Connect, es decir, están implementados en código. Que no tengan instancias en este archivo no significa que sobren.
- Antes de borrar cualquiera, comprobar en *Library analytics* si se usa en otros archivos.
- 153 sets solo tienen instancias en su propia página (subpiezas `_*` y ejemplos de documentación). La primera auditoría estimaba unos 230 a ojo; esta vez están contados.

## Variantes incompletas (11)

Sin cambios desde la primera auditoría. Se revisan foco, hover, disabled e invalid, contando tanto el valor dentro de `State` como una prop booleana aparte.

| Componente(s) | Falta | Impacto |
|---|---|---|
| `button`, `button-small`, `button-large`, `semantic-button*` | Focus | **Alto**: el componente más usado no tiene foco visible |
| `splitbutton` | Hover, Focus, Disabled | **Alto** |
| `select`, `multiselect`, `treeselect`, `documenttype`, `password`, `autocomplete` | Focus, Disabled, Invalid en el wrapper (la pieza `_*-input` sí tiene la matriz completa) | Medio |
| `datepicker` | Hover, Disabled, Invalid | Medio |
| `inputnumber`, `inputotp`, `inputlink` | Estados en general (solo tipo o tamaño) | Medio |
| `menu-item`, `menubar-item`, `megamenu-item`, `_tieredmenu-item`, `contextmenu-item`, `panelmenu-item` | Disabled | Medio |
| `tabs-tab` | Focus, Disabled | Medio |
| `sidebar-menu-item`, `sidebar-submenu-items`, `_topbar-button*`, `topbar-dropdown`, `buttonchip`, `chatbar-button-conversation` | Focus, Disabled | Medio |
| `knob`, `colorpicker`, `inputphone` | Hover | Bajo |
| `chip`, `autocomplete-chip` | Hover, Disabled | Bajo |
| `skeleton-loader` (`Theme`), `_question-options*` (`Darkmode`) | El tema va como variante en lugar de modo de variable | Medio |

## Organización por páginas (132)

132 páginas: 119 con contenido y 13 separadores. Ya no hay erratas ni espacios sobrantes en los nombres.

### A corregir

- **Notas de trabajo en nombres de página**: `[REVISAR]`, `[ACTUALIZAR]` (2), `(añadir colores al chevron)`, `[ELIMINAR O METER EN OTRO DOC]`, `(falta dar diseño nuevo. Preguntar a Cristina)`, `(Dudas notificaciones)`, `(añadir sombra o borde)`, `(documentar solo estudiantes) Surfaces`.
- **Estado en el nombre**: `✓`, `🟢`, `🔴`, `X` sin leyenda.
- **Páginas vacías**: `Selector de asignaturas` y `Playground`. `Custom`, `Estudiantes` y `No usados` hacen de separadores, pero sin el formato `---`.
- **"No usados"**: 24 páginas con 56 componentes. 25 plantillas de Code Connect apuntan a ellos, así que no se pueden mover a otro archivo sin rehacer esas plantillas.
- **`Instancias ZeroHeight`**: 77 secciones. La propia página pide moverlas a otro documento.
- **Descripciones**: 93 de 331 componentes (28%).

## Correcciones a la primera auditoría

Datos de la primera auditoría que estaban mal. Ninguno cambia sus conclusiones, salvo el score inicial.

- Había **9 duplicados exactos, no 8**: `fileupload` se pasó por alto al contar a mano. Con él, el score inicial habría sido 13 en lugar de 18.
- Son **132 páginas** (119 con contenido y 13 separadores), no 140.
- "No usados" tiene **24 páginas con 56 componentes**, no 30 páginas y unos 75 sets.
- Los sets usados solo en su propia página son **153** (contados), no unos 230 (estimados).
- Archivar "No usados" en otro archivo, como recomendaba, rompería 25 plantillas de Code Connect.
- El **recuento de instancias no es fiable** con la Plugin API: en las mismas 15 páginas dio 8.877, 20.365 y 28.585 en tres pasadas, según cuántas capas internas de instancias estuvieran cargadas. Se retira de las cifras. La detección de huérfanos usa `getInstancesAsync` y dio los mismos 20 en las dos auditorías.

## Recomendaciones priorizadas

1. **Renombrar el `fileupload` del popup a `fileupload-popup`**. Es el último crítico: el score sube a 62. No afecta a Code Connect, que va por node-id.
2. **Publicar la librería en Figma**. Code Connect ya usa los nombres nuevos. Hasta que se publique, los archivos que consumen la librería ven los antiguos y fallan los snippets de skeleton-text, timeline, inputchat, los chats y las cards.
3. **Añadir foco a `button` y sus variantes**. Prop booleana `Focus` como en `toggleswitch` o `paginator-navbutton`, y Disabled en los ítems de menú y en tabs.
4. **Limpiar los effect styles**. Borrar los 71 `focus/ring/shadow` invisibles y quedarse con unos 6 de elevación. 117 de los 129 no tienen uso.
5. **Decidir el idioma de los componentes custom**. Traducir los nombres de las 22 props en español y, si se quiere, mantener los valores de dominio documentados como excepción.
6. **Unificar tamaños y booleanos**. Pasar de 16 escalas de tamaño a una (`sm/md/lg`) y usar `False/True` en todos los booleanos.
7. **Revisar los 20 huérfanos con Library analytics**. 7 tienen Code Connect y están en código. Borrar solo los que no se usen en ningún archivo.
8. **Mantener "No usados" en el archivo o rehacer su Code Connect**. Si se archivan en otro documento, hay que mover también sus 25 plantillas de Code Connect.
9. **Pasar a kebab-case las piezas de documentación**. `_Page Header`, `_Component Label` y `_Section Header`: renombrado seguro, no tienen Code Connect.
10. **Escribir descripciones de uso**. Solo el 28% de los componentes tiene descripción. Empezar por los custom más usados.

## Metodología

- Inspección por Plugin API, solo lectura, de las 119 páginas con contenido en 8 llamadas paralelas (`page.loadAsync()` + `findAllWithCriteria`).
- Naming calculado por script: kebab-case, `Property N`, valores genéricos, erratas conocidas, props en minúscula y palabras en español.
- Duplicados comprobados sobre la lista completa de 331 nombres (exactos, sin distinguir mayúsculas y sin `_` inicial).
- Huérfanos con `getInstancesAsync` por variante; uso de estilos con `getStyleConsumersAsync`.
- Puntos de naming = 25 × (1 − 2 × afectados / total), redondeado hacia abajo. En la primera auditoría los afectados se estimaron a mano (unos 60).

Limitaciones:

- No incluye el uso desde otros archivos que consumen la librería.
- El español se detecta con un diccionario de palabras frecuentes: puede escaparse alguna.
- La cobertura de estados se basa en nombres de props y valores, no en una revisión visual.
