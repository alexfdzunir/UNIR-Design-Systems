import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { bind } from '../../stories/helpers';

const INPUTS = ['header', 'modal', 'draggable', 'resizable', 'closeOnEscape', 'dismissableMask', 'closable', 'showHeader', 'blockScroll', 'minX', 'minY', 'focusOnShow', 'maximizable', 'keepInViewport', 'focusTrap', 'closeIcon', 'minimizeIcon', 'maximizeIcon', 'visible', 'position'];

const meta: Meta = {
  title: 'Overlay/Dialog',
  decorators: [moduleMetadata({ imports: [Dialog, Button] })],
  parameters: {
    controls: { expanded: true },
    storyOrder: ['Default', 'FooterText', 'Maximizable', 'Top', 'NotModal', 'NoFooter'],
    docs: { story: { inline: false, height: '460px' } },
  },
  args: {
    header: 'Editar perfil',
    modal: true,
    content: 'Contenido de ejemplo del componente. Cambia los controles del panel inferior para ver su comportamiento real con los tokens del tema seleccionado.',
    footer: true,
    footerText: '',
    footerButtons: true,
    onShow: fn(),
    onHide: fn(),
    onMaximize: fn(),
  },
  argTypes: {
    header: { control: 'text', description: 'Title text of the dialog.' },
    modal: { control: 'boolean', description: 'Defines if background should be blocked when dialog is displayed.' },
    draggable: { control: 'boolean', description: 'Enables dragging to change the position using header.' },
    resizable: { control: 'boolean', description: 'Enables resizing of the content.' },
    closeOnEscape: { control: 'boolean', description: 'Specifies if pressing escape key should hide the dialog.' },
    dismissableMask: { control: 'boolean', description: 'Specifies if clicking the modal background should hide the dialog.' },
    closable: { control: 'boolean', description: 'Adds a close icon to the header to hide the dialog.' },
    showHeader: { control: 'boolean', description: 'Whether to show the header or not.' },
    blockScroll: { control: 'boolean', description: 'Whether background scroll should be blocked when dialog is visible.' },
    minX: { control: 'number', description: 'Minimum value for the left coordinate of dialog in dragging.' },
    minY: { control: 'number', description: 'Minimum value for the top coordinate of dialog in dragging.' },
    focusOnShow: { control: 'boolean', description: 'When enabled, first focusable element receives focus on show.' },
    maximizable: { control: 'boolean', description: 'Whether the dialog can be displayed full screen.' },
    keepInViewport: { control: 'boolean', description: 'Keeps dialog in the viewport.' },
    focusTrap: { control: 'boolean', description: 'When enabled, can only focus on elements inside the dialog.' },
    closeIcon: { control: 'text', description: 'Name of the close icon.' },
    minimizeIcon: { control: 'text', description: 'Name of the minimize icon.' },
    maximizeIcon: { control: 'text', description: 'Name of the maximize icon.' },
    visible: { control: 'boolean', description: 'Specifies the visibility of the dialog.' },
    position: { control: 'select', options: [undefined, 'bottom', 'bottomleft', 'bottomright', 'center', 'left', 'right', 'top', 'topleft', 'topright'], description: 'Position of the dialog.' },
    content: { control: 'text' },
    footer: { control: 'boolean', description: 'Pie con acciones (Footer en Figma).' },
    footerText: { control: 'text', description: 'Texto a la izquierda del pie (Description Text en Figma).' },
    footerButtons: { control: 'boolean', description: 'Botones del pie (Buttons en Figma).' },
    onShow: { action: 'onShow', table: { category: 'Eventos' } },
    onHide: { action: 'onHide', table: { category: 'Eventos' } },
    onMaximize: { action: 'onMaximize', table: { category: 'Eventos' } },
  },
  render: (args) => ({
    props: { ...args, visible: true },
    template: `
      <p-button label="Abrir diálogo" icon="ph ph-arrow-square-out" (onClick)="visible = true" />
      <p-dialog [(visible)]="visible" [style]="{ width: '28rem' }" [breakpoints]="{ '575px': '90vw' }"${bind(args, INPUTS)} (onShow)="onShow($event)" (onHide)="onHide($event)" (onMaximize)="onMaximize($event)">
        <p style="margin: 0">{{ content }}</p>
        ${args['footer'] ? `<ng-template #footer>${args['footerText'] ? '\n    <span class="po-dialog-footer-text">{{ footerText }}</span>' : ''}${args['footerButtons'] ? '\n    <p-button label="Cancelar" variant="outlined" (onClick)="visible = false" />\n    <p-button label="Guardar" (onClick)="visible = false" />' : ''}\n  </ng-template>` : ''}
      </p-dialog>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const FooterText: Story = { args: { footerText: '2 de 3' } };
export const Maximizable: Story = { args: { maximizable: true } };
export const Top: Story = { args: { position: 'top' } };
export const NotModal: Story = { args: { modal: false } };
export const NoFooter: Story = { args: { footer: false } };
