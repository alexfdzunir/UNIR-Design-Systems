// url=<PRIMEONE>?node-id=14309-26860
// source=https://github.com/alexfdzunir/UNIR-Design-Systems/blob/main/src/components/Sidebar/sidebar.ts
// component=PrimeOneSidebar
import figma from 'figma'
import { is } from '../../figma/helpers'

const instance = figma.selectedInstance
const mobile = is(instance, 'Display', 'Mobile')

const example = figma.code`<prime-one-sidebar [sections]="sections"${instance.getBoolean('Profile') ? ' [user]="user"' : ''} logo="assets/brand-icon.svg" [(collapsed)]="collapsed"${mobile ? ' [mobile]="true"' : ''}${instance.getBoolean('Button') ? '' : ' [showLogout]="false"'} (itemClick)="navigate($event)" (logout)="logout()" />`
const imports = ["import { PrimeOneSidebar } from 'prime-one-ds';"]

export default {
  example,
  imports,
  id: 'sidebar',
  metadata: { nestable: true },
}
