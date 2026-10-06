// url=<PRIMEONE>?node-id=13683-34054
// source=https://github.com/primefaces/primeng/blob/master/packages/primeng/src/table/table.ts
// component=Table
import figma from 'figma'
import { flag, is, isInstance, part, prop } from '../../figma/helpers'
import { sizeOf, slug } from '../../figma/templates/field'

const instance = figma.selectedInstance
const count = Number(instance.getEnum('Columns', { '7': '7', '6': '6', '5': '5', '4': '4', '3': '3' }))
const cells = instance.findLayers((node) => node.name === 'datatable-header-cell').filter(isInstance).slice(0, count)
const used = new Set<string>()
const columns = cells.map((cell, i) => {
  const header = cell.getString('Header')
  let field = slug(header, `col${i + 1}`)
  if (used.has(field)) field = `col${i + 1}`
  used.add(field)
  return { header, field, sortable: is(cell, 'Sortable') }
})
const first = cells[0]
const size = sizeOf(prop(first, 'Size'))
const checkbox = instance.getBoolean('Checkbox')
const headerBar = instance.getBoolean('Show Header') ? part(instance, 'datatable-header') : undefined
const footerBar = instance.getBoolean('Show Footer') ? part(instance, 'datatable-footer') : undefined
const toolbar = instance.getBoolean('Toolbar') ? part(instance, 'datatable-toolbar') : undefined
const actions = toolbar
  ? // [Figma boolean, button label, icon]
    [['Clear filters', 'Limpiar filtros', 'ph ph-funnel-x'], ['Restore', 'Restaurar', 'ph ph-arrow-counter-clockwise'], ['Add row', 'Añadir fila', 'ph ph-plus'], ['Export', 'Exportar', 'ph ph-export']]
      .filter(([name]) => prop(toolbar, name) === true)
      .map(([, label, icon]) => `    <p-button label="${label}" icon="${icon}" severity="secondary" text />`)
      .join('\n')
  : ''

const headerRow = columns
  .map((c) => (c.sortable ? `      <th pSortableColumn="${c.field}">${c.header} <p-sortIcon field="${c.field}" /></th>` : `      <th>${c.header}</th>`))
  .join('\n')
const bodyRow = columns.map((c) => `      <td>{{ row.${c.field} }}</td>`).join('\n')
const toolbarCode = actions ? `<p-toolbar>\n  <ng-template #end>\n${actions}\n  </ng-template>\n</p-toolbar>\n` : ''
const table = `<p-table [value]="rows" dataKey="id"${checkbox ? ' [(selection)]="selected"' : ''}${flag('stripedRows', is(instance, 'Striped', 'Yes'))}${flag('showGridlines', is(first, 'Grid Lines'))}${size ? ` size="${size}"` : ''}${instance.getBoolean('Scrollbar') ? ' [scrollable]="true" scrollHeight="400px"' : ''}>${headerBar ? `
  <ng-template #caption>${headerBar.getString('Text')}</ng-template>` : ''}${instance.getBoolean('Show Header Cells') ? `
  <ng-template #header>
    <tr>${checkbox ? '\n      <th style="width: 4rem"><p-tableHeaderCheckbox /></th>' : ''}
${headerRow}
    </tr>
  </ng-template>` : ''}
  <ng-template #body let-row>
    <tr>${checkbox ? '\n      <td><p-tableCheckbox [value]="row" /></td>' : ''}
${bodyRow}
    </tr>
  </ng-template>${footerBar ? `
  <ng-template #summary>${footerBar.getString('Text')}</ng-template>` : ''}
</p-table>`

const example = figma.code`${toolbarCode}${table}`
const imports = ["import { TableModule } from 'primeng/table';", ...(toolbarCode ? ["import { Toolbar } from 'primeng/toolbar';", "import { Button } from 'primeng/button';"] : [])]

export default {
  example,
  imports,
  id: 'datatable',
  metadata: { nestable: true },
}
