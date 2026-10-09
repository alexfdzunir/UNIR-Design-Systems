# Agente de los sistemas de diseño de UNIR

Este repositorio alberga dos sistemas de diseño de Proeduca/UNIR y las herramientas que los enseñan y los conectan con Figma. Quien trabaje aquí (persona o agente) actúa como ingeniero de design systems: fiel a Figma, consistente con los componentes ya hechos y verificado en el explorador antes de dar nada por terminado. El idioma del repo es el español (README, stories, textos de ejemplo); el código, los commits y los comentarios del código van en inglés.

## Flujo de trabajo

1. **Sitúa la tarea.** Decide qué sistema toca (PrimeOne o AEM Portales) y en qué medio (código, Figma o ambos). Si la petición no lo dice y la respuesta cambia el trabajo, pregunta.
2. **Figma primero.** Toda la verdad visual está en Figma: lee el nodo con el MCP de Figma (`get_design_context`, `get_variable_defs`, `get_screenshot`) antes de escribir CSS o tokens. No inventes valores: medidas, colores y tipografía salen de las variables del fichero.
3. **Copia un hermano.** Antes de crear un componente, lee uno parecido de la misma carpeta y sigue su estructura, nombres y comentarios. Las carpetas y los helpers de abajo son la norma.
4. **Verifica en el explorador.** `npm run explorer` (puerto 4300) renderiza cada story con sus controles; comprueba el componente en los tres temas o en modo oscuro, y en móvil cuando tenga media queries. Para Code Connect, `npm run figma:parse` o `npm run figma:parse:aem`.
5. **Cierra.** Commits convencionales en inglés con ámbito (`feat(aem): ...`, `fix(figma): ...`, `docs: ...`), un cambio por commit. Nunca subas tokens ni `.env` (está en `.gitignore`).

## Mapa del repositorio

| Ruta | Qué hay |
| --- | --- |
| `src/components/<Nombre>/` | PrimeOne: `index.ts` (reexport de PrimeNG o componente propio), `*.stories.ts`, `*.figma.ts` |
| `src/theme/presets.ts` | Presets PrimeOne (Estudiantes, Prodi, Foundations) sobre Aura: paletas, radios, tipografía, CSS por componente |
| `src/figma/` | Helpers de Code Connect: `helpers.ts`, `props.ts`, `templates/` (PrimeOne) y `aem.ts` (AEM) |
| `src/stories/` | Datos y helpers compartidos de las stories PrimeOne (`bind`, `demo.ts`, `data.ts`, logo UNIR) |
| `src/aem/components/<nombre>/` | AEM: `nombre.css`, `nombre.js` si tiene comportamiento, `nombre.stories.ts`, `nombre.figma.ts` |
| `src/aem/styles/` | `tokens.css` (variables `--aem-*`), `typography.css`, `field.css`, `menu.css`, `brand.css`, `page.css` |
| `src/aem/stories/` | Helpers de las stories AEM (`helpers.ts`: `cx`, `attrs`, `icon`, `figmaNode`; `page-parts.ts`: piezas de página) |
| `src/aem/pages/<pagina>/` | Plantillas de página AEM montadas con los módulos; imágenes en `images/` |
| `src/aem/aem.css`, `aem.js`, `aem.d.ts` | Puntos de entrada de AEM: imports de todo el CSS, `initAem()` y sus tipos |
| `explorer/` | App Angular que enseña ambos sistemas (catálogo, componente real, panel de control, código, tokens, medidas) |
| `scripts/generate-explorer-index.mjs` | Genera `explorer/src/app/stories-index.ts` a partir de las stories (no se edita a mano) |
| `skills/` | Skills de Figma y design systems para Claude y Codex (ver abajo) |
| `tools/ds-agent/` | Banner del DS-Agent al abrir sesión: mod de Claude Code en `claude/` (activado en `.claude/settings.json`, se prueba con `claude plugin test tools/ds-agent/claude`) y hook `SessionStart` de Codex en `codex/` (registrado en `.codex/hooks.json`) |
| `reports/figma-audit/` | Informes de auditoría de la librería PrimeOne en Figma (Markdown y HTML) |
| `figma.config.json`, `figma.aem.config.json` | Configuración de Code Connect de cada sistema |

## Los dos sistemas

| | PrimeOne | AEM Portales |
| --- | --- | --- |
| Figma | `lWpcnToQVkqEqFifm67QaG` (Design system - PrimeOne) | `hT9BgF8wE5lXM54ldUcy9H` (componentes), `YgIL4otUrbrMOM9ibtxkjT` (páginas y landings) |
| Stack | Angular 21 + PrimeNG 21 (tema Aura) + componentes propios `prime-one-*` | HTML con clases BEM `aem-*`, CSS y JS vanilla, sin framework |
| Tokens | Variables `--p-*` de PrimeNG, más `--p-typography-*` y `--p-scale-*` de los presets | Variables `--aem-*` en `src/aem/styles/tokens.css` (core, semantic, responsive size) |
| Temas | Estudiantes, Prodi, Foundations: cambian sobre todo el radio de borde | Un solo tema |
| Modo oscuro | Clase `po-dark` en `<html>` (lo gestiona el preset) | Clase `aem-dark` en `<html>` o en un contenedor; `--inverse` lo fuerza en una sección |
| Responsive | Container queries en los componentes propios | Móvil por defecto, tablet desde 768px, escritorio desde 1280px |
| Título de story | `<Sección>/<Nombre>` (`Button/Button`, `Form/InputText`) | `AEM/<Sección>/<Nombre>` (`AEM/Buttons/Button`, `AEM/Pages/Home`) |
| Code Connect | `src/components/**/*.figma.ts`, etiqueta «Angular» | `src/aem/**/*.figma.ts`, etiqueta «AEM (HTML)» |
| Iconos | Phosphor (`ph ph-<nombre>`), pesos regular, bold y fill | Phosphor |
| Fuente | Proeduca Sans (`src/fonts/`) | Proeduca Sans |

Las secciones válidas de cada sistema están en `CATEGORIES` de `explorer/src/app/model.ts`; una story con una sección desconocida acaba en otra (Varios en PrimeOne, la última en AEM), así que añade la sección antes de usarla.

## PrimeOne (Angular)

- **PrimeNG donde existe, propio donde no.** Un componente de PrimeNG se reexporta desde `index.ts` (`export { Button } from 'primeng/button'`). Los patrones de Proeduca (chat, agenda, tareas, sidebar, question, inputs de teléfono, enlace y RGPD, cards...) son componentes standalone con selector `prime-one-*`, signals (`input()`, `model()`, `output()`), `ChangeDetectionStrategy.OnPush` y clases `po-*` en el host. Los que son campos de formulario extienden `PrimeOneValueAccessor` de `src/components/shared/value-accessor.ts`.
- **Versión de PrimeNG fijada:** `primeng >=21 <22`. PrimeNG 22 exige licencia comercial PrimeUI; no la subas.
- **Todo componente se exporta en `src/index.ts`** (salvo `Editor`: `quill` sería obligatorio para todos).
- **Estilos en el preset, no en ficheros CSS sueltos.** Los ajustes de Figma que Aura no cubre van en `src/theme/presets.ts`, por tema cuando difieren (radios, paginator) y compartidos cuando no (botones, stepper, accordion). Las variantes por instancia que PrimeNG no tiene como token (Tabs tamaño S) se aplican con `[dt]` (`src/components/Tabs/tabs.tokens.ts`).
- **Stories:** `title`, `decorators: [moduleMetadata({ imports: [...] })]`, `argTypes` con `control`, `options` y `description` tomados de la API real de PrimeNG o del componente propio, eventos como `action` en la categoría `Eventos`, `parameters.storyOrder` con el orden de las variantes, y `render` con `bind(args, INPUTS)` de `src/stories/helpers.ts` para que los controles sin valor dejen el default del componente. Una story exportada por variante de Figma.
- **Code Connect:** cabecera `// url=<PRIMEONE>?node-id=...`, `// source=` y `// component=`; `figma.selectedInstance` y los helpers `attr`, `flag`, `is`, `swapIcon` de `src/figma/helpers.ts`; las familias con varios sets de Figma comparten plantilla en `src/figma/templates/`. `metadata.nestable: true` cuando el componente se anida en otros.
- **Figma, componentes:** los sets de la librería tienen variantes `Size=M/S` y estados; los tokens de componente viven en la colección `Custom` > `Component/Common/<comp>/...` con alias a semánticas y code syntax `var(--component-common-...)`. Las primitivas (`green/50`, `scale/*`, `font/weight/*`) deben poder elegirse: scopes por tipo, nunca vacíos ni `ALL_SCOPES`.

## AEM Portales (HTML, CSS, JS)

- **Un componente es una carpeta** con su CSS (bloque BEM `aem-<nombre>`, elementos `__`, modificadores `--`, cabecera comentada con el nombre del componente en Figma y sus variantes), su story que devuelve HTML plano y, si se mueve, su JS. Cada CSS nuevo se añade a `src/aem/aem.css` en su grupo.
- **Tokens siempre:** colores, espaciados, radios y tipografía con `var(--aem-*)`; ningún valor fijo que exista como variable en Figma. Los tokens derivados que Figma no tiene (modo oscuro, texto sobre fills claros) se declaran en `tokens.css` con un comentario que lo diga.
- **JS sin dependencias:** `export function initX(root = document)`, busca `.aem-x:not([data-aem-ready])`, marca `data-aem-ready` para no inicializar dos veces, usa atributos ARIA (`aria-expanded`, `aria-controls`, `hidden`) y emite eventos `aem-*`. Se registra en `aem.js` (import, export e `initAem()`) y en `aem.d.ts`.
- **Stories:** `title: 'AEM/<Sección>/<Nombre>'`, `parameters.figmaUrl` con el nodo de Figma (`figmaNode('8512:12742')`), `docs.description.component` en español y una función `nombreHtml(args)` que construye el markup con `cx`, `attrs`, `icon`, `indent` de `src/aem/stories/helpers.ts`. El HTML de la story es el que ven el explorador y Figma: tiene que ser el markup real de un portal.
- **Páginas (`src/aem/pages/`):** se montan con los `render` de los módulos y los helpers de `src/aem/stories/page-parts.ts`; `parameters.order` fija su posición; las variantes de página (Eventos antes/durante/después, Cookies, Error 404) son stories con `name`. Los enlaces quedan en `href="#"`: la navegación entre plantillas la añade el explorador con las reglas de `explorer/src/app/frame/page-links.ts`. Imágenes en WebP dentro de `images/`, nombradas por contenido.
- **Code Connect:** los módulos reutilizan la story (`storyHtml(meta, args)` de `src/figma/aem.ts`), así el código que enseña Figma es el mismo del explorador. Publicar todo junto falla por el tamaño del fichero de Figma: publica por lotes de unos 6 ficheros con `npm run figma:publish:aem -- -f <ficheros>`.
- **Landings en Figma (fichero de páginas):** desktop 1920 con columna de 1438 y el formulario a la derecha fijo al hacer scroll (`numberOfFixedChildren` con el formulario en y=0; la Plugin API no tiene «sticky» del prototipo), acelerador en banda azul `color/background/accent`, y versiones tablet (768) y mobile (375) al lado con el formulario antes del footer y `sticky-button_module` fijo abajo. Al cambiar la variante `Device` de un módulo se pierden sus overrides internos: reaplícalos.

## Explorador

- Las stories son la única fuente: el explorador lee `title`, `args`, `argTypes`, `parameters` y cada export para construir catálogo, controles y variantes. Si una story funciona en Storybook, aparece en el explorador.
- `npm run explorer` regenera el índice y arranca `ng serve` en `http://localhost:4300`. El componente se renderiza en un iframe (`./?frame=1`): sin el servidor el iframe sale vacío, así que no lo pares mientras alguien lo usa; reinícialo solo tras tocar `angular.json`.
- Icono y resumen de cada ficha en `explorer/src/app/catalog-meta.ts` (`META` para PrimeOne, `AEM_META` para AEM), por título de story: un componente nuevo necesita su entrada.
- El panel Tokens muestra las variables CSS que usa el componente renderizado y el panel Medidas dibuja las cotas sobre el DOM real: úsalos para comparar con Figma.
- La build de producción no optimiza scripts (las plantillas se compilan en el navegador y la optimización borra los metadatos de los NgModules). No lo cambies.

## Figma y el MCP

- Antes de escribir en Figma con `use_figma`, carga la skill `figma-use` (o la equivalente del agente). Lee antes de escribir; renombra antes de borrar; no borres componentes ni variables sin confirmación.
- Naming de la librería: componentes en kebab-case, props y valores de variante en inglés y en Title Case, sin espacios en los bordes ni erratas; privados con prefijo `_`; cada componente con descripción.
- Técnica: `page.loadAsync()` antes de `findAllWithCriteria`; para huérfanos usa `getInstancesAsync` (cubre páginas no cargadas); renombra props de variante con `editComponentProperty(key, { name })` y valores renombrando los hijos del set. Con `skipInvisibleInstanceChildren` las capas ocultas por booleanos desaparecen de `children`.
- Los componentes privados de una librería (prefijo `.` o `_`) no se importan por key: se instancian desde el principal de una instancia que ya los contiene.
- La sesión del MCP puede dejar de sincronizar sin avisar y sus lecturas siguen mostrando lo escrito. En sesiones largas de escritura, pide al usuario que confirme un cambio visible tras cada bloque y nunca afirmes que algo está en el fichero solo porque el MCP lo devuelve.
- Publicar la librería en Figma es una acción del usuario; cuando dejes cambios sin publicar, dilo.

## Code Connect

```bash
npm run figma:parse          # valida PrimeOne (127 plantillas)
npm run figma:parse:aem      # valida AEM (56 plantillas)
FIGMA_ACCESS_TOKEN=<token> npm run figma:publish
FIGMA_ACCESS_TOKEN=<token> npm run figma:publish:aem -- -f src/aem/components/hero/hero.figma.ts ...
```

La CLI solo lee la variable de entorno `FIGMA_ACCESS_TOKEN` (scopes *Code Connect: Write* y *File content: Read*), no un `.env`; el token no se guarda en el repo. Cuando cambies props o valores en Figma, actualiza la plantilla afectada y republica; cuando cambies una story de módulo AEM, su Code Connect cambia con ella.

## Skills de `skills/`

Cada carpeta tiene un `SKILL.md` que se puede leer y seguir sin instalar nada. Úsalas ante estas tareas:

| Tarea | Skill |
| --- | --- |
| Auditar la librería de Figma (naming, huérfanos, duplicados, variantes, tokens de componente) e informe HTML | `skills/component-audit/SKILL.md` |
| Crear componentes en Figma desde descripción o tokens, con variantes ligadas a variables | `skills/component-generator/SKILL.md` |
| Documentar componentes desde Figma hacia Notion, MDX o Markdown | `skills/design-system-docs/SKILL.md` |
| Exportar o importar tokens (JSON, Style Dictionary, W3C DTCG) y compararlos | `skills/design-tokens-sync/SKILL.md` |
| Convertir un componente de Figma en código con props y Code Connect | `skills/figma-to-code/SKILL.md` |
| Generar un `DESIGN.md` portable (Open Design) desde Figma | `skills/figma-to-open-design/SKILL.md` |
| Diseñar colecciones, modos y aliases de variables en Figma | `skills/variable-architect/SKILL.md` |

Las auditorías se guardan en `reports/figma-audit/AAAA-MM-DD-<sistema>.md` y `.html` (plantilla `skills/component-audit/report-template.html`); una reauditoría del mismo día sobrescribe la anterior.

## Criterios de terminado

- El componente se ve en el explorador igual que en Figma en los tres temas (PrimeOne) o en claro y oscuro (AEM), y en móvil si tiene breakpoints.
- Sin valores fijos donde existe un token; sin referencias rotas a variables.
- Story con controles para todas sus propiedades y una variante por cada variante de Figma; entrada en `catalog-meta.ts`.
- Code Connect validado (`figma:parse`) y, si tienes token, publicado; si no, dicho en el resumen.
- Commit con el cambio y nada más: el índice del explorador generado se commitea; `dist/`, `storybook-static/` y `.env` no.
