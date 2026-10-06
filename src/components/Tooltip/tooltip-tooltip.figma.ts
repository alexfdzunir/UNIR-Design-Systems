// url=<PRIMEONE>?node-id=623-36926
// source=https://github.com/primefaces/primeng/blob/master/packages/primeng/src/tooltip/tooltip.ts
// component=Tooltip
import figma from 'figma'

const instance = figma.selectedInstance
const position = instance.getEnum('Direction', { Right: 'right', Left: 'left', Down: 'bottom', Up: 'top' })

const example = figma.code`<span pTooltip="${instance.getString('Text')}" tooltipPosition="${position}">Elemento</span>`
const imports = ["import { Tooltip } from 'primeng/tooltip';"]

export default {
  example,
  imports,
  id: 'tooltip-tooltip',
  metadata: { nestable: true },
}
