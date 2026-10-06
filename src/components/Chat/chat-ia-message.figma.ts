// url=<PRIMEONE>?node-id=16684-117406
// source=https://github.com/alexfdzunir/UNIR-Design-Systems/blob/main/src/components/Chat/chat-ia-message.ts
// component=PrimeOneChatIaMessage
import figma from 'figma'
import { is } from '../../figma/helpers'

const instance = figma.selectedInstance
const right = is(instance, 'Orientation', 'right')

const example = figma.code`<prime-one-chat-ia-message${right ? ' orientation="right"' : ''}${!right && instance.getBoolean('Actionbar') ? ' [showActions]="true" (actionClick)="onAction($event)"' : ''}${is(instance, 'Display', 'mobile') ? ' [mobile]="true"' : ''}>{{ message.text }}</prime-one-chat-ia-message>`
const imports = ["import { PrimeOneChatIaMessage } from 'prime-one-ds';"]

export default {
  example,
  imports,
  id: 'chat-ia-message',
  metadata: { nestable: true },
}
