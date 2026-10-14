// url=<PRIMEONE>?node-id=243-9556
// source=https://github.com/primefaces/primeng/blob/master/packages/primeng/src/dialog/dialog.ts
// component=Dialog
import figma from 'figma'
import { is, isInstance, prop, slotCode, text } from '../../figma/helpers'
import { P } from '../../figma/props'

const instance = figma.selectedInstance
const header = instance.getString(P.nestedHeader)
const showHeader = instance.getBoolean('Show Header')
const content = instance.getBoolean('Show Content') ? `\n  <p>${instance.getString(P.nestedContent)}</p>` : ''
const slot = instance.getBoolean('Slot') ? slotCode(instance, P.nestedSlot) : undefined
const width = instance.getEnum('Size', { M: '50rem', S: '25rem' })
// Footer buttons only: the header close button is also a `button` layer (Icon Only)
const buttons = instance.findLayers((node) => node.name === 'button').filter(isInstance).filter((button) => !is(button, 'Icon Only'))
const labels = buttons.map((button) => button.getString('Text'))
const showButtons = instance.getBoolean('Buttons')
const second = showButtons && prop(instance, P.nested2ndButton) === true ? `\n    <p-button label="${labels[0] ?? 'Cancelar'}" severity="secondary" (click)="visible = false" />` : ''
const first = showButtons && prop(instance, P.nested1stButton) === true ? `\n    <p-button label="${labels[1] ?? labels[0] ?? 'Guardar'}" (click)="visible = false" />` : ''
// The footer text has no TEXT property: its layer keeps the name of the main component
const description = prop(instance, P.nestedDescriptionText) === true ? `\n    <span class="po-dialog-footer-text">${text(instance, '2 de 3') ?? '2 de 3'}</span>` : ''
const footer = instance.getBoolean('Footer') && (description || first || second) ? `\n  <ng-template #footer>${description}${second}${first}\n  </ng-template>` : ''
const attrs = `${showHeader ? ` header="${header}"` : ' [showHeader]="false"'} [(visible)]="visible" [modal]="true" [style]="{ width: '${width}' }"${instance.getBoolean('Closable') ? '' : ' [closable]="false"'}`

const example = figma.code`<p-dialog${attrs}>${content}${slot ? figma.code`\n  ${slot}` : ''}${footer}
</p-dialog>`
const imports = ["import { Dialog } from 'primeng/dialog';", ...(footer ? ["import { Button } from 'primeng/button';"] : [])]

export default {
  example,
  imports,
  id: 'dialog',
  metadata: { nestable: true },
}
