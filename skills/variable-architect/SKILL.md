---
name: variable-architect
description: Diseñar, estructurar y poblar variables en Figma para sistemas de diseño. Usar cuando el usuario quiera crear una arquitectura de variables en Figma, configurar modos light/dark o multi-brand, poblar variables desde tokens JSON, organizar colecciones de variables, crear aliases entre variables, o migrar estilos Figma a variables. Activar ante "variables Figma", "crear modos", "light dark Figma", "multi-brand", "colecciones de variables", "migrar estilos a variables", "arquitectura de tokens Figma", "variable aliases".
---

# variable-architect

## Objetivo

Diseñar y poblar la arquitectura de variables en Figma. Niveles: primitivos → semánticos → específicos.

## Conceptos clave

### Jerarquía de variables

```
Primitivos (base values)
  └─ color/blue/500 = #3B82F6

Semánticos (alias con significado)
  └─ color/brand/primary = {color/blue/500}

Específicos (uso en componente)
  └─ button/background/default = {color/brand/primary}
```

Regla: los componentes NUNCA referencian primitivos directamente.

### Colecciones en Figma

| Colección | Contenido | Modos |
|-----------|-----------|-------|
| Primitivos | Todos los valores base | Ninguno (un modo) |
| Semánticos | Aliases con significado | light, dark |
| Componentes | Tokens por componente | (heredan de semánticos) |
| Spacing | Escala de espaciado | Ninguno |
| Typography | Escala tipográfica | Ninguno |

## Flujo principal

### 1. Recopilar contexto

Preguntar si falta:
- ¿Desde cero o migrar estilos existentes?
- ¿Qué modos necesita? (light/dark, multi-brand, tamaño pantalla)
- ¿Hay tokens JSON de referencia para importar?
- ¿Cuántos colores de marca? ¿Tipografía definida?

### 2. Definir escala de primitivos

#### Escala de color (generar automáticamente si solo dan el color base)

Para cada color de marca, generar escala 50-950:
- 50: lightness ~97%
- 100: lightness ~94%
- 200: lightness ~86%
- 300: lightness ~74%
- 400: lightness ~62%
- 500: base (el color dado)
- 600: lightness ~47%
- 700: lightness ~38%
- 800: lightness ~28%
- 900: lightness ~18%
- 950: lightness ~10%

Neutrales: siempre incluir escala de grises (gray/50 → gray/950).

#### Escala de espaciado

Base 4px o 8px según preferencia del usuario:
```
spacing/1  = 4px
spacing/2  = 8px
spacing/3  = 12px
spacing/4  = 16px
spacing/5  = 20px
spacing/6  = 24px
spacing/8  = 32px
spacing/10 = 40px
spacing/12 = 48px
spacing/16 = 64px
```

#### Escala tipográfica

```
font/size/xs   = 12px
font/size/sm   = 14px
font/size/base = 16px
font/size/lg   = 18px
font/size/xl   = 20px
font/size/2xl  = 24px
font/size/3xl  = 30px
font/size/4xl  = 36px
```

### 3. Definir semánticos por modo

#### Light
```
color/background/default    → {gray/50}
color/background/subtle     → {gray/100}
color/foreground/default    → {gray/900}
color/foreground/muted      → {gray/500}
color/brand/primary         → {blue/500}
color/brand/primary-hover   → {blue/600}
color/status/error          → {red/500}
color/status/success        → {green/500}
color/status/warning        → {yellow/500}
color/border/default        → {gray/200}
```

#### Dark
```
color/background/default    → {gray/950}
color/background/subtle     → {gray/900}
color/foreground/default    → {gray/50}
color/foreground/muted      → {gray/400}
color/brand/primary         → {blue/400}
color/brand/primary-hover   → {blue/300}
color/status/error          → {red/400}
color/status/success        → {green/400}
color/status/warning        → {yellow/400}
color/border/default        → {gray/800}
```

### 4. Aplicar en Figma

```
Figma:use_figma(prompt="Crear colección 'Primitivos' con variables de color...")
```

Crear en orden:
1. Colección Primitivos (sin modos, solo valores)
2. Colección Semánticos (modos: light, dark)
3. Colección Spacing (sin modos)
4. Colección Typography (sin modos)
5. Colección Componentes (opcional, avanzado)

### 5. Multi-brand

Si hay múltiples marcas:
- Colección Semánticos con modos: `brand-a/light`, `brand-a/dark`, `brand-b/light`, `brand-b/dark`
- Primitivos separados por brand si los colores base difieren
- Compartir spacing y typography entre brands

### 6. Migración de estilos existentes

Si el usuario tiene estilos de color/texto en Figma:
1. Listar estilos actuales con `Figma:get_design_context`
2. Mapear cada estilo a variable equivalente
3. Crear variables
4. Notificar: los estilos NO se eliminan automáticamente — acción manual

### 7. Validación

Antes de confirmar:
- [ ] Ningún semántico apunta a valor hardcoded
- [ ] Todos los modos tienen valor para cada variable
- [ ] Naming consistente en toda la colección
- [ ] Sin variables duplicadas por valor

### 8. Entrega

Mostrar resumen:
```
Colecciones creadas: 4
Variables totales: 187
  Primitivos: 88 (colores: 66, otros: 22)
  Semánticos: 42 (modos: light, dark)
  Spacing: 12
  Typography: 45
Modos: light, dark
```

Generar también el JSON exportable como respaldo.
