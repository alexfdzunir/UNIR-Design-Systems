// url=<PRIMEONE>?node-id=17343-53189
// source=https://github.com/alexfdzunir/UNIR-Design-Systems/blob/main/src/components/Agenda/agenda.ts
// component=PrimeOneAgenda
import figma from 'figma'

const instance = figma.selectedInstance
const view = instance.getEnum('View', { Day: 'day', 'Three days': 'three-days', Week: 'week', 'Academic week': 'academic-week', Month: 'month', Agenda: 'agenda' })

const example = figma.code`<prime-one-agenda [events]="events"${view === 'week' ? ' [(view)]="view"' : ` view="${view}"`} [(date)]="date" (eventClick)="openEvent($event)" />`
const imports = ["import { PrimeOneAgenda } from 'prime-one-ds';"]

export default {
  example,
  imports,
  id: 'agenda',
  metadata: { nestable: true },
}
