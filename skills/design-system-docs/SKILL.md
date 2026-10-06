---
name: design-system-docs
description: Generar y publicar documentación automática de sistemas de diseño desde Figma. Usar cuando el usuario quiera crear documentación de componentes, exportar especificaciones de diseño a Notion/Storybook/MDX, generar páginas de uso para cada componente, mantener sincronizada la doc con el diseño, o crear guías de estilo a partir de una librería Figma. Activar ante "documentar componentes", "doc del design system", "exportar a Notion", "generar MDX", "Storybook desde Figma", "guía de uso", "especificaciones de diseño", "doc automática".
---

# design-system-docs

## Objetivo

Generar documentación de componentes desde Figma. Destinos: Notion, MDX/Storybook, Markdown.

## Flujo principal

### 1. Recopilar contexto

Preguntar si falta:
- URL del archivo Figma
- Destino: Notion / MDX (Storybook/Docusaurus) / Markdown
- Alcance: ¿un componente, una sección, toda la librería?
- ¿Incluir screenshots de variantes?
- ¿Ya existe estructura de doc? (URL de Notion, path de proyecto)

### 2. Extraer información del componente

```
Figma:get_design_context(nodeId="...", depth=4)
Figma:get_context_for_code_connect(nodeId="...")
Figma:get_screenshot(nodeId="...")
```

Recopilar por componente:
- Nombre y descripción (del campo Description en Figma si existe)
- Variantes y sus propiedades
- Estados disponibles
- Guías de uso si hay anotaciones

### 3. Generar estructura de documentación

Por cada componente:

```
ComponentName/
├── Descripción
├── Cuándo usarlo / cuándo no
├── Variantes (tabla)
├── Props/API
├── Accesibilidad
├── Ejemplos de uso
└── Tokens relacionados
```

### 4. Formatos de salida

#### Notion

Usar `Notion:notion-create-pages` o `Notion:notion-update-page`.

Estructura recomendada:
```
Design System (base de datos)
└── Components
    └── Button
        ├── Overview
        ├── Variants (gallery)
        ├── Props table
        └── Do / Don't
```

Crear database si no existe:
```
Notion:notion-create-database(...)
```

Propiedades sugeridas para la DB:
- Name (title)
- Status (select): Draft / Review / Published
- Category (select): Inputs / Navigation / Feedback / Layout
- Figma URL (url)
- Last updated (date)

#### MDX (Storybook / Docusaurus)

```mdx
---
title: Button
description: Elemento de acción primario del sistema de diseño
---

import { Button } from '../components/Button'
import { Canvas, Controls } from '@storybook/blocks'

# Button

[descripción]

## Variantes

<Canvas>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</Canvas>

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| size | 'sm' \| 'md' \| 'lg' | 'md' | Tamaño del botón |
| disabled | boolean | false | Estado deshabilitado |

## Accesibilidad

- Usar `aria-label` cuando no hay texto visible
- Estado `disabled` añade `aria-disabled` automáticamente

## Tokens

| Token | Valor |
|-------|-------|
| `--button-bg` | `var(--color-primary-500)` |
| `--button-radius` | `var(--radius-md)` |
```

#### Markdown puro

Generar un `.md` por componente + un `index.md` con tabla de todos.

### 5. Publicar en Notion

Si destino = Notion:

1. Buscar workspace/database existente:
```
Notion:notion-search(query="Design System")
```

2. Crear página por componente:
```
Notion:notion-create-pages(...)
```

3. Adjuntar screenshot como imagen inline.

4. Confirmar al usuario con URL de cada página creada.

### 6. Generar para múltiples componentes

Si el usuario quiere documentar toda la librería:
- Iterar por componentes detectados
- Procesar en grupos de 5 para no saturar contexto
- Mostrar progreso: `[7/23] Procesando Card...`
- Generar resumen al final

### 7. Mantenimiento / actualización

Si el usuario quiere actualizar doc existente:
- Comparar metadata Figma vs doc actual (fecha de modificación)
- Actualizar solo secciones que cambiaron
- Añadir nota de "Actualizado: YYYY-MM-DD"

## Reglas

- Sin inventar comportamientos no visibles en el diseño
- Si falta info (e.g. no hay descripción en Figma), indicarlo con `[pendiente]`
- Screenshots solo si el usuario los solicitó (consumen tiempo)
- Accesibilidad: incluir siempre aunque sea básica
