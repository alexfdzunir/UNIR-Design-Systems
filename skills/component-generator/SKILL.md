---
name: component-generator
description: Crear componentes Figma desde especificación textual, JSON de tokens o descripción del sistema de diseño. Usar cuando el usuario quiera generar componentes en Figma desde cero mediante descripción, crear variantes y estados de forma sistemática, construir una librería de componentes a partir de tokens o guía de estilo, poblar componentes con las variables existentes del sistema, o crear sets de componentes completos (forms, navigation, cards). Activar ante "crear componente en Figma", "generar componente", "construir librería", "añadir variantes", "poblar componente con variables", "diseñar desde tokens".
---

# component-generator

## Objetivo

Crear componentes Figma production-ready desde especificación textual o JSON. Aplicar variables existentes del sistema.

## Flujo principal

### 1. Recopilar contexto

Preguntar si falta:
- ¿Qué componente(s) generar?
- ¿Hay variables/colecciones existentes en el archivo?
- ¿Guía de estilo de referencia? (URL Figma, imagen, descripción)
- ¿Qué variantes necesita? (o dejar que se propongan)
- ¿Dónde colocar en el archivo? (página, frame)

### 2. Leer contexto del archivo

Si hay archivo Figma existente:
```
Figma:get_variable_defs(nodeId="...")
Figma:get_libraries(fileKey="...")
```

Identificar:
- Colecciones de variables disponibles
- Estilos de texto existentes
- Librería de iconos si la hay

### 3. Proponer anatomía del componente

Antes de crear, presentar la estructura propuesta:

Ejemplo para `Button`:
```
Button
├── Container (auto-layout horizontal, padding variable)
│   ├── [Icon Left] (opcional)
│   ├── Label (text style: body/md)
│   └── [Icon Right] (opcional)
└── Variantes:
    ├── Size: sm, md, lg
    ├── Variant: primary, secondary, ghost, destructive
    ├── State: default, hover, focus, disabled, loading
    └── HasIconLeft: true, false
    └── HasIconRight: true, false
```

Confirmar con el usuario antes de crear.

### 4. Tokens a aplicar

Mapear propiedades visuales a variables del sistema:

| Propiedad | Variable |
|-----------|---------|
| Background | `color/brand/primary` |
| Text | `color/foreground/on-brand` |
| Border radius | `radius/md` |
| Padding H | `spacing/4` |
| Padding V | `spacing/2` |
| Gap icon-label | `spacing/2` |
| Font size | `font/size/base` |

Si no existen variables, usar valores de la escala estándar y notificar.

### 5. Crear el componente

```
Figma:use_figma(prompt="
  Crear componente Button con auto-layout, variantes Size (sm/md/lg),
  Variant (primary/secondary/ghost/destructive), State (default/hover/focus/disabled).
  Aplicar variables: background=color/brand/primary, text=color/foreground/on-brand,
  padding=spacing/4 horizontal spacing/2 vertical, border-radius=radius/md.
  Texto estilo body/md. Organizar en una página llamada 'Components'.
")
```

### 6. Componentes por categoría

#### Inputs
- Button (primario, secundario, ghost, destructive)
- Input text (default, focus, error, disabled)
- Checkbox
- Radio button
- Toggle/Switch
- Select / Dropdown
- Textarea

#### Feedback
- Alert / Banner (info, success, warning, error)
- Toast / Snackbar
- Badge
- Tooltip

#### Navegación
- Navbar / Header
- Sidebar
- Tabs
- Breadcrumb
- Pagination

#### Contenido
- Card
- Table
- Modal / Dialog
- Accordion
- Avatar

Si el usuario pide "librería completa", proponer un plan por fases y priorizar según feedback.

### 7. Reglas de construcción

- Todo con auto-layout (nunca posicionamiento manual)
- Padding y gap siempre con variables de spacing
- Colores siempre referenciando variables (nunca hardcoded)
- Texto siempre con estilos de texto o variables tipográficas
- Constraints: horizontal=scale, vertical=scale para responsive
- Componentes maestros en la página `_Components` o `Library`

### 8. Organización en el archivo

Estructura recomendada de páginas:
```
Cover
_Tokens (variables reference)
_Components (maestros — no tocar)
Components / Inputs
Components / Feedback
Components / Navigation
Components / Content
Playground (para pruebas)
```

### 9. Validación post-creación

- [ ] Todas las capas nombradas (sin "Frame 23", "Rectangle 4")
- [ ] Auto-layout en todos los contenedores
- [ ] Sin valores hardcoded de color
- [ ] Variantes con nombres de propiedades en inglés y consistentes
- [ ] Componente publicable (sin capas ocultas innecesarias)

### 10. Entrega

Confirmar con:
```
Componente creado: Button
  Variantes: 60 (3 sizes × 4 variants × 5 states)
  Variables aplicadas: 12
  Ubicación: página "Components / Inputs"
  Listo para publicar en librería: ✓
```
