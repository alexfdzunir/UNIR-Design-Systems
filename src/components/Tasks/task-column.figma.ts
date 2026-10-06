// url=<PRIMEONE>?node-id=19102-38482
// source=https://github.com/alexfdzunir/UNIR-Design-Systems/blob/main/src/components/Tasks/task-column.ts
// component=PrimeOneTaskColumn
import figma from 'figma'
import { is } from '../../figma/helpers'

const instance = figma.selectedInstance
const type = instance.getEnum('Type', { Pending: 'pending', Completed: 'completed', 'Overdue/Discarded': 'overdue' })

const example = figma.code`<prime-one-task-column type="${type}" [tasks]="${is(instance, 'Empty') ? '[]' : 'tasks'}"${is(instance, 'Device', 'Mobile') ? ' [mobile]="true"' : ''} (add)="newTask()" (taskClick)="openTask($event)" />`
const imports = ["import { PrimeOneTaskColumn } from 'prime-one-ds';"]

export default {
  example,
  imports,
  id: 'task-column',
  metadata: { nestable: true },
}
