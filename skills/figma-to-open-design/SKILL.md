---
name: figma-to-open-design
description: Convertir un archivo o componente Figma en un sistema de diseño DESIGN.md portable compatible con Open Design (open-design.ai). Usar cuando el usuario quiera exportar su design system de Figma a Open Design, generar un DESIGN.md desde variables o estilos de Figma, crear un sistema portable para agentes de código (Claude Code, Codex, Cursor, Gemini), o publicar su brand en el ecosistema awesome-design-md. Activar ante "figma a open design", "generar DESIGN.md", "exportar design system a agentes", "convertir Figma a DESIGN.md", "open-design.ai desde Figma", "sistema portable para agentes".
---

# figma-to-open-design

## Objetivo

Extraer el design system de un archivo Figma y generar un `DESIGN.md` válido de 9 secciones, compatible con Open Design (`nexu-io/open-design`), Google Stitch y cualquier agente de código.

## Contexto: formato DESIGN.md

Open Design usa el esquema canónico de 9 secciones (originado en Google Stitch / VoltAgent/awesome-design-md):

| § | Sección | Contenido |
|---|---------|-----------|
| 1 | Visual Theme & Atmosphere | Mood, densidad, filosofía de diseño |
| 2 | Color Palette & Roles | Nombre semántico + hex + rol funcional |
| 3 | Typography Rules | Familias tipográficas, jerarquía completa |
| 4 | Component Stylings | Botones, cards, inputs, navegación con estados |
| 5 | Layout Principles | Escala de espaciado, grid, whitespace |
| 6 | Depth & Elevation | Sistema de sombras, jerarquía de superficies |
| 7 | Do's and Don'ts | Guardrails de diseño y anti-patrones |
| 8 | Responsive Behavior | Breakpoints, touch targets, estrategia de colapso |
| 9 | Agent Prompt Guide | Referencia rápida de color + prompts listos para usar |

El archivo resultante se coloca en:
```
design-systems/
└── <nombre-brand>/
    ├── DESIGN.md        ← output principal
    ├── preview.html     ← catálogo visual (opcional)
    └── preview-dark.html (opcional)
```

## Flujo principal

### 1. Recopilar contexto

Preguntar si falta:
- URL o fileKey del archivo Figma
- Nombre del brand / sistema de diseño
- ¿Tiene variables (colecciones) o solo estilos de color/texto?
- ¿Modos? (light/dark, multi-brand)
- ¿Generar también `preview.html`?

### 2. Extraer datos de Figma

```
Figma:get_variable_defs(nodeId="<fileKey>")
Figma:get_design_context(nodeId="<page-root-nodeId>", depth=2)
Figma:get_libraries(fileKey="<fileKey>")
```

Recopilar:
- Variables de color (primitivos y semánticos) con sus valores por modo
- Estilos de texto: familias, tamaños, pesos, line-height, letter-spacing
- Estilos de efecto: sombras (tipo, desplazamiento, blur, spread, color)
- Componentes principales: botones, inputs, cards, navegación
- Espaciado: escala de spacing si existe como variable FLOAT

### 3. Inferir tema y atmósfera

Derivar del conjunto de datos:
- **Densidad**: compacto / equilibrado / espacioso (basado en escala de padding)
- **Paleta base**: clara / oscura / neutra / colorida
- **Personalidad**: corporativa / editorial / técnica / creativa / minimalista
- **Filosofía**: describir en 2-3 frases el estilo visual percibido

Si hay modo dark: describir ambas atmósferas.

### 4. Mapear colores semánticos

Transformar variables/estilos a tabla semántica:

```markdown
| Token | Hex | Rol |
|-------|-----|-----|
| background | #FFFFFF | Canvas principal, superficies de página |
| surface | #F5F5F5 | Cards, modales, paneles |
| surface-raised | #FFFFFF | Popovers, tooltips |
| border | #E5E5E5 | Divisores, bordes de input |
| text-primary | #111111 | Cuerpo principal, headings |
| text-secondary | #666666 | Labels, subtítulos, placeholders |
| text-disabled | #AAAAAA | Estados deshabilitados |
| accent | #3B82F6 | CTA, links, focus rings |
| accent-hover | #2563EB | Hover sobre accent |
| success | #22C55E | Confirmaciones, estados OK |
| warning | #F59E0B | Alertas no críticas |
| error | #EF4444 | Errores, estados destructivos |
```

Si hay modo dark, incluir tabla separada con sufijo `-dark`.

### 5. Mapear tipografía

Para cada estilo de texto encontrado:

```markdown
| Rol | Familia | Tamaño | Peso | Line-height | Letter-spacing |
|-----|---------|--------|------|-------------|----------------|
| display | Inter | 48px | 700 | 1.1 | -0.02em |
| h1 | Inter | 36px | 700 | 1.2 | -0.01em |
| h2 | Inter | 24px | 600 | 1.3 | 0 |
| h3 | Inter | 20px | 600 | 1.4 | 0 |
| body-lg | Inter | 18px | 400 | 1.6 | 0 |
| body | Inter | 16px | 400 | 1.6 | 0 |
| body-sm | Inter | 14px | 400 | 1.5 | 0 |
| label | Inter | 12px | 500 | 1.4 | 0.02em |
| mono | JetBrains Mono | 14px | 400 | 1.5 | 0 |
```

### 6. Mapear componentes

Para cada componente principal detectado, describir:
- Background, border-radius, padding, gap
- Estado default + hover + focus + disabled + error
- Referencia a tokens de color y tipografía

Ejemplo para Button:

```markdown
**button-primary** — CTA principal
Background {colors.accent}, text {colors.background}, border-radius {rounded.md} (8px),
padding 10px 20px, font {typography.label} (14px / 500).
Hover: background {colors.accent-hover}. Disabled: opacity 0.4.

**button-secondary** — Acción secundaria
Background transparent, border 1.5px solid {colors.border}, text {colors.text-primary}.
Hover: background {colors.surface}.

**input-text** — Entrada de texto
Background {colors.surface}, border 1px solid {colors.border}, border-radius {rounded.sm} (6px),
padding 10px 14px, font {typography.body} (16px / 400).
Focus: border-color {colors.accent}, box-shadow 0 0 0 3px {colors.accent}20.
Error: border-color {colors.error}.
```

### 7. Mapear espaciado

```markdown
| Token | Valor | Uso típico |
|-------|-------|-----------|
| spacing.xs | 4px | Gap entre icono y label |
| spacing.sm | 8px | Padding interno compacto |
| spacing.md | 16px | Padding estándar |
| spacing.lg | 24px | Separación entre secciones |
| spacing.xl | 40px | Padding de sección |
| spacing.2xl | 64px | Separación de bloques mayores |
```

Grid: detectar si hay 12 columnas, gutter y margin estándar.

### 8. Mapear sombras

```markdown
| Token | CSS | Superficie |
|-------|-----|-----------|
| shadow.sm | 0 1px 2px rgba(0,0,0,0.06) | Inputs, avatares |
| shadow.md | 0 4px 12px rgba(0,0,0,0.10) | Cards, dropdowns |
| shadow.lg | 0 8px 24px rgba(0,0,0,0.14) | Modales, sidebars |
| shadow.xl | 0 16px 48px rgba(0,0,0,0.18) | Overlays a pantalla completa |
```

### 9. Generar DESIGN.md

Estructura exacta del archivo:

```markdown
# [Brand Name] Design System

> [Una frase que capture la esencia visual del sistema]

---

## 1. Visual Theme & Atmosphere

[Descripción del mood, densidad, filosofía. 3-5 frases.]
[Si hay dark mode: describir ambas variantes.]

---

## 2. Color Palette & Roles

### Light Mode

| Token | Hex | Rol |
|-------|-----|-----|
[tabla completa]

### Dark Mode (si aplica)

| Token | Hex | Rol |
|-------|-----|-----|
[tabla completa]

---

## 3. Typography Rules

**Primary font:** [Familia]
**Monospace:** [Familia o "ninguna"]

| Rol | Familia | Tamaño | Peso | Line-height | Letter-spacing |
[tabla completa]

---

## 4. Component Stylings

### Buttons
[descripción de cada variante]

### Inputs & Forms
[descripción]

### Cards
[descripción]

### Navigation
[descripción]

### Badges & Tags
[descripción si aplica]

---

## 5. Layout Principles

**Grid:** [columnas] columnas, [gutter]px gutter, [margin]px margin
**Spacing scale:**

| Token | Valor | Uso |
[tabla]

**Whitespace philosophy:** [compacto/equilibrado/espacioso + descripción]

---

## 6. Depth & Elevation

| Token | CSS | Superficie |
[tabla de sombras]

**Filosofía de elevación:** [descripción breve]

---

## 7. Do's and Don'ts

### Do
- [regla positiva 1]
- [regla positiva 2]
- [regla positiva 3]
- [regla positiva 4]
- [regla positiva 5]

### Don't
- [anti-patrón 1]
- [anti-patrón 2]
- [anti-patrón 3]
- [anti-patrón 4]
- [anti-patrón 5]

---

## 8. Responsive Behavior

| Breakpoint | Ancho | Columnas | Cambios principales |
|-----------|-------|----------|---------------------|
| mobile | < 640px | 4 | [descripción] |
| tablet | 640–1024px | 8 | [descripción] |
| desktop | > 1024px | 12 | [descripción] |

**Touch targets mínimos:** 44×44px
**Estrategia de colapso:** [descripción]

---

## 9. Agent Prompt Guide

### Referencia rápida de colores

- Background principal: `[hex]`
- Texto principal: `[hex]`
- Acento: `[hex]`
- Borde: `[hex]`
- Error: `[hex]`

### Prompts listos para usar

```
Build a [card/dashboard/landing] using the [BrandName] design system.
Apply {colors.accent} for CTAs, {typography.body} for body text,
{spacing.md} padding on cards, and {shadow.md} elevation.
```

```
Create a form with text inputs and a primary button.
Use {colors.surface} background, {colors.border} for input borders,
{colors.accent} for the submit button, {colors.error} for validation messages.
```
```

### 10. Generar preview.html (si solicitado)

Catálogo visual HTML embebido que muestra:
- Swatches de todos los colores con nombre y hex
- Escala tipográfica (cada rol con texto de ejemplo)
- Botones en todos los estados
- Card de ejemplo
- Escala de sombras

Usar solo HTML/CSS inline, sin dependencias externas.

### 11. Empaquetar y entregar

Crear estructura:
```
<brand-slug>/
├── DESIGN.md
└── preview.html (si aplica)
```

Instrucciones de uso en Open Design:
```bash
# Copiar a tu proyecto open-design local
cp -r <brand-slug>/ ./design-systems/

# O directamente en la raíz del proyecto para uso inmediato
cp <brand-slug>/DESIGN.md ./DESIGN.md
```

Mostrar resumen:
```
DESIGN.md generado para: [Brand Name]
  Colores: N tokens (light) + N tokens (dark)
  Tipografía: N estilos
  Componentes documentados: N
  Secciones: 9/9
  Compatible con: Open Design · Google Stitch · Claude Code · Cursor · Codex
```

## Reglas de calidad

- Sin valores hardcoded sin nombre semántico
- Tokens de referencia con sintaxis `{colors.X}` para componentes
- Si falta info de Figma para una sección, marcar `[pendiente — completar manualmente]`
- No inventar valores: solo derivar de lo extraído; inferir solo atmósfera y Do/Don't
- Sección 7 (Do/Don't): derivar de los patrones observados, no fabricar genéricos
- Sección 9 (Agent Prompt Guide): prompts ejecutables, no decorativos
