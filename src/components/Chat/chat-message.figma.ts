// url=<PRIMEONE>?node-id=16335-12194
// source=https://github.com/alexfdzunir/UNIR-Design-Systems/blob/main/src/components/Chat/chat-message.ts
// component=PrimeOneChatMessage
import figma from 'figma'
import { attr, is, text } from '../../figma/helpers'

const instance = figma.selectedInstance
const right = is(instance, 'Orientation', 'right')
const group = is(instance, 'Group', 'Yes')
const author = group && !right && instance.getBoolean('Name') ? text(instance, 'Username') ?? 'Nombre' : undefined
const time = instance.getBoolean('Time') ? text(instance, 'Timestamp') ?? '10:35' : undefined
const attrs = [
  right ? ' orientation="right"' : '',
  attr('author', author),
  attr('time', time),
  !right && instance.getBoolean('Avatar') ? ' [avatar]="message.avatar"' : '',
  !right && !instance.getBoolean('Avatar') ? ' [showAvatar]="false"' : '',
  !group && !right ? ' [showName]="false"' : '',
  is(instance, 'Display', 'mobile') ? ' [mobile]="true"' : '',
].join('')

const example = figma.code`<prime-one-chat-message${attrs}>{{ message.text }}</prime-one-chat-message>`
const imports = ["import { PrimeOneChatMessage } from 'prime-one-ds';"]

export default {
  example,
  imports,
  id: 'chat-message',
  metadata: { nestable: true },
}
