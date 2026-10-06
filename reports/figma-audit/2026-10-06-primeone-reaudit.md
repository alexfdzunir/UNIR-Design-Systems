# Audit Report: Design system - PrimeOne (reauditoría)

**Fecha:** 2026-10-06
**Archivo:** [Design system - PrimeOne](https://www.figma.com/design/lWpcnToQVkqEqFifm67QaG/Design-system---PrimeOne) (`lWpcnToQVkqEqFifm67QaG`)
**Alcance:** Estado actual frente a la auditoría de esta mañana · librería completa (132 páginas, 113 con contenido)
**Componentes analizados:** 331
**Score de salud:** 66/100 (sin críticos; 72 con los criterios de esta mañana)

## Resumen ejecutivo

- **0 referencias rotas** (eran 10.815 en 63 componentes). Los 114 alias rotos de las variables apuntan ya a tokens vivos, y unas 9.300 referencias de componentes se han reenlazado al token vivo del mismo nombre o, si no existía, por valor.
- **0 referencias a librerías externas**: unas 8.000 sustituidas por tokens locales, formularios y logos incluidos.
- **Score 66/100** con tokens y sin penalización. Con los criterios de esta mañana, de 18 a **72**: 0 duplicados (eran 9), 0 problemas de naming (unos 60), descripciones en el 100% (28%) y 61 variables con `ALL_SCOPES` (2.999).
- **Color de Text enlazado en los botones**: 126 capas solo icono de `button`, `button-small`, `button-large` y `semantic-button*` con su token, y `semantic-button-large` Success ya usa `button/success/color`.
- **SpeedDial ya no depende de componentes borrados**: sus 91 botones son instancias del `button` local, redondas con `button/rounded/border/radius`. Los otros 5 compuestos ya usaban `button`.
- **Variables core seleccionables**: 242 colores en rellenos, bordes y efectos; 38 de escala en espaciados, tamaños, radios y bordes, y 4 pesos en peso de fuente.
- **Sin cambios desde esta mañana** en estados (botones sin foco), effect styles (126 de 129 duplicados), escalas de tamaño y los 20 huérfanos.

## Score de salud

| Métrica | Peso | Puntos | Motivo |
|---|---|---|---|
| Naming consistente | 20 | 20 | 0 de 331 componentes fuera de convención. Esta mañana eran unos 60. |
| Sin huérfanos | 15 | 11 | Los mismos 20 sets sin instancias que esta mañana. No se ha borrado nada. |
| Variantes completas | 20 | 11 | Sin cambios: botones sin foco, ítems de menú y tabs sin disabled, wrappers de formulario sin invalid ni disabled y 17 escalas de tamaño. |
| Sin duplicados | 10 | 3 | Sin cambios: 126 de 129 effect styles en grupos duplicados (118 sin uso), 6 pares de text styles idénticos y `zinc/50` = `neutral/50`. |
| Organización por páginas | 15 | 13 | Descripciones del 28% al 100% y sin erratas en los nombres de página. Siguen las notas de trabajo, los estados con emoji y el `Índice` vacío. |
| Tokens de componente | 20 | 8 | 142 de 331 componentes limpios (43%). 0 referencias rotas y 0 externas. Siguen los colores fijos en logos, backups y documentación, y los tokens de otro componente en los inputs. |
| **Base** | 100 | **66** | |
| Penalización | | **-0** | 0 críticos x 5 |
| **Total** | | **66** | |

## Esta mañana y ahora

Estado del archivo en la auditoría de esta mañana y ahora. No se ha borrado ningún componente ni se han añadido estados. Esta mañana no se medían los tokens: las referencias rotas y externas ya existían, solo que no se contaban.

| Métrica | Esta mañana | Ahora |
|---|---|---|
| Score con los criterios de esta mañana (pesos 25/20/25/15/15, sin tokens) | 18 (13 con el duplicado no detectado) | **72** |
| Score completo (pesos nuevos, con tokens y referencias rotas) | n/d | **66** |
| Duplicados exactos | 9 | **0** |
| Componentes con problemas de naming | unos 60 | **0** |
| Props `Property 1` | 11 | **0** |
| Erratas en nombres, props y valores | 14 | **0** |
| Componentes con descripción | 28% | **100%** |
| Variables con `ALL_SCOPES` | 2.999 | **61** |
| Primitivas | En todos los selectores | **En los de su tipo** |
| Páginas con erratas o espacios sobrantes | 13 | **0** |
| Componentes huérfanos | 20 | 20 |
| Effect styles en grupos duplicados | 126 de 129 | 126 de 129 |
| Colores fijos en la capa `Text` de `button*` | n/d | **0** |
| Referencias a librerías externas | n/d | **0** |
| Componentes con referencias rotas | n/d | **0** |
| Componentes con tokens limpios | n/d | 142 de 331 (43%) |

> El score completo incluye la métrica de tokens, que esta mañana no se medía. Con los mismos criterios que entonces, la librería pasa de 18 a 72.

## Problemas críticos (0)

No quedan duplicados exactos ni referencias rotas. Los 9 duplicados de esta mañana están resueltos y las 10.815 referencias a variables borradas se han reenlazado a tokens vivos.

### Referencias rotas reenlazadas por familia (63 componentes, 10.815 referencias)

| Componentes | Nº | Referencias | Ejemplo de cambio |
|---|---|---|---|
| Inputs de formulario: `_select-*`, `multiselect-*`, `_treeselect-*`, `cascadeselect-*`, `autocomplete-*`, `textarea*`, `inputtext`, `checkbox`, `_inputgroup-addon`, `_inputphone-option` | 19 | 7.614 | `component common/select/typography/size` → `typography/body/Body-M/size` |
| Cards: `card-content`, `card-expandable`, `card-product`, `card-horizontal`, `card-horizontal-full` | 5 | 1.996 | Alias de `card/body/padding` → `scale/1` |
| Bottom sheet: `_bottomsheet-part`, `bottomsheet`, `_bottomsheet-keyboard` | 3 | 500 | `component common/bottomsheet/body/font/family` → `typography/core/family` |
| `button`, `button-small`, `button-large`, `semantic-button*` y los 3 backups | 9 | 234 | `component common/button/lg/font/size` → `button/lg/font/size`; alias de `button/outlined/success/border/color` → `green/700` |
| `avatar`, `badge`, `overlaybadge`, `tag`, `toast` | 5 | 170 | `component common/badge/typography/font/family` → `typography/core/family` |
| Chat: `inputchat`, `chatbox-content`, `chatbox-conversation`, `chatbar-*`, `_inputchat-button-small` | 6 | 96 | `semantic common/spacing/s/s` → `scale/*` por valor |
| `menubar`, `menubar-item`, `menubar-submenu`, `menubar-separator`, `paginator`, `paginator-navbutton` | 6 | 87 | `component common/paginator/summary/font/size` → `typography/body/Body-S/size` |
| `topbar`, `_topbar-button`, `_topbar-content`, `profile`, `steppermobile-circle` | 5 | 68 | Alias de `Component/Common/topbar/root/gap` → `scale/1-5` |
| Agenda: `agenda-content`, `agenda-event-card`, `agenda-month-body-cell`, `agenda-day-number`, `agenda-time-cell` | 5 | 50 | Tamaños y pesos de fuente → `typography/*` y `font/weight/*` por valor |

> Casi duplicados, no críticos: `_inputchat-button-small` e `inputchat-button-small` (dos botones pequeños de InputChat, candidatos a unificar) y `_tieredmenu` frente a `tieredmenu`.

## Advertencias de naming (0)

Esta mañana unos 60 componentes rompían la convención. Ahora los 331 están en kebab-case, en minúscula y en inglés, sin espacios sobrantes ni erratas en props y valores. Comprobado por script.

### Corregido desde esta mañana

| Problema | Esta mañana | Ahora |
|---|---|---|
| Duplicados exactos (`button-small`, `card-content`, `fileupload`...) | 9 | 0 |
| Props `Property 1` | 11 | 0 |
| Valores genéricos (`State4`, `Variant2`) | 4 sets | 0 |
| Erratas (`skaleton`, `Trascribing`, `Succes`, `Subtitule`, `Carrousel`...) | 14 | 0 |
| PascalCase, espacios o snake_case en el nombre (14 logos incluidos) | unos 40 | 0 |
| Props o valores en español (`Celda`, `Estado`, `Fondo Azul`, `Sin tag`...) | unos 15 sets | 0 |

> Code Connect está ajustado a las props nuevas. La plantilla de `toolbar` ahora encuentra `↪ Icon 1` y `↪ Icon 3`, que tenían un espacio inicial.

### Pendiente: valores sin escala común

- Booleanos: `False/True` en 237 props, `No/Yes` en 36 y `Off/On` en 21.
- Tamaños: 17 escalas distintas en las props `Size`. Las más usadas son `Normal/Small/Large` (14 sets), `md/sm` (12), `Default/Small/Large` (10), `M/S` (8), `Medium/Small` (6), `Desktop/Mobile` (5) y `XS..XL` (5).
- Sets de una sola variante, que deberían ser componentes simples: `tapbar`, `menubar-menuitem-text`, `_profile-content`, `_question-options-generic`.

## Tokens de componente (189)

Barrido de las capas propias de cada componente. En la raíz de una instancia solo cuenta lo que el componente sobrescribe. Un componente está limpio si no tiene referencias rotas ni colores fijos y al menos el 90% de sus referencias son tokens propios. Limpios: **142 de 331**. Referencias analizadas: 105.310.

### Referencias por tipo

| Tipo | Referencias | % |
|---|---|---|
| Tokens propios del componente | 74.064 | 70,3% |
| Primitivos y tipografía aplicados a pelo | 16.703 | 15,9% |
| Tokens de otro componente | 7.273 | 6,9% |
| Semánticos aplicados a pelo | 7.270 | 6,9% |
| Librerías externas | 0 | 0% |
| Variables borradas o alias rotos | 0 | 0% |

> Los primitivos suben porque muchas referencias rotas de tipografía y espaciado se han reenlazado por valor a `typography/*`, `scale/*` y `font/weight/*`. Es la opción que conserva el diseño; el siguiente paso sería crear tokens de componente para esos casos.

### Hecho hoy

| Cambio | Alcance |
|---|---|
| Color de la capa `Text` enlazado al token de su variante con texto | 126 capas en `button`, `button-small`, `button-large` y `semantic-button*` |
| `semantic-button-large` Success Idle | `button/success/hover/color` cambiado por `button/success/color` |
| Tokens externos sustituidos por tokens locales | Unas 8.000 referencias, formularios y logos incluidos |
| Alias rotos en variables | 114 entradas de modo apuntadas a tokens vivos |
| Referencias a variables borradas | Unas 9.300, reenlazadas al token vivo del mismo nombre o por valor |
| `speeddial`: instancias de componentes borrados | 91 cambiadas por el `button` local, con `button/rounded/border/radius` |
| Scopes de las variables core | 242 colores, 38 de escala y 4 pesos de nuevo seleccionables |

### Cómo se sustituyeron los tokens externos

- Variables borradas: el token vivo con el mismo nombre sin el prefijo antiguo (`component common/button/lg/font/size` → `button/lg/font/size`) o, si no existe, uno por valor.
- Mismo nombre en local (Estudiantes, Aura): el token local. En 13 tokens el valor local es distinto y manda el de PrimeOne, por ejemplo `datepicker/month/border/radius` 6 → 8 y `button/sm/icon/only/width` 34 → 30.
- Equivalentes con otro nombre: `card/border/radius`, `textarea/custom/char-count/color`, `proeduca-fileupload/*`, `button/icon/size` (20), `card/icon/S/size` e `icon/size` (16).
- Tipografía antigua (`Tipography`, `Typhography`): `typography/core/family` y la escala `typography/*` por valor. El estilo de fuente queda fijo.
- Números sin equivalente: la escala primitiva `scale/*` con el mismo valor. Colores sin equivalente: el más cercano de `surface/*`, `primary/*` o las primitivas, con una diferencia de 24 a 30 en RGB como máximo.
- Rellenos transparentes de las cards (alfa 0): eliminados. Logos, radio 1000 de `media-button` y trazo de 1 de los iconos: valor fijo.

### Componentes a revisar (además de los críticos)

| Componente | Problema |
|---|---|
| `_inputphone-input`, `textarea`, `inputtext`, `_select-input`, `multiselect-input` | Entre 650 y 1.000 tokens de otro componente cada uno; `_inputphone-input` usa los de `select` |
| `speeddial` | 364 referencias a `button/rounded/border/radius`: es el radio redondo de sus botones, sobrescrito en cada instancia |
| Logos | Colores fijos de marca (unos 1.600), sin equivalente en las paletas del DS |
| `_gettingstarter-topbar`, backups de Button | 1.549 y 732 colores fijos (documentación y backups sin uso) |
| `pdfviewer-bottom-bar`, `inputchat`, `colorpicker` | Entre 7 y 23 colores fijos |

## Estilos y variables (133)

Comparación por valor, no por nombre. Effect y text styles sin cambios desde esta mañana; los scopes de las variables sí cambian.

### Effect styles (126 de 129 en grupos duplicados, 118 sin uso)

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

> Sin uso: `Headline-1`, `Headline-2` y `Body/Body XS Medium`. `Body/* Bold` sigue usando el peso SemiBold.

### Variables

| Colección | Variables | ALL_SCOPES esta mañana | ALL_SCOPES ahora | Sin descripción |
|---|---|---|---|---|
| Primitive | 297 | 284 | 0 | 292 |
| Semantic/Color Scheme | 82 | 81 | 0 | 82 |
| Semantic/Common | 60 | 60 | 2 | 60 |
| Component/Color Scheme | 347 | 346 | 0 | 347 |
| Component/Common | 1.687 | 1.685 | 57 | 1.687 |
| Custom | 1.099 | 537 | 2 | 1.099 |
| App | 6 | 6 | 0 | 6 |
| typography | 35 | 0 | 0 | 35 |

> Las primitivas salen solo en los selectores de su tipo: colores en rellenos, bordes y efectos; `scale/*` en espaciados, tamaños, radios, bordes y efectos; `font/weight/*` en peso de fuente. Las 61 con `ALL_SCOPES` son 60 offsets (`focus/ring/offset`, `arrow/offset`, `group/offset`), para los que Figma no tiene scope, y `proeduca-fileupload/items/number`. Queda una primitiva duplicada: `zinc/50` = `neutral/50`.

## Componentes huérfanos (20)

Component sets o componentes con 0 instancias en todo el archivo. Son los mismos 20 que esta mañana, con sus nombres actuales.

| Componente | Página | Id | Variantes | Code Connect |
|---|---|---|---|---|
| `media-button` | Media button | `18725:23541` | 24 | No |
| `task-column` | Tareas+ | `19102:38482` | 12 | Sí |
| `logo-unir-larioja` | Logos | `18259:29802` | 8 | No |
| `country-dependency` | Dependencies | `12564:133364` | 6 | No |
| `logos-small` | Logos | `18265:47810` | 6 | No |
| `timeline-progress` | Timeline | `16727:34245` | 5 | No |
| `skeleton-text` | Skeleton Text | `12596:140304` | 4 | Sí |
| `progressspinner-prime` | ProgressSpinner | `367:12862` | 4 | Sí |
| `_stepper-step-header-status` | Stepper | `12431:106006` | 3 | No |
| `fileupload-items` | FileUpload | `14270:60870` | 3 | No |
| `agenda-event-row` | Agenda | `17343:53101` | 3 | No |
| `buttonchip` | Chip | `18045:130597` | 3 | Sí |
| `logo-grid` | Logos | `18264:47304` | 3 | No |
| `_question-options` | Question | `12273:9704` | 2 | No |
| `confirmdialog` | ConfirmDialog | `323:12317` | 2 | Sí |
| `tieredmenu-popup` | TieredMenu | `2403:47612` | 2 | Sí |
| `pdfviewer-bottom-bar` | PDF Viewer | `12532:122291` | 2 | Sí |
| `menubar-separator`, `megamenu-separator`, `contextmenu-separator` | Menubar, MegaMenu, ContextMenu | `6598:27027`, `6580:31703`, `6580:27001` | 1 | No |

### Notas

- 7 de los 20 tienen Code Connect, es decir, están implementados en código. Que no tengan instancias en este archivo no significa que sobren.
- Antes de borrar cualquiera, comprobar en *Library analytics* si se usa en otros archivos.
- 133 sets solo tienen instancias en su propia página (subpiezas `_*` y ejemplos de documentación).

## Variantes incompletas (11)

Sin cambios desde esta mañana. Comprobado de nuevo en `button`, `splitbutton`, `menu-item`, `tabs-tab`, `select`, `datepicker`, `chip` e `inputnumber`.

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

132 páginas: 113 con contenido, 13 separadores `---` y 6 vacías. Desde esta mañana se corrigieron las erratas y los espacios sobrantes de 13 páginas.

### A corregir

- **Notas de trabajo en nombres de página**: `[REVISAR]`, `[ACTUALIZAR]` (2), `(añadir colores al chevron)`, `[ELIMINAR O METER EN OTRO DOC]`, `(falta dar diseño nuevo. Preguntar a Cristina)`, `(Dudas notificaciones)`, `(añadir sombra o borde)`, `(documentar solo estudiantes) Surfaces`.
- **Estado en el nombre**: `✓`, `🟢`, `🔴`, `X` sin leyenda.
- **Páginas vacías**: `Índice [ACTUALIZAR]`, `Selector de asignaturas` y `Playground`. `Custom`, `Estudiantes` y `No usados` hacen de separadores, pero sin el formato `---`.
- **"No usados"**: 24 páginas con 56 componentes. 25 plantillas de Code Connect apuntan a ellos, así que no se pueden mover a otro archivo sin rehacer esas plantillas.
- **`Instancias ZeroHeight`**: 87 nodos de primer nivel. La propia página pide moverlos a otro documento. `Archive` ya guarda dos secciones (`Multimarca / Estilos Universidades` y `Chat IA - Textos legales`).
- **Descripciones**: 331 de 331 (100%). 5 de las heredadas de PrimeVue son genéricas o tienen erratas: `documenttype` y `_inputphone-prefix` (texto del antiguo Dropdown), `navbar-menu-popup` (texto de Menu) e `image` e `image-preview` (`tranformation`).

## Correcciones a la auditoría de esta mañana

Datos de esta mañana que estaban mal. Ninguno cambia sus conclusiones, salvo el score inicial.

- Había **9 duplicados exactos, no 8**: `fileupload` se pasó por alto al contar a mano. Con él, el score de esta mañana habría sido 13 en lugar de 18.
- Son **132 páginas** (119 con contenido y 13 separadores), no 140.
- "No usados" tiene **24 páginas con 56 componentes**, no 30 páginas y unos 75 sets.
- Los sets usados solo en su propia página son **133** (contados), no unos 230 (estimados).
- Archivar "No usados" en otro archivo, como se recomendaba, rompería 25 plantillas de Code Connect.
- El **recuento de instancias no es fiable** con la Plugin API: varía según cuántas capas internas estén cargadas. Se retira la cifra de 29.926. La detección de huérfanos usa `getInstancesAsync`.
- Recomendaba **ocultar las primitivas con scopes vacíos**. Eso impide seleccionarlas en Figma; ahora cada una tiene los scopes de su tipo.

## Recomendaciones priorizadas

1. **Añadir foco a `button` y sus variantes**. Prop booleana `Focus` como en `toggleswitch` o `paginator-navbutton`, y Disabled en los ítems de menú y en tabs.
2. **Limpiar los effect styles**. Borrar los 71 `focus/ring/shadow` invisibles y quedarse con unos 6 de elevación. 118 de los 129 no tienen uso.
3. **Crear tokens de componente donde hoy hay primitivos**. Las tipografías y espaciados reenlazados por valor (`typography/*`, `scale/*`) funcionan, pero un token de componente (`select/font/size`...) haría los ajustes por marca más sencillos.
4. **Revisar los tokens de otro componente en los inputs**. `_inputphone-input` usa los de `select`; `textarea`, `inputtext`, `_select-input` y `multiselect-input` tienen entre 650 y 1.000 cada uno. Alinear también `steppermobile` con `stepper-mobile/*`, `chatbar-*` con `inputchat/*` y `tapbar-icon` con `bottombar/*`.
5. **Unificar tamaños y booleanos**. Pasar de 17 escalas de tamaño a una (`sm/md/lg`) y usar `False/True` en todos los booleanos.
6. **Revisar los 20 huérfanos con Library analytics**. 7 tienen Code Connect y están en código. Borrar solo los que no se usen en ningún archivo.
7. **Revisar las descripciones heredadas**. `documenttype`, `_inputphone-prefix`, `navbar-menu-popup`, `image` e `image-preview` llevan el texto genérico de PrimeVue o una errata.
8. **Publicar la librería**. Los cambios de hoy (nombres, descripciones, tokens y scopes) no llegan a los archivos que la usan hasta publicarla.

## Metodología

- Inspección por Plugin API, solo lectura, de las 113 páginas con contenido en llamadas paralelas por grupos de páginas (`page.loadAsync()` + `findAllWithCriteria`).
- Naming por script: kebab-case, `Property N`, valores genéricos, espacios al inicio o al final, erratas conocidas y palabras en español en nombres, props y valores.
- Huérfanos con `getInstancesAsync` por variante; uso de estilos con `getStyleConsumersAsync`.
- Tokens con `token-sweep.js`. En la raíz de una instancia solo cuenta lo que el componente sobrescribe. Las pinturas se cuentan una vez. Las variables de otra librería son externas aunque su colección se llame Core o semantic, y las variables borradas que siguen enlazadas cuentan como referencias rotas.
- Referencias rotas reenlazadas por script: los alias de variables al token vivo equivalente, y los enlaces de componentes al token vivo con el mismo nombre o, si no existe, por valor. Verificado después en los 331 componentes: 0 rotas y 0 externas.
- Pesos: naming 20, huérfanos 15, variantes 20, duplicados 10, organización 15 y tokens 20, y 5 puntos menos por crítico. Para comparar con esta mañana se calcula también con sus pesos (25/20/25/15/15) y sin tokens: 72.

Limitaciones:

- No incluye el uso desde otros archivos que consumen la librería.
- El español se detecta con un diccionario de palabras frecuentes: puede escaparse alguna.
- La cobertura de estados se basa en nombres de props y valores, no en una revisión visual.
- El token propio se decide por el nombre: si el componente y la raíz del token no coinciden (`steppermobile` y `stepper-mobile`), cuenta como token de otro componente.
- Esta mañana no se medían los tokens, así que no hay cifras de entonces para compararlas.
