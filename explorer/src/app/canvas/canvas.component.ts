import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, effect, type ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { Tooltip } from 'primeng/tooltip';
import { ExplorerState } from '../explorer-state';
import { CATEGORIES, PAGE_BREAKPOINTS, VIEWPORTS } from '../model';
import { CodePanelComponent } from '../code/code-panel.component';
import { StoryFrameComponent } from './story-frame.component';

const CODE_PANEL_KEY = 'po-explorer.code';

/** Stage of the selected component: header with tools, live render at the chosen width and copyable code. */
@Component({
  selector: 'po-canvas',
  imports: [FormsModule, Button, SelectButton, Tooltip, StoryFrameComponent, CodePanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="po-canvas__bar">
      <div class="po-canvas__heading">
        <button type="button" class="po-eyebrow po-canvas__section" (click)="state.openSection(state.selected().category)">
          {{ categoryLabel() }}
        </button>
        <div class="po-canvas__title">
          <h1>{{ state.selected().title }}</h1>
          @if (state.selected().figmaUrl) {
            <p-button
              icon="ph ph-figma-logo"
              variant="text"
              severity="secondary"
              [rounded]="true"
              size="small"
              ariaLabel="Abrir en Figma"
              pTooltip="Abrir en Figma"
              tooltipPosition="bottom"
              (onClick)="openFigma()"
            />
          }
        </div>
      </div>
      <div class="po-canvas__tools">
        @if (isPage()) {
          @if (state.selected().presets.length > 1) {
            <p-selectbutton
              [options]="state.selected().presets"
              optionLabel="name"
              optionValue="id"
              size="small"
              [allowEmpty]="false"
              ariaLabel="Variante de la página"
              [ngModel]="state.presetId()"
              (ngModelChange)="state.applyPreset($event)"
            />
          }
          <p-selectbutton
            [options]="breakpoints"
            optionValue="width"
            size="small"
            [allowEmpty]="false"
            ariaLabel="Breakpoint de la página"
            [ngModel]="pageWidth()"
            (ngModelChange)="pageWidth.set($event)"
          >
            <ng-template #item let-item>
              <span class="po-canvas__breakpoint" [pTooltip]="item.label" tooltipPosition="bottom"><i [class]="item.icon"></i>{{ item.width }}</span>
            </ng-template>
          </p-selectbutton>
        } @else {
        <p-selectbutton
          [options]="viewports"
          optionValue="id"
          size="small"
          [allowEmpty]="false"
          ariaLabel="Ancho del lienzo"
          [ngModel]="state.viewport()"
          (ngModelChange)="state.viewport.set($event)"
        >
          <ng-template #item let-item>
            <i [class]="item.icon" [pTooltip]="item.label" tooltipPosition="bottom" [attr.aria-label]="item.label"></i>
          </ng-template>
        </p-selectbutton>
        }
        <p-button
          label="Código"
          icon="ph ph-code"
          variant="text"
          severity="secondary"
          size="small"
          [pTooltip]="showCode() ? 'Ocultar código' : 'Ver código'"
          tooltipPosition="bottom"
          [attr.aria-pressed]="showCode()"
          (onClick)="toggleCode()"
        />
        @if (isPage()) {
          <p-button
            [icon]="fullscreen() ? 'ph ph-arrows-in' : 'ph ph-arrows-out'"
            variant="text"
            severity="secondary"
            size="small"
            [ariaLabel]="fullscreen() ? 'Salir de pantalla completa' : 'Ver a pantalla completa'"
            [pTooltip]="fullscreen() ? 'Salir de pantalla completa' : 'Ver a pantalla completa'"
            tooltipPosition="bottom"
            (onClick)="toggleFullscreen()"
          />
        }
      </div>
    </header>

    @if (description().length) {
      <p class="po-canvas__description po-muted">
        @for (part of description(); track $index) {
          @if (part.code) {
            <code>{{ part.text }}</code>
          } @else {
            {{ part.text }}
          }
        }
      </p>
    }

    <section class="po-canvas__stage po-scroll" #stage>
      <div class="po-canvas__sizer" [class.po-canvas__sizer--page]="isPage()" [style.width.px]="pageSize()?.width" [style.height.px]="pageSize()?.height">
        <div class="po-canvas__frame" [style.width]="frameWidth()" [style.transform]="pageSize() ? 'scale(' + scale() + ')' : null" [style.--po-page-scale]="scale()" #frame>
          <span class="po-canvas__width">{{ measuredWidth() }} px{{ isPage() && scale() < 1 ? ' · ' + scalePercent() + ' %' : '' }}</span>
          <po-story-frame [minHeight]="frameMinHeight()" [fixed]="isPage()" />
        </div>
      </div>
    </section>

    @if (showCode()) {
      <po-code-panel (closed)="toggleCode()" />
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-width: 0;
      min-height: 0;
      height: 100%;
      background: var(--p-content-background);
      container: po-canvas / inline-size;
    }

    .po-canvas__bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex: 0 0 var(--po-bar-height);
      padding: 0 24px;
      border-bottom: 1px solid var(--p-content-border-color);
    }

    .po-canvas__heading {
      display: flex;
      flex-direction: column;
      min-width: 0;
      line-height: 1.2;
    }

    .po-canvas__section {
      align-self: flex-start;
      padding: 0;
      border: 0;
      background: none;
      font-family: inherit;
      cursor: pointer;
    }

    .po-canvas__section:hover {
      color: var(--p-primary-color);
      text-decoration: underline;
    }

    .po-canvas__title {
      display: flex;
      align-items: center;
      gap: 4px;
      min-width: 0;
    }

    .po-canvas__title h1 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .po-canvas__tools {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 0 0 auto;
    }

    .po-canvas__tools i {
      display: block;
      font-size: 1.125rem;
      line-height: 1;
    }

    .po-canvas__description {
      margin: 0;
      padding: 12px 24px;
      border-bottom: 1px solid var(--p-content-border-color);
      background: var(--po-surface-2);
    }

    .po-canvas__description code {
      font-family: var(--po-font-mono);
      font-size: 0.8125rem;
    }

    .po-canvas__description code {
      padding: 1px 5px;
      border-radius: 4px;
      background: var(--po-surface-3);
      color: var(--p-text-color);
    }

    .po-canvas__stage {
      flex: 1 1 auto;
      padding: 24px;
      background-color: var(--po-surface-2);
      background-image: radial-gradient(var(--po-stage-dot) 1px, transparent 1px);
      background-size: 20px 20px;
    }

    /* The device frame: its content box is exactly the viewport width the iframe gets */
    .po-canvas__frame {
      position: relative;
      box-sizing: content-box;
      margin: 0 auto;
      border: 1px solid var(--p-content-border-color);
      border-radius: var(--po-radius);
      background: var(--p-content-background);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -12px rgba(0, 0, 0, 0.12);
      transition: width 200ms ease;
    }

    /* Pages: the frame keeps the real breakpoint width and is scaled down to fit; the sizer takes the scaled box */
    .po-canvas__sizer--page {
      margin: 0 auto;
    }

    .po-canvas__sizer--page .po-canvas__frame {
      margin: 0;
      transform-origin: 0 0;
      transition: none;
    }

    .po-canvas__sizer--page .po-canvas__width {
      top: auto;
      bottom: 100%;
      transform-origin: 100% 100%;
      transform: scale(calc(1 / var(--po-page-scale, 1)));
    }

    .po-canvas__breakpoint {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-variant-numeric: tabular-nums;
    }

    .po-canvas__frame po-story-frame {
      overflow: hidden;
      border-radius: inherit;
    }

    .po-canvas__width {
      position: absolute;
      top: -20px;
      right: 0;
      font-size: 0.6875rem;
      font-variant-numeric: tabular-nums;
      color: var(--p-text-muted-color);
    }

    :host ::ng-deep :focus-visible {
      outline: 2px solid var(--p-focus-ring-color);
      outline-offset: 2px;
    }

    /* Narrow stage (small window or both columns open): the bar wraps and paddings shrink */
    @container po-canvas (max-width: 719.98px) {
      .po-canvas__bar {
        flex-wrap: wrap;
        flex-basis: auto;
        row-gap: 8px;
        padding: 8px 16px;
      }

      .po-canvas__tools {
        flex: 1 1 auto;
        justify-content: flex-end;
      }

      .po-canvas__description {
        padding: 10px 16px;
      }

      .po-canvas__stage {
        padding: 16px;
      }
    }

    /* Only the automatic width fits: the device selector would not change anything */
    @container po-canvas (max-width: 439.98px) {
      .po-canvas__tools p-selectbutton,
      .po-canvas__width {
        display: none;
      }

      .po-canvas__stage {
        padding: 12px 8px;
      }
    }
  `,
})
export class CanvasComponent {
  protected readonly state = inject(ExplorerState);
  protected readonly viewports = VIEWPORTS;
  protected readonly breakpoints = PAGE_BREAKPOINTS;
  /** Page templates: chosen breakpoint (real width of the iframe). */
  protected readonly pageWidth = signal(1280);
  protected readonly isPage = computed(() => this.state.selected().category === 'aem-pages');

  protected readonly showCode = signal(readCodePanel());
  protected readonly fullscreen = signal(false);
  protected readonly measuredWidth = signal(0);

  /** Inner height of the stage: the preview fills it so overlays and dropdowns have room. */
  private readonly stageHeight = signal(0);
  private readonly stageWidth = signal(0);
  private readonly frameHeight = signal(0);
  /** Pages wider than the stage are scaled down to fit (2px of frame border). */
  protected readonly scale = computed(() => (this.stageWidth() ? Math.min(1, this.stageWidth() / (this.pageWidth() + 2)) : 1));
  protected readonly scalePercent = computed(() => Math.round(this.scale() * 100));
  protected readonly pageSize = computed(() =>
    this.isPage() ? { width: Math.floor((this.pageWidth() + 2) * this.scale()), height: Math.ceil((this.frameHeight() + 2) * this.scale()) } : null,
  );
  protected readonly frameMinHeight = computed(() => this.isPage() ? Math.max(240, Math.floor(this.stageHeight() / this.scale())) : Math.max(parseInt(this.state.selected().height ?? '240', 10) || 240, this.stageHeight()));
  protected readonly categoryLabel = computed(() => CATEGORIES.find((c) => c.id === this.state.selected().category)?.label ?? '');
  protected readonly frameWidth = computed(() => {
    if (this.isPage()) return `${this.pageWidth()}px`;
    const width = VIEWPORTS.find((v) => v.id === this.state.viewport())?.width;
    // A device wider than the stage is clamped to the space there is
    return width ? `min(${width}px, calc(100% - 2px))` : 'min(calc(100% - 2px), 1200px)';
  });
  /** Description split so the backtick fragments render as inline code. */
  protected readonly description = computed(() =>
    (this.state.selected().description ?? '')
      .split('`')
      .map((text, i) => ({ text, code: i % 2 === 1 }))
      .filter((part) => part.text.length > 0),
  );

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');

  constructor() {
    const destroyRef = inject(DestroyRef);
    effect(() => {
      this.state.selectedId();
      this.stage().nativeElement.scrollTop = 0;
    });
    const onFullscreen = () => this.fullscreen.set(document.fullscreenElement === this.stage().nativeElement);
    document.addEventListener('fullscreenchange', onFullscreen);
    destroyRef.onDestroy(() => document.removeEventListener('fullscreenchange', onFullscreen));
    afterNextRender(() => {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === this.frame().nativeElement) {
            this.measuredWidth.set(Math.round(entry.contentRect.width));
            this.frameHeight.set(Math.round(entry.contentRect.height));
          } else {
            // 24px padding on each side of the stage, 2px of frame border
            this.stageHeight.set(Math.max(0, Math.floor(entry.contentRect.height) - 2));
            this.stageWidth.set(Math.floor(entry.contentRect.width));
          }
        }
      });
      observer.observe(this.frame().nativeElement);
      observer.observe(this.stage().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected openFigma(): void {
    const url = this.state.selected().figmaUrl;
    if (url) window.open(url, '_blank', 'noopener');
  }

  /** Pages: the stage (with the breakpoint scaled to the screen) fills the screen. */
  protected toggleFullscreen(): void {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void this.stage().nativeElement.requestFullscreen();
  }

  protected toggleCode(): void {
    this.showCode.update((open) => !open);
    try {
      localStorage.setItem(CODE_PANEL_KEY, String(this.showCode()));
    } catch {
      // Storage may be unavailable; the panel state is only a convenience.
    }
  }
}

function readCodePanel(): boolean {
  try {
    return localStorage.getItem(CODE_PANEL_KEY) === 'true';
  } catch {
    return false;
  }
}
