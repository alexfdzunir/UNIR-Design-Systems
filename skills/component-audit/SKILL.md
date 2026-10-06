---
name: component-audit
description: Auditar librerías y sistemas de diseño en Figma. Usar cuando el usuario quiera encontrar componentes huérfanos, detectar inconsistencias de naming, identificar variantes faltantes, analizar el estado de una librería de diseño, revisar cobertura de componentes, encontrar estilos duplicados o no usados, o generar un reporte de salud del design system. Activar ante "auditar Figma", "revisar librería", "componentes sin usar", "naming inconsistente", "health check design system", "variantes faltantes", "duplicados en Figma".
---

# component-audit

## Objetivo

Generar reporte de salud de una librería Figma: naming, cobertura, huérfanos, duplicados.

## Flujo principal

### 1. Recopilar contexto

Pedir si no está claro:
- URL del archivo Figma a auditar
- Alcance: ¿toda la librería o una sección específica?
- ¿Comparar contra una guía de estilo o checklist externo?

### 2. Inspección del archivo

```
Figma:get_metadata(fileKey="...")
Figma:get_design_context(nodeId="..." ...)
```

Recopilar:
- Lista de componentes (maestros y variantes)
- Estilos de color, texto, efecto
- Páginas y su organización

### 3. Análisis de naming

#### Convención esperada (BEM adaptado a Figma)
`ComponentName / Variant / State`

Detectar:
- Nombres sin separador `/`
- Mezcla de idiomas (inglés + español)
- Uso de espacios vs `/` inconsistente
- Números sin contexto (`Button 2`, `Card copy`)
- Sufijos genéricos (`New`, `V2`, `Test`, `OLD`)

Clasificar cada problema:
- 🔴 Crítico: nombre vacío, duplicado exacto
- 🟡 Advertencia: convención rota, idioma mezclado
- 🟢 Info: sugerencia de mejora

### 4. Detección de huérfanos

Componente huérfano = creado pero sin instancias en el archivo.

Señales:
- Componentes en páginas ocultas
- Sin instancias detectadas en el scope analizado
- Variantes con 0 usos

### 5. Análisis de variantes

Para cada componente con variantes, verificar:
- Cobertura de estados: default, hover, focus, disabled, error
- Cobertura de tamaños: sm, md, lg (si aplica)
- Cobertura de modos: light, dark (si aplica)
- Variantes con nombres genéricos (`Property 1=Default`)

### 6. Estilos duplicados

Comparar estilos por valor, no por nombre:
- Colores con mismo hex pero diferente nombre
- Textos con misma configuración tipográfica pero nombre distinto
- Sombras idénticas duplicadas

### 7. Reporte de salida

Generar markdown estructurado:

```markdown
# Audit Report — [Nombre archivo]
**Fecha:** YYYY-MM-DD
**Componentes analizados:** N
**Score de salud:** X/100

## Resumen ejecutivo
...

## Problemas críticos (N)
| Componente | Problema | Acción |
|-----------|---------|--------|

## Advertencias (N)
...

## Estilos duplicados (N)
...

## Componentes huérfanos (N)
...

## Variantes incompletas (N)
...

## Recomendaciones priorizadas
1. ...
```

Exportar como `.md` descargable.

## Score de salud

| Métrica | Peso |
|--------|------|
| Naming consistente | 25% |
| Sin huérfanos | 20% |
| Variantes completas | 25% |
| Sin duplicados | 15% |
| Organización por páginas | 15% |

Penalización por cada problema crítico: -5 puntos.
