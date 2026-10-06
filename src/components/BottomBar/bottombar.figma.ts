// url=<PRIMEONE>?node-id=12532-122291
// source=https://github.com/alexfdzunir/UNIR-Design-Systems/blob/main/src/components/BottomBar/bottom-bar.ts
// component=PrimeOneBottomBar
import figma from 'figma'
import { is } from '../../figma/helpers'

const instance = figma.selectedInstance

const example = is(instance, 'Type', 'Editor')
  ? figma.code`<prime-one-bottom-bar type="editor" [items]="tools" />`
  : figma.code`<prime-one-bottom-bar [page]="page" [totalPages]="totalPages" [words]="words" [statuses]="statuses" [items]="actions" [(zoom)]="zoom" />`
const imports = ["import { PrimeOneBottomBar } from 'prime-one-ds';", "import { MenuItem } from 'primeng/api';"]

export default {
  example,
  imports,
  id: 'bottombar',
  metadata: { nestable: true },
}
