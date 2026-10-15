import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ColorPicker } from 'primeng/colorpicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { ExplorerState } from '../explorer-state';
import type { ControlDef } from '../model';
import { defaultValue, groupControls, type ChoiceField, type ChoiceOption } from './control-groups';

/** Stands for "component default" in the segmented controls (an `undefined` option value is not selectable). */
const DEFAULT_OPTION = '__po-default__';
const ADVANCED_KEY = 'po-explorer.advanced';

interface Option {
  label: string;
  value: unknown;
}

function readAdvanced(): boolean {
  try {
    return localStorage.getItem(ADVANCED_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Right column. Appearance choices, presets, show/hide and state toggles, texts, the remaining inputs
 * (collapsed under Avanzado) and the event log of the selected component. See `control-groups.ts`.
 */
@Component({
  selector: 'po-controls-panel',
  imports: [DatePipe, FormsModule, Button, ColorPicker, InputNumber, InputText, Select, SelectButton, ToggleSwitch, Tooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="po-panel po-scroll">
      <header class="po-panel__header">
        <div class="po-panel__heading">
          <p class="po-eyebrow">Panel de control</p>
          <h2 class="po-panel__title">{{ state.selected().title }}</h2>
        </div>
        <p-button
          label="Restablecer"
          icon="ph ph-arrow-counter-clockwise"
          variant="text"
          size="small"
          [disabled]="!state.dirty()"
          (onClick)="state.reset()"
        />
      </header>

      @if (groups().appearance.length > 0) {
        <section class="po-section" aria-labelledby="po-group-appearance">
          <h3 class="po-eyebrow" id="po-group-appearance">Apariencia</h3>
          <div class="po-fields">
            @for (field of groups().appearance; track field.name) {
              @let options = visibleOptions(field);
              @if (options.length > 0) {
                <div class="po-field">
                  <span
                    class="po-field__label"
                    [id]="'po-field-' + field.name"
                    [pTooltip]="hint(field.name, field.description)"
                    tooltipPosition="left"
                    [showDelay]="400"
                  >
                    {{ field.label }}
                  </span>
                  <div class="po-segmented" role="group" [attr.aria-labelledby]="'po-field-' + field.name">
                    @for (option of options; track $index) {
                      @let chosen = isChosen(field, option);
                      <button
                        type="button"
                        class="po-segment"
                        [class.po-segment--active]="chosen"
                        [attr.aria-pressed]="chosen"
                        (click)="choose(field, option)"
                      >
                        @if (option.swatch) {
                          <span class="po-segment__swatch" [style.background]="option.swatch" aria-hidden="true"></span>
                        }
                        @if (option.icon) {
                          <i [class]="option.icon" aria-hidden="true"></i>
                        }
                        {{ option.label }}
                      </button>
                    }
                  </div>
                </div>
              }
            }
          </div>
        </section>
      }

      @if (state.selected().presets.length > 1) {
        <section class="po-section" aria-labelledby="po-group-presets">
          <h3 class="po-eyebrow" id="po-group-presets">Ejemplos</h3>
          <div class="po-chips">
            @for (preset of state.selected().presets; track preset.id) {
              <button
                type="button"
                class="po-chip"
                [class.po-chip--active]="preset.id === state.presetId()"
                [attr.aria-pressed]="preset.id === state.presetId()"
                (click)="state.applyPreset(preset.id)"
              >
                {{ preset.name }}
              </button>
            }
          </div>
        </section>
      }

      @for (group of flagGroups(); track group.id) {
        @if (group.items.length > 0) {
          <section class="po-section" [attr.aria-labelledby]="'po-group-' + group.id">
            <h3 class="po-eyebrow" [id]="'po-group-' + group.id">{{ group.title }}</h3>
            <div class="po-toggles">
              @for (item of group.items; track item.control.name) {
                @let on = booleanValue(item.control);
                <button
                  type="button"
                  class="po-toggle"
                  [class.po-toggle--on]="on"
                  [attr.aria-pressed]="on"
                  [pTooltip]="hint(item.control.name, item.control.description)"
                  tooltipPosition="top"
                  [showDelay]="400"
                  (click)="toggle(item.control)"
                >
                  <span class="po-toggle__box" aria-hidden="true"><i class="ph ph-check"></i></span>
                  {{ item.label }}
                </button>
              }
            </div>
          </section>
        }
      }

      @if (groups().content.length > 0) {
        <section class="po-section" aria-labelledby="po-group-content">
          <h3 class="po-eyebrow" id="po-group-content">Contenido</h3>
          <div class="po-inputs">
            @for (item of groups().content; track item.control.name) {
              <label
                class="po-inputs__label"
                [for]="'po-input-' + item.control.name"
                [pTooltip]="hint(item.control.name, item.control.description)"
                tooltipPosition="left"
                [showDelay]="400"
              >
                {{ item.label }}
              </label>
              @if (item.control.kind === 'number') {
                <p-inputnumber
                  size="small"
                  [fluid]="true"
                  [inputId]="'po-input-' + item.control.name"
                  [showButtons]="true"
                  buttonLayout="horizontal"
                  incrementButtonIcon="ph ph-plus"
                  decrementButtonIcon="ph ph-minus"
                  [min]="item.control.min"
                  [max]="item.control.max"
                  [ngModel]="numberValue(item.control)"
                  (ngModelChange)="state.setArg(item.control.name, $event ?? undefined)"
                />
              } @else {
                <input
                  pInputText
                  pSize="small"
                  [id]="'po-input-' + item.control.name"
                  [value]="textValue(item.control)"
                  [placeholder]="item.control.defaultSummary ?? ''"
                  (input)="onText(item.control, $event)"
                />
              }
            }
          </div>
        </section>
      }

      @if (state.selected().controls.length === 0) {
        <section class="po-section">
          <h3 class="po-eyebrow">Propiedades</h3>
          <p class="po-muted po-empty">Este componente no tiene propiedades configurables.</p>
        </section>
      }

      @if (groups().advanced.length > 0) {
        <section class="po-section">
          @if (hasMain()) {
            <button
              type="button"
              class="po-disclosure"
              aria-controls="po-advanced"
              [attr.aria-expanded]="advancedOpen()"
              (click)="toggleAdvanced()"
            >
              <span class="po-eyebrow">Avanzado</span>
              <span class="po-disclosure__count">{{ groups().advanced.length }}</span>
              <i class="ph ph-caret-down po-disclosure__icon" aria-hidden="true"></i>
            </button>
          } @else {
            <h3 class="po-eyebrow">Propiedades</h3>
          }
          <div id="po-advanced" class="po-advanced">
            @if (advancedOpen() || !hasMain()) {
              @for (control of groups().advanced; track control.name) {
                <div class="po-control">
                  <div class="po-control__label">
                    <span class="po-control__name">
                      {{ control.name }}
                      @if (control.description) {
                        <i
                          class="ph ph-info po-control__info"
                          tabindex="0"
                          role="img"
                          [attr.aria-label]="control.description"
                          [pTooltip]="control.description"
                          tooltipPosition="left"
                          tooltipEvent="both"
                        ></i>
                      }
                    </span>
                    @if (control.defaultSummary) {
                      <span class="po-control__default po-muted">Por defecto: {{ control.defaultSummary }}</span>
                    }
                  </div>

                  <div class="po-control__field">
                    @switch (control.kind) {
                      @case ('boolean') {
                        <p-toggleswitch
                          [ngModel]="booleanValue(control)"
                          (ngModelChange)="state.setArg(control.name, $event)"
                          [ariaLabel]="control.name"
                        />
                      }
                      @case ('inline-radio') {
                        <p-selectbutton
                          size="small"
                          [options]="radioOptions(control)"
                          optionLabel="label"
                          optionValue="value"
                          [allowEmpty]="false"
                          [ngModel]="radioValue(control)"
                          (ngModelChange)="setRadio(control, $event)"
                        />
                      }
                      @case ('select') {
                        <div class="po-control__field--select">
                          <p-select
                            size="small"
                            [fluid]="true"
                            [showClear]="true"
                            placeholder="Por defecto"
                            [options]="selectOptions(control)"
                            optionLabel="label"
                            optionValue="value"
                            [ngModel]="state.args()[control.name]"
                            (ngModelChange)="state.setArg(control.name, $event ?? undefined)"
                          />
                        </div>
                      }
                      @case ('number') {
                        <div class="po-control__field--number">
                          <p-inputnumber
                            size="small"
                            [fluid]="true"
                            [showButtons]="true"
                            buttonLayout="horizontal"
                            incrementButtonIcon="ph ph-plus"
                            decrementButtonIcon="ph ph-minus"
                            [min]="control.min"
                            [max]="control.max"
                            [ngModel]="numberValue(control)"
                            (ngModelChange)="state.setArg(control.name, $event ?? undefined)"
                          />
                        </div>
                      }
                      @case ('color') {
                        <div class="po-control__color">
                          <p-colorpicker [ngModel]="colorValue(control)" (ngModelChange)="state.setArg(control.name, $event)" />
                          <input
                            pInputText
                            pSize="small"
                            class="po-control__hex"
                            spellcheck="false"
                            [value]="textValue(control)"
                            (change)="onText(control, $event)"
                          />
                        </div>
                      }
                      @default {
                        <input
                          pInputText
                          pSize="small"
                          class="po-control__text"
                          [value]="textValue(control)"
                          [placeholder]="control.defaultSummary ?? ''"
                          (input)="onText(control, $event)"
                        />
                      }
                    }
                  </div>
                </div>
              }
            }
          </div>
        </section>
      }

      @if (state.selected().events.length > 0) {
        <section class="po-section">
          <div class="po-section__bar">
            <p class="po-eyebrow">Eventos</p>
            @if (state.events().length > 0) {
              <p-button icon="ph ph-broom" variant="text" size="small" [rounded]="true" ariaLabel="Limpiar eventos" (onClick)="state.clearEvents()" />
            }
          </div>
          <ul class="po-events">
            @for (event of state.selected().events; track event.name) {
              <li class="po-events__item">
                <span class="po-events__name">{{ event.name }}</span>
                <span class="po-events__count" [class.po-events__count--active]="(counts().get(event.name) ?? 0) > 0">
                  {{ counts().get(event.name) ?? 0 }}
                </span>
              </li>
            }
          </ul>
          @if (recent().length > 0) {
            <ol class="po-feed">
              @for (record of recent(); track record.id) {
                <li class="po-feed__item" [class.po-feed__item--new]="$first">
                  <span class="po-feed__name">{{ record.name }}</span>
                  <span class="po-feed__time po-muted">{{ record.time | date: 'HH:mm:ss' }}</span>
                  @if (record.payload) {
                    <span class="po-feed__payload po-muted" [title]="record.payload">{{ record.payload }}</span>
                  }
                </li>
              }
            </ol>
          } @else {
            <p class="po-muted po-empty">Interactúa con el componente para ver sus eventos.</p>
          }
        </section>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      background: var(--po-surface-2);
      border-left: 1px solid var(--p-content-border-color);
    }

    .po-panel {
      flex: 1;
      min-height: 0;
    }

    .po-panel__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid var(--p-content-border-color);
    }

    .po-panel__heading {
      min-width: 0;
    }

    .po-panel__title {
      margin: 4px 0 0;
      font-size: 1.125rem;
      font-weight: 600;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .po-eyebrow {
      margin: 0;
    }

    .po-section {
      padding: 16px;
      border-bottom: 1px solid var(--p-content-border-color);
    }

    .po-section:last-child {
      border-bottom: 0;
    }

    .po-section__bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 1.75rem;
    }

    .po-empty {
      margin: 12px 0 0;
      font-size: 0.8125rem;
    }

    /* Appearance: one segmented choice per visual enum */
    .po-fields {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-top: 12px;
    }

    .po-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .po-field__label {
      align-self: flex-start;
      font-size: 0.8125rem;
      font-weight: 600;
    }

    .po-segmented {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      padding: 2px;
      border-radius: var(--p-form-field-border-radius);
      background: var(--po-surface-3);
    }

    .po-segment {
      display: inline-flex;
      flex: 1 1 auto;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-width: 2.5rem;
      min-height: 2rem;
      padding: 4px 10px;
      border: 0;
      border-radius: calc(var(--p-form-field-border-radius) - 2px);
      background: transparent;
      color: var(--p-text-muted-color);
      font: inherit;
      font-size: 0.8125rem;
      font-weight: 500;
      line-height: 1.2;
      cursor: pointer;
      transition:
        background-color 150ms,
        color 150ms;
    }

    .po-segment:hover {
      background: var(--po-surface-2);
      color: var(--p-text-color);
    }

    .po-segment:focus-visible {
      position: relative;
      outline: 2px solid var(--p-focus-ring-color);
      outline-offset: 1px;
    }

    .po-segment--active,
    .po-segment--active:hover {
      background: var(--p-primary-color);
      color: var(--p-primary-contrast-color);
    }

    .po-segment__swatch {
      flex: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12);
    }

    .po-segment--active .po-segment__swatch {
      box-shadow: 0 0 0 1.5px var(--p-primary-contrast-color);
    }

    /* Presets */
    .po-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .po-chip {
      padding: 4px 12px;
      border: 1px solid var(--p-content-border-color);
      border-radius: var(--p-form-field-border-radius);
      background: transparent;
      color: var(--p-text-color);
      font: inherit;
      font-size: 0.8125rem;
      font-weight: 500;
      line-height: 1.5;
      cursor: pointer;
      transition:
        background-color 150ms,
        border-color 150ms,
        color 150ms;
    }

    .po-chip:hover {
      background: var(--po-surface-3);
    }

    .po-chip:focus-visible {
      outline: 2px solid var(--p-focus-ring-color);
      outline-offset: 2px;
    }

    .po-chip--active,
    .po-chip--active:hover {
      border-color: var(--p-primary-color);
      background: var(--p-primary-color);
      color: var(--p-primary-contrast-color);
    }

    /* Elements and state: toggle chips with a check box */
    .po-toggles {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 12px;
    }

    .po-toggle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 2rem;
      padding: 4px 10px 4px 8px;
      border: 1px solid var(--p-content-border-color);
      border-radius: var(--p-form-field-border-radius);
      background: var(--p-content-background);
      color: var(--p-text-color);
      font: inherit;
      font-size: 0.8125rem;
      font-weight: 500;
      line-height: 1.2;
      cursor: pointer;
      transition:
        background-color 150ms,
        border-color 150ms,
        color 150ms;
    }

    .po-toggle:hover {
      border-color: var(--p-form-field-hover-border-color);
    }

    .po-toggle:focus-visible {
      outline: 2px solid var(--p-focus-ring-color);
      outline-offset: 2px;
    }

    .po-toggle__box {
      display: inline-grid;
      flex: none;
      place-items: center;
      width: 16px;
      height: 16px;
      border: 1.5px solid var(--p-form-field-border-color);
      border-radius: min(4px, var(--p-form-field-border-radius));
      background: var(--p-content-background);
      color: var(--p-primary-contrast-color);
      font-size: 11px;
      transition:
        background-color 150ms,
        border-color 150ms;
    }

    .po-toggle__box i {
      opacity: 0;
    }

    .po-toggle--on,
    .po-toggle--on:hover {
      border-color: var(--p-primary-color);
      background: var(--p-highlight-background);
      color: var(--p-highlight-color);
    }

    .po-toggle--on .po-toggle__box {
      border-color: var(--p-primary-color);
      background: var(--p-primary-color);
    }

    .po-toggle--on .po-toggle__box i {
      opacity: 1;
    }

    /* Content: label and input per row */
    .po-inputs {
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
      align-items: center;
      gap: 8px 12px;
      margin-top: 12px;
    }

    .po-inputs__label {
      font-size: 0.8125rem;
      overflow-wrap: anywhere;
    }

    .po-inputs input {
      width: 100%;
    }

    /* Advanced */
    .po-disclosure {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 0;
      border: 0;
      border-radius: var(--po-radius-sm);
      background: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }

    .po-disclosure:hover .po-eyebrow {
      color: var(--p-text-color);
    }

    .po-disclosure:focus-visible {
      outline: 2px solid var(--p-focus-ring-color);
      outline-offset: 4px;
    }

    .po-disclosure__count {
      min-width: 1.25rem;
      padding: 0 6px;
      border-radius: 999px;
      background: var(--po-surface-3);
      color: var(--p-text-muted-color);
      font-size: 0.6875rem;
      font-weight: 600;
      line-height: 1.25rem;
      text-align: center;
    }

    .po-disclosure__icon {
      margin-left: auto;
      color: var(--p-text-muted-color);
      transition: transform 150ms;
    }

    .po-disclosure[aria-expanded='true'] .po-disclosure__icon {
      transform: rotate(180deg);
    }

    .po-advanced:empty {
      display: none;
    }

    .po-advanced {
      margin-top: 4px;
    }

    .po-control {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--p-content-border-color);
    }

    .po-control:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    .po-control__label {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1 1 8rem;
    }

    .po-control__name {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8125rem;
      font-weight: 500;
      word-break: break-word;
    }

    .po-control__info {
      color: var(--p-text-muted-color);
      font-size: 0.9375rem;
      cursor: help;
      border-radius: 50%;
      transition: color 150ms;
    }

    .po-control__info:hover {
      color: var(--p-text-color);
    }

    .po-control__info:focus-visible {
      outline: 2px solid var(--p-focus-ring-color);
      outline-offset: 2px;
    }

    .po-control__default {
      font-size: 0.75rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .po-control__field {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-left: auto;
      max-width: 100%;
    }

    .po-control__field--select {
      width: 10rem;
    }

    .po-control__field--number {
      width: 9.5rem;
    }

    .po-control__text {
      width: 10rem;
    }

    .po-control__color {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .po-control__hex {
      width: 6rem;
      font-family: var(--po-font-mono);
    }

    /* Events */
    .po-events {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 12px 0 0;
      padding: 0;
      list-style: none;
    }

    .po-events__item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 8px 2px 10px;
      border: 1px solid var(--p-content-border-color);
      border-radius: 999px;
      font-size: 0.75rem;
      font-family: var(--po-font-mono);
    }

    .po-events__count {
      min-width: 1.25rem;
      padding: 0 5px;
      border-radius: 999px;
      background: var(--po-surface-3);
      color: var(--p-text-muted-color);
      font-family: inherit;
      font-size: 0.6875rem;
      font-weight: 600;
      line-height: 1.25rem;
      text-align: center;
      transition:
        background-color 150ms,
        color 150ms;
    }

    .po-events__count--active {
      background: var(--p-primary-color);
      color: var(--p-primary-contrast-color);
    }

    .po-feed {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 12px 0 0;
      padding: 0;
      list-style: none;
    }

    .po-feed__item {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0 8px;
      padding: 8px 10px;
      border-radius: var(--po-radius-sm);
      background: var(--po-surface-3);
      font-size: 0.75rem;
    }

    .po-feed__item--new {
      animation: po-feed-in 150ms ease-out;
    }

    .po-feed__name {
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .po-feed__time {
      font-variant-numeric: tabular-nums;
    }

    .po-feed__payload {
      grid-column: 1 / -1;
      font-family: var(--po-font-mono);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @keyframes po-feed-in {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .po-feed__item--new {
        animation: none;
      }

      .po-segment,
      .po-toggle,
      .po-toggle__box,
      .po-disclosure__icon {
        transition: none;
      }
    }
  `,
})
export class ControlsPanelComponent {
  protected readonly state = inject(ExplorerState);

  protected readonly groups = computed(() => groupControls(this.state.selected()));

  protected readonly flagGroups = computed(() => [
    { id: 'elements', title: 'Elementos', items: this.groups().elements },
    { id: 'state', title: 'Estado', items: this.groups().state },
  ]);

  /** Whether a section other than Avanzado has controls; if not, those are shown open as "Propiedades". */
  protected readonly hasMain = computed(() => {
    const { appearance, elements, state, content } = this.groups();
    return appearance.length + elements.length + state.length + content.length > 0;
  });

  protected readonly advancedOpen = signal(readAdvanced());

  /** Number of logged records per event name. */
  protected readonly counts = computed(() => {
    const counts = new Map<string, number>();
    for (const record of this.state.events()) counts.set(record.name, (counts.get(record.name) ?? 0) + 1);
    return counts;
  });

  protected readonly recent = computed(() => this.state.events().slice(0, 8));

  /** Unset args count as their fallback (the component default). */
  protected isChosen(field: ChoiceField, option: ChoiceOption): boolean {
    const args = this.state.args();
    return Object.entries(option.args).every(([name, value]) => (args[name] ?? field.fallbacks[name]) === value);
  }

  protected choose(field: ChoiceField, option: ChoiceOption): void {
    for (const [name, value] of Object.entries(option.args)) {
      const preset = this.presetValue(name);
      this.state.setArg(name, (preset ?? field.fallbacks[name]) === value ? preset : value);
    }
    // A dependent choice left without a valid option takes the first one that applies (Timeline align after a layout change)
    for (const other of this.groups().appearance) {
      if (other === field || !other.options.some((o) => o.when)) continue;
      const options = this.visibleOptions(other);
      if (options.length > 0 && !options.some((o) => this.isChosen(other, o))) this.choose(other, options[0]);
    }
  }

  /** Options that apply to the current args (see `ChoiceOption.when`); a field without any is hidden. */
  protected visibleOptions(field: ChoiceField): ChoiceOption[] {
    const args = this.state.args();
    return field.options.filter((option) =>
      Object.entries(option.when ?? {}).every(([name, values]) => values.includes(args[name] ?? field.fallbacks[name])),
    );
  }

  protected toggle(control: ControlDef): void {
    const on = !this.booleanValue(control);
    const preset = this.presetValue(control.name);
    this.state.setArg(control.name, (preset ?? this.booleanDefault(control)) === on ? preset : on);
  }

  /**
   * Value of the arg in the active preset. Choosing what it already means restores it as is, so the
   * code keeps no redundant attribute and Restablecer turns off again.
   */
  private presetValue(name: string): unknown {
    const entry = this.state.selected();
    const preset = entry.presets.find((p) => p.id === this.state.presetId());
    return { ...entry.baseArgs, ...preset?.args }[name];
  }

  /** Tooltip with the technical name of the input. */
  protected hint(name: string, description?: string): string {
    return description ? `${name}: ${description}` : name;
  }

  protected toggleAdvanced(): void {
    const open = !this.advancedOpen();
    this.advancedOpen.set(open);
    try {
      localStorage.setItem(ADVANCED_KEY, open ? '1' : '0');
    } catch {
      // Storage unavailable (private mode): the preference just is not remembered.
    }
  }

  protected radioOptions(control: ControlDef): Option[] {
    return (control.options ?? []).map((value) => ({ label: value === undefined ? 'Auto' : String(value), value: value ?? DEFAULT_OPTION }));
  }

  protected radioValue(control: ControlDef): unknown {
    return this.state.args()[control.name] ?? DEFAULT_OPTION;
  }

  protected setRadio(control: ControlDef, value: unknown): void {
    this.state.setArg(control.name, value === DEFAULT_OPTION ? undefined : value);
  }

  protected selectOptions(control: ControlDef): Option[] {
    return (control.options ?? []).filter((value) => value !== undefined).map((value) => ({ label: String(value), value }));
  }

  /** Unset booleans show the component default (e.g. `showBack` is true unless turned off). */
  protected booleanValue(control: ControlDef): boolean {
    const value = this.state.args()[control.name];
    return value === undefined ? this.booleanDefault(control) : value === true;
  }

  private booleanDefault(control: ControlDef): boolean {
    return defaultValue(this.state.selected(), control) === true;
  }

  protected numberValue(control: ControlDef): number | null {
    const value = this.state.args()[control.name];
    return typeof value === 'number' ? value : null;
  }

  protected textValue(control: ControlDef): string {
    const value = this.state.args()[control.name];
    return value === undefined || value === null ? '' : String(value);
  }

  protected colorValue(control: ControlDef): string | null {
    const value = this.state.args()[control.name];
    return typeof value === 'string' && value ? value : null;
  }

  protected onText(control: ControlDef, event: Event): void {
    this.state.setArg(control.name, (event.target as HTMLInputElement).value);
  }
}
