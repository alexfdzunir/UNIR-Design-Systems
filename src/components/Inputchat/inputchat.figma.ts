// url=<PRIMEONE>?node-id=13549-29512
// source=https://github.com/alexfdzunir/UNIR-Design-Systems/blob/main/src/components/Inputchat/input-chat.ts
// component=PrimeOneInputChat
import figma from 'figma'
import { is } from '../../figma/helpers'
import { P } from '../../figma/props'

const instance = figma.selectedInstance
const state = instance.getEnum('State', { Default: '', Send: '', Stop: ' [busy]="true"', Loading: ' [loading]="true"' })
const flags = [
  instance.getBoolean('Archives') ? ' [attachments]="files"' : '',
  instance.getBoolean('Plus Button') ? '' : ' [showAttach]="false"',
  is(instance, 'Audio', 'Yes') ? ' [recording]="true" recordingTime="0:01"' : '',
  is(instance, 'Transcribing', 'Yes') ? ' [transcribing]="true"' : '',
  is(instance, P.nestedBlocked, 'Yes') ? ' [disabled]="true"' : '',
  is(instance, 'Size', 'Mobile') ? ' [mobile]="true"' : '',
].join('')

const example = figma.code`<prime-one-inputchat [(ngModel)]="message"${state ?? ''}${flags} (send)="send($event)" (attach)="openFilePicker()" />`
const imports = ["import { PrimeOneInputChat } from 'prime-one-ds';", "import { FormsModule } from '@angular/forms';"]

export default {
  example,
  imports,
  id: 'inputchat',
  metadata: { nestable: true },
}
