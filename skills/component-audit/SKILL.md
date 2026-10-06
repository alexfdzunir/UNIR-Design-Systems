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

### 8. Reporte HTML

Además del `.md`, generar un HTML visual con [`report-template.html`](report-template.html). Tiene el estilo del explorador de PrimeOne: hero azul UNIR, Proeduca Sans, iconos Phosphor, modo claro y oscuro, e índice lateral. La plantilla pinta todo desde un bloque JSON (`<script type="application/json" id="audit-data">`), así que solo cambian los datos.

1. Escribir los datos en un JSON con este esquema:

```json
{
  "file": { "name": "...", "url": "https://www.figma.com/design/KEY/...", "key": "KEY" },
  "date": "YYYY-MM-DD",
  "scope": "Librería completa (N páginas)",
  "figures": [{ "label": "Componentes", "value": "331" }],
  "score": {
    "total": 18, "base": 58, "penalty": 40, "criticals": 8,
    "metrics": [{ "name": "Naming consistente", "weight": 25, "points": 15, "reason": "..." }]
  },
  "summary": [{ "severity": "critical|warning|info|ok", "text": "..." }],
  "sections": [{
    "id": "criticos", "title": "Problemas críticos", "icon": "warning-octagon",
    "severity": "critical|warning|info|ok", "count": 8, "intro": "...",
    "blocks": [
      { "type": "table", "title": "...", "columns": ["Componente", "Problema", "Acción"], "num": [1], "rows": [["`a`", "...", "..."]] },
      { "type": "list", "title": "...", "items": ["..."] },
      { "type": "note", "text": "..." },
      { "type": "text", "title": "...", "text": "..." }
    ]
  }],
  "recommendations": [{ "title": "...", "detail": "..." }],
  "methodology": { "steps": ["..."], "limits": ["..."] }
}
```

- En los textos, `` `código` `` se pinta como `<code>` y `**texto**` como `<strong>`. El resto se escapa.
- `icon` es un nombre de [Phosphor](https://phosphoricons.com) sin prefijo (`ghost`, `copy`, `text-aa`, `squares-four`, `files`).
- `num` marca las columnas numéricas de una tabla (alineadas a la derecha).
- Secciones habituales: críticos, naming, estilos duplicados, huérfanos, variantes incompletas, organización por páginas.
- El color de cada barra del score sale solo: verde si se alcanza el 80% del peso, ámbar desde el 50% y rojo por debajo.

2. Inyectar el JSON en una copia de la plantilla:

```bash
python3 - skills/component-audit/report-template.html datos.json reports/figma-audit/YYYY-MM-DD-nombre.html <<'EOF'
import json, re, sys
tpl, data, out = sys.argv[1:4]
html = open(tpl, encoding='utf-8').read()
payload = json.dumps(json.load(open(data, encoding='utf-8')), ensure_ascii=False, indent=2).replace('</', '<\\/')
html, n = re.subn(r'(<script type="application/json" id="audit-data">).*?(</script>)',
                  lambda m: m.group(1) + '\n' + payload + '\n  ' + m.group(2), html, flags=re.S)
assert n == 1
open(out, 'w', encoding='utf-8').write(html)
EOF
```

3. Guardar el `.md` y el `.html` juntos. En el repositorio PrimeOne-DS van en `reports/figma-audit/`, porque la plantilla carga Proeduca Sans con la ruta relativa `../../src/fonts/proeduca-sans.css`. Fuera del repo se usa la fuente del sistema, o se ajusta esa ruta.
4. Abrir el HTML en el navegador y comprobar el modo claro, el oscuro y el ancho de móvil antes de entregarlo.

## Score de salud

| Métrica | Peso |
|--------|------|
| Naming consistente | 25% |
| Sin huérfanos | 20% |
| Variantes completas | 25% |
| Sin duplicados | 15% |
| Organización por páginas | 15% |

Penalización por cada problema crítico: -5 puntos.
