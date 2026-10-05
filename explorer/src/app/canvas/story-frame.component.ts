import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, type ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { ExplorerState } from '../explorer-state';
import { cloneableArgs, type FrameMessage, type InspectMessage, type RenderMessage } from '../frame/frame-protocol';

/** Iframe that renders the selected story at the real device width (see `FrameRootComponent`). */
@Component({
  selector: 'po-story-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<iframe #iframe src="./?frame=1" (load)="checkFrame()" [title]="'Vista previa de ' + state.selected().title" [style.height.px]="height()"></iframe>`,
  styles: `
    :host { display: block; }
    iframe { display: block; width: 100%; border: 0; background: var(--p-content-background); }
  `,
})
export class StoryFrameComponent {
  /** Minimum height in px (stage height or the story's own height). */
  readonly minHeight = input(240);
  /** Pages: the iframe has the height of the visible stage and its own document scrolls (sticky and anchors work as in a real page). */
  readonly fixed = input(false);

  protected readonly state = inject(ExplorerState);
  private readonly iframe = viewChild.required<ElementRef<HTMLIFrameElement>>('iframe');
  private readonly ready = signal(false);
  private readonly contentHeight = signal(0);
  protected readonly height = computed(() => (this.fixed() ? this.minHeight() : Math.max(this.contentHeight(), this.minHeight())));

  constructor() {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== this.iframe().nativeElement.contentWindow) return;
      const data = event.data as FrameMessage | undefined;
      if (data?.source !== 'po-frame') return;
      if (data.type === 'ready') this.ready.set(true);
      else if (data.type === 'size') this.contentHeight.set(data.height);
      else if (data.type === 'event') this.state.logEvent(data.name, data.payload);
      else if (data.type === 'tokens') this.state.tokens.set(data.tokens);
      else if (data.type === 'measure') this.state.measure.set(data.data);
      else if (data.type === 'navigate') this.navigate(data.id);
    };
    window.addEventListener('message', onMessage);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('message', onMessage));

    effect(() => {
      const message: RenderMessage = {
        source: 'po-explorer',
        type: 'render',
        id: this.state.selected().id,
        args: cloneableArgs(this.state.args()),
        theme: this.state.theme(),
        scheme: this.state.scheme(),
      };
      if (this.ready()) this.iframe().nativeElement.contentWindow?.postMessage(message, location.origin);
    });

    effect(() => {
      const message: InspectMessage = { source: 'po-explorer', type: 'inspect', ...this.state.inspect() };
      if (this.ready()) this.iframe().nativeElement.contentWindow?.postMessage(message, location.origin);
    });
  }

  /**
   * The iframe must stay on `?frame=1`; if anything navigated it elsewhere (or the browser restored that URL
   * on reload) it would show the whole explorer, so it goes back to the frame.
   */
  protected checkFrame(): void {
    const frame = this.iframe().nativeElement;
    const search = frame.contentWindow?.location.search ?? '';
    if (!new URLSearchParams(search).has('frame')) {
      this.ready.set(false);
      frame.contentWindow?.location.replace('./?frame=1');
    }
  }

  /** Link between page templates: opens the other page from its top. */
  private navigate(id: string): void {
    this.state.select(id);
    for (let el: HTMLElement | null = this.iframe().nativeElement.parentElement; el; el = el.parentElement) {
      if (el.scrollTop) el.scrollTop = 0;
    }
    scrollTo({ top: 0 });
  }
}
