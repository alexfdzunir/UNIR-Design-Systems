# Comentarios para desarrollo

Usa esta guía para las anotaciones visibles de Figma y para `Comentarios Producto` de Notion. El comentario debe permitir a una persona de desarrollo corregir el fallo sin descifrar el resultado de la auditoría.

## Forma

Empieza por un verbo y por el cambio concreto. Escribe una o dos frases cortas, en lenguaje cotidiano y en presente.

```text
<Cambio que hay que hacer>. Ahora <qué ocurre y por qué debe cambiar>.
Ruta: <ruta>, <viewport>. Evidencia: <enlace o QA-XX>.
```

En Figma, la tarjeta de anotación lleva la etiqueta `Cambio` y muestra solo la primera frase. En Notion conserva las dos frases: la corrección primero y el contexto reproducible después.

## Buenas formulaciones

- `Añadir un foco visible por fuera del CTA cuando se navega con teclado.`
- `Dar más aire al botón secundario para que se perciba como un botón outline.`
- `Aplicar un color de hover más oscuro al CTA: #8FD831.`
- `Hacer que los iconos estén alineados y que el hover tenga más contraste.`
- `Añadir el favicon de UNIR/Meritia en todas las páginas. Ahora el navegador muestra el icono de WordPress.`

## Precisión

- Nombra el control, bloque o texto que debe cambiar; evita referencias como `esto`, `aquí` o `revisar diseño`.
- Indica el valor objetivo si Figma lo define (copy, color, medida o estado).
- Separa incidencias que requieren cambios distintos.
- Reserva detalles técnicos (selector, consola, nodo o prueba) para la frase de contexto y la evidencia, no para reemplazar la instrucción.
