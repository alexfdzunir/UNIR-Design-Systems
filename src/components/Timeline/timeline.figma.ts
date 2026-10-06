// url=<PRIMEONE>?node-id=442-29308
// source=https://github.com/primefaces/primeng/blob/master/packages/primeng/src/timeline/timeline.ts
// component=Timeline
import figma from 'figma'
import { attr, is } from '../../figma/helpers'

const instance = figma.selectedInstance
const horizontal = is(instance, 'Direction', 'Horizontal')
const align = instance.getEnum('Align', { Left: undefined, Right: 'right', Alternate: 'alternate', Opposite: 'right', Bottom: 'bottom', Top: undefined })

const example = figma.code`<p-timeline [value]="events"${attr('layout', horizontal ? 'horizontal' : undefined)}${attr('align', align)}>
  <ng-template #content let-event>
    {{ event.status }}
  </ng-template>
</p-timeline>`
const imports = ["import { Timeline } from 'primeng/timeline';"]

export default {
  example,
  imports,
  id: 'timeline',
  metadata: { nestable: true },
}
