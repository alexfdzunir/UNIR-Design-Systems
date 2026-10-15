import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Stepper, StepList, Step, StepPanels, StepPanel, StepItem } from 'primeng/stepper';
import { Button } from 'primeng/button';
import { PrimeOneStepListCenter } from './step-list-center';

/** Figma's stepper-list has Item 1..8. */
const MAX_STEPS = 8;

const STEPS = [
  { value: 1, label: 'Datos', content: 'Introduce tus datos personales.' },
  { value: 2, label: 'Documentación', content: 'Adjunta la documentación requerida.' },
  { value: 3, label: 'Confirmación', content: 'Revisa y confirma la solicitud.' },
  { value: 4, label: 'Pago', content: 'Elige la forma de pago.' },
  { value: 5, label: 'Matrícula', content: 'Formaliza la matrícula.' },
  { value: 6, label: 'Acceso', content: 'Activa tu cuenta de acceso.' },
  { value: 7, label: 'Bienvenida', content: 'Conoce el campus virtual.' },
  { value: 8, label: 'Inicio', content: 'Comienza el curso.' },
];

const meta: Meta = {
  title: 'Panel/Stepper',
  decorators: [moduleMetadata({ imports: [Stepper, StepList, Step, StepPanels, StepPanel, StepItem, Button, PrimeOneStepListCenter] })],
  parameters: {
    controls: { expanded: true },
    storyOrder: ['Default', 'Linear', 'Vertical'],
  },
  args: {
    value: 1,
    steps: 3,
    linear: false,
    vertical: false,
  },
  argTypes: {
    value: { control: { type: 'number', min: 1, max: MAX_STEPS }, description: 'A model that can hold a numeric value or be undefined.', table: { defaultValue: { summary: 'undefined' } } },
    steps: { control: { type: 'number', min: 1, max: MAX_STEPS }, description: 'Número de pasos (Item 1..8 en Figma).' },
    linear: { control: 'boolean', description: 'When enabled, steps can only be completed in order.' },
    vertical: { control: 'boolean', description: 'Orientación vertical (Orientation Vertical en Figma).' },
  },
  render: (args) => ({
    props: { ...args, steps: STEPS.slice(0, Math.min(Math.max(1, Number(args['steps']) || 3), MAX_STEPS)) },
    template: `
      <p-stepper [(value)]="value" [linear]="linear">
        @if (vertical) {
          @for (step of steps; track step.value; let first = $first, last = $last) {
            <p-step-item [value]="step.value">
              <p-step>{{ step.label }}</p-step>
              <p-step-panel>
                <ng-template #content let-activateCallback="activateCallback">
                  <p>{{ step.content }}</p>
                  <div class="sb-row">
                    @if (!first) {
                      <p-button label="Anterior" icon="ph ph-arrow-left" severity="secondary" (onClick)="activateCallback(step.value - 1)" />
                    }
                    @if (!last) {
                      <p-button label="Siguiente" icon="ph ph-arrow-right" iconPos="right" (onClick)="activateCallback(step.value + 1)" />
                    }
                  </div>
                </ng-template>
              </p-step-panel>
            </p-step-item>
          }
        } @else {
          <p-step-list poCenterActive>
            @for (step of steps; track step.value) {
              <p-step [value]="step.value">{{ step.label }}</p-step>
            }
          </p-step-list>
          <p-step-panels>
            @for (step of steps; track step.value; let first = $first, last = $last) {
              <p-step-panel [value]="step.value">
                <ng-template #content let-activateCallback="activateCallback">
                  <p>{{ step.content }}</p>
                  <div class="sb-row" style="justify-content: flex-end">
                    @if (!first) {
                      <p-button label="Anterior" icon="ph ph-arrow-left" severity="secondary" (onClick)="activateCallback(step.value - 1)" />
                    }
                    @if (!last) {
                      <p-button label="Siguiente" icon="ph ph-arrow-right" iconPos="right" (onClick)="activateCallback(step.value + 1)" />
                    }
                  </div>
                </ng-template>
              </p-step-panel>
            }
          </p-step-panels>
        }
      </p-stepper>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Linear: Story = { args: { linear: true } };
export const Vertical: Story = { args: { vertical: true } };
