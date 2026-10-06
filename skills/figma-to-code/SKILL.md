---
name: figma-to-code
description: Generar código limpio y production-ready desde componentes Figma. Usar cuando el usuario quiera convertir diseños Figma a React, Vue, HTML/CSS, o cuando quiera configurar Code Connect, generar props desde variantes Figma, obtener tokens de diseño como variables CSS/JS, o traducir un sistema de diseño Figma a código reutilizable. Activar ante "figma to code", "exportar componente a React", "generar CSS desde Figma", "Code Connect", "design to code", "implementar diseño", "traducir Figma a componente".
---

# figma-to-code

## Objetivo

Traducir componentes Figma a código limpio. Framework: React (default), Vue, HTML/CSS.

## Flujo principal

### 1. Recopilar contexto

Preguntar si falta:
- URL o nodeId del componente/frame
- Framework destino: React / Vue / HTML+CSS / CSS puro
- Sistema de tokens: Tailwind / CSS variables / styled-components / SCSS
- ¿Usar Code Connect o solo código?
- ¿Tipar con TypeScript?

### 2. Leer diseño

```
Figma:get_design_context(nodeId="...", depth=3)
Figma:get_screenshot(nodeId="...")
Figma:get_context_for_code_connect(nodeId="...")
```

Extraer:
- Jerarquía de capas
- Propiedades visuales: colores, tipografía, espaciado, border-radius, sombras
- Variantes y sus propiedades
- Estados interactivos si los hay (hover, focus, disabled)
- Assets embebidos (iconos, imágenes)

### 3. Mapear variantes a props

Cada `Property` de Figma → prop del componente.

Ejemplo:
```
Figma: Size=[sm, md, lg], State=[default, hover, disabled], HasIcon=[true, false]
```
→
```typescript
interface ButtonProps {
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  hasIcon?: boolean
}
```

### 4. Generar código

#### React + Tailwind (default)
```tsx
interface ButtonProps {
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({ size = 'md', disabled, children, onClick }: ButtonProps) {
  return (
    <button
      className={`${sizeClasses[size]} bg-blue-500 text-white rounded-md
        hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

#### CSS variables
Usar nombres de token si existen (`--color-primary-500`), no valores hardcoded.

#### Vue 3
Composition API + `<script setup>`.

### 5. Code Connect (opcional)

Si el usuario quiere Code Connect:

```
Figma:get_code_connect_suggestions(nodeId="...")
```

Generar archivo `.figma.tsx`:
```tsx
import { figma } from '@figma/code-connect'
import { Button } from './Button'

figma.connect(Button, 'https://figma.com/...', {
  props: {
    size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' }),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ size, disabled }) => (
    <Button size={size} disabled={disabled}>Label</Button>
  ),
})
```

Luego registrar:
```
Figma:add_code_connect_map(...)
```

### 6. Validar output

Antes de entregar:
- [ ] Props cubren todas las variantes Figma
- [ ] Sin valores hardcoded donde hay token disponible
- [ ] Estados accesibles (aria-disabled, focus-visible)
- [ ] Código ejecutable sin modificaciones

### 7. Entregar

Archivos generados:
- `ComponentName.tsx` (o `.vue` / `.html`)
- `ComponentName.figma.tsx` (si Code Connect)
- `ComponentName.module.css` (si CSS Modules)

Incluir snippet de uso:
```tsx
// Uso básico
<Button size="md">Guardar</Button>

// Con estado
<Button size="sm" disabled>No disponible</Button>
```

## Reglas de calidad

- Sin inline styles salvo casos imposibles en CSS
- Sin magic numbers: extraer a constante o token
- Accesibilidad mínima: roles, aria-labels donde aplique
- No generar tests salvo que se pida
- No agregar librerías no mencionadas por el usuario
