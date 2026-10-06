// url=<PRIMEONE>?node-id=12596-140304
// source=https://github.com/primefaces/primeng/blob/master/packages/primeng/src/skeleton/skeleton.ts
// component=Skeleton
import figma from 'figma'

const instance = figma.selectedInstance
const count = Number(instance.getEnum('Lines', { '1': '1', '2': '2', '3': '3', '4': '4' }))
const lines = Array.from({ length: count }, (_, i) => `<p-skeleton width="${i === count - 1 && count > 1 ? '60%' : '100%'}" height="1rem" />`)

const example = figma.code`${lines.join('\n')}`
const imports = ["import { Skeleton } from 'primeng/skeleton';"]

export default {
  example,
  imports,
  id: 'skeleton-text',
  metadata: { nestable: true },
}
