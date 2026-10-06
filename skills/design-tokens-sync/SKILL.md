---
name: design-tokens-sync
description: Exportar, importar y sincronizar tokens de diseño entre Figma y código. Usar cuando el usuario quiera extraer variables de Figma a JSON/Style Dictionary/W3C DTCG, importar tokens externos a Figma, comparar tokens entre versiones, generar archivos de tokens para sistemas de diseño, convertir entre formatos de tokens, o mantener sincronizados los tokens de diseño con el repositorio. Activar ante menciones de "tokens", "design tokens", "variables Figma", "Style Dictionary", "W3C tokens", "token pipeline", "sincronizar estilos".
---

# design-tokens-sync

## Objetivo

Bidireccional: Figma ↔ código. Formatos: JSON plano, Style Dictionary, W3C DTCG.

## Flujo principal

### 1. Leer contexto inicial

Preguntar si falta:
- Dirección: Figma→código o código→Figma
- Formato destino: JSON plano / Style Dictionary / W3C DTCG
- Qué tipos de tokens: colores, tipografía, espaciado, radios, sombras, motion
- Estructura de modos: ¿light/dark? ¿multi-brand?

### 2. Extracción desde Figma (Figma → código)

Usar `Figma:get_variable_defs` con el `nodeId` del archivo o frame raíz.

```
Figma:get_variable_defs(nodeId="...")
```

Estructura de salida esperada:
- `variableCollections`: agrupaciones (Color, Spacing, Typography...)
- `variables`: nombre, tipo, valores por modo

**Mapeo de tipos Figma → token:**

| Tipo Figma | Token type (W3C) |
|-----------|-----------------|
| COLOR | color |
| FLOAT | dimension / number |
| STRING | fontFamily / fontWeight / otros |
| BOOLEAN | — (ignorar salvo necesidad) |

### 3. Transformación de formato

#### JSON plano
```json
{
  "color": {
    "primary": {
      "500": { "value": "#3B82F6" }
    }
  }
}
```

#### W3C DTCG
```json
{
  "color": {
    "primary": {
      "500": {
        "$value": "#3B82F6",
        "$type": "color"
      }
    }
  }
}
```

#### Style Dictionary
```json
{
  "color": {
    "primary": {
      "500": {
        "value": "#3B82F6",
        "attributes": { "category": "color" }
      }
    }
  }
}
```

### 4. Importación a Figma (código → Figma)

Usar `Figma:use_figma` para crear o actualizar variables programáticamente.

Pasos:
1. Leer el JSON de tokens del usuario
2. Validar estructura y tipos
3. Mapear a variables Figma con colecciones y modos
4. Aplicar via plugin o API

### 5. Comparación de versiones

Si el usuario tiene tokens anteriores y nuevos:
- Detectar tokens añadidos, eliminados, modificados
- Generar diff legible con impacto estimado

## Reglas de naming

Convención recomendada: `{categoría}/{grupo}/{variante}/{escala}`

Ejemplos:
- `color/brand/primary/500`
- `spacing/component/padding/md`
- `typography/body/size/base`

Detectar y avisar sobre:
- Nombres con espacios
- CamelCase mezclado con kebab-case
- Tokens sin categoría raíz

## Validaciones

Antes de exportar/importar:
- [ ] Valores de color en hex o rgba válido
- [ ] Dimensiones con unidades (px, rem) o número
- [ ] Referencias circulares entre tokens alias
- [ ] Modos declarados pero sin valor

## Salida

Generar como archivo `.json` descargable.
Si hay múltiples modos, un archivo por modo O estructura unificada con clave `$modes`.

Incluir resumen:
```
Tokens exportados: 142
  Colores: 68
  Espaciado: 24
  Tipografía: 31
  Otros: 19
Modos: light, dark
Formato: W3C DTCG
```
