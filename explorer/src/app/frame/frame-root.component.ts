import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { usePreset } from '@primeuix/themes';
import { PrimeOneEstudiantes, PrimeOneFoundations, PrimeOneProdi } from '../../../../src/theme/presets';
import { describe } from '../explorer-state';
import { collectTokens } from './collect-tokens';
import { clearOverlay, measure, trackPointer } from './measure';
import { initAem } from '../../../../src/aem/aem.js';
import { linkPages } from './page-links';
import type { ComponentEntry, RenderedStory } from '../model';
import { buildRegistry } from '../registry';
import { StoryHostComponent } from '../story-host.component';
import type { FrameMessage, InspectMessage, RenderMessage } from './frame-protocol';

const PRESETS = { estudiantes: PrimeOneEstudiantes, prodi: PrimeOneProdi, foundations: PrimeOneFoundations };

type Outgoing = FrameMessage extends infer M ? (M extends unknown ? Omit<M, 'source'> : never) : never;

function post(message: Outgoing): void {
  window.parent.postMessage({ source: 'po-frame', ...message }, location.origin);
}

/**
 * Root of the preview iframe: renders only the story that the explorer asks for, with the real
 * viewport width, and reports its height and the story events back to the explorer.
 */
@Component({
  selector: 'po-root',
  imports: [StoryHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'po-frame',
    '[class.po-frame--padded]': "layout() === 'padded'",
    '[class.po-frame--centered]': "layout() === 'centered'",
    '[class.po-frame--measuring]': 'measuring()',
  },
  template: `
    @if (story(); as story) {
      <po-story-host [story]="story" />
    }
  `,
  styles: `
    :host { display: block; min-width: 0; }
    :host(.po-frame--padded), :host(.po-frame--centered) { padding: 24px; }
    :host(.po-frame--centered) { display: flex; align-items: center; justify-content: center; }
    @media (max-width: 599px) {
      :host(.po-frame--padded), :host(.po-frame--centered) { padding: 16px; }
    }
    /* Room for the measures drawn outside the component: widths above, per-child lanes to the right and below */
    :host(.po-frame--measuring) { padding: 40px 200px 96px 24px; }
    @media (max-width: 599px) {
      :host(.po-frame--measuring) { padding: 40px 160px 96px 16px; }
    }
  `,
})
export class FrameRootComponent {
  private readonly entries = buildRegistry();
  private readonly request = signal<RenderMessage | null>(null);
  private readonly entry = computed<ComponentEntry | undefined>(() => {
    const request = this.request();
    return request ? this.entries.find((entry) => entry.id === request.id) : undefined;
  });
  private readonly handlers = computed(() =>
    Object.fromEntries(
      (this.entry()?.events ?? []).map((event) => [event.name, (payload: unknown) => post({ type: 'event', name: event.name, payload: describe(payload) })]),
    ),
  );

  protected readonly layout = computed(() => this.entry()?.layout ?? 'padded');
  /** Medidas tab open: the frame leaves room around the component for the measures. */
  protected readonly measuring = signal(false);
  protected readonly story = computed<RenderedStory | null>(() => {
    const request = this.request();
    const entry = this.entry();
    return request && entry ? entry.render(request.args, this.handlers()) : null;
  });

  private tokensTimer?: ReturnType<typeof setTimeout>;
  private measureTimer?: ReturnType<typeof setTimeout>;
  private lastMeasure = '';
  private inspect: InspectMessage | null = null;
  private lastTokens = '';

  constructor() {
    const destroyRef = inject(DestroyRef);
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== window.parent) return;
      const data = event.data as RenderMessage | InspectMessage | undefined;
      if (data?.source !== 'po-explorer') return;
      if (data.type === 'render') this.request.set(data);
      else if (data.type === 'inspect') {
        this.inspect = data;
        this.measuring.set(data.enabled);
        this.scheduleMeasure();
      }
    };
    window.addEventListener('message', onMessage);
    destroyRef.onDestroy(() => window.removeEventListener('message', onMessage));

    // AEM page templates: a link to another template opens it in the explorer (new tab and modifiers keep the browser default)
    const onClick = (event: MouseEvent) => {
      // `<base href="/">` would send `#section` links to the explorer root: scroll to the section here instead
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = anchor?.getAttribute('href') ?? '';
      if (anchor && hash.length > 1 && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      const link = (event.target as Element | null)?.closest<HTMLElement>('[data-po-page]');
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      post({ type: 'navigate', id: link.dataset['poPage']! });
    };
    document.addEventListener('click', onClick);
    // Forms of the stories are not sent: a GET submit would replace `?frame=1` and load the whole explorer here
    const onSubmit = (event: SubmitEvent) => event.preventDefault();
    document.addEventListener('submit', onSubmit);
    destroyRef.onDestroy(() => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('submit', onSubmit);
    });

    effect(() => {
      const request = this.request();
      if (!request) return;
      usePreset(PRESETS[request.theme]);
      document.documentElement.classList.toggle('po-dark', request.scheme === 'dark');
      // AEM Portales: its own dark mode (semantic tokens on their inverse values)
      document.documentElement.classList.toggle('aem-dark', request.scheme === 'dark' && this.entry()?.ds === 'aem');
      // Pages scroll inside the frame (the explorer gives them the height of the stage)
      document.documentElement.classList.toggle('po-frame-scroll', this.entry()?.category === 'aem-pages');
      this.scheduleTokens();
      this.scheduleMeasure();
    });

    afterNextRender(() => {
      let last = -1;
      let scheduled = false;
      // Height of the document, overlays appended to <body> included, so the explorer sizes the iframe
      const report = () => {
        scheduled = false;
        const height = Math.ceil(document.documentElement.scrollHeight);
        if (height !== last) {
          last = height;
          post({ type: 'size', height });
        }
      };
      const schedule = () => {
        if (!scheduled) {
          scheduled = true;
          requestAnimationFrame(report);
        }
      };
      const resize = new ResizeObserver(schedule);
      resize.observe(document.body);
      // Changes of the measure overlay itself do not count (it would redraw forever)
      const mutations = new MutationObserver((records) => {
        const own = (node: Node) => node instanceof Element && (node.id === 'po-measure-overlay' || !!node.closest('#po-measure-overlay'));
        if (records.every((r) => own(r.target) || [...Array.from(r.addedNodes), ...Array.from(r.removedNodes)].some(own))) return;
        // AEM Portales components get their behaviour (each one initialises once)
        if (this.entry()?.ds === 'aem') initAem(document);
        if (this.entry()?.category === 'aem-pages') linkPages(document, this.entry()!.id);
        schedule();
        this.scheduleTokens();
        this.scheduleMeasure();
      });
      mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
      destroyRef.onDestroy(() => {
        resize.disconnect();
        mutations.disconnect();
        clearTimeout(this.tokensTimer);
        clearTimeout(this.measureTimer);
      });
      addEventListener('resize', () => this.scheduleMeasure());
      post({ type: 'ready' });
    });
  }

  /** Tokens in use, once the render (overlays and theme included) has settled; only sent when they change. */
  private scheduleTokens(): void {
    clearTimeout(this.tokensTimer);
    this.tokensTimer = setTimeout(() => {
      const tokens = collectTokens();
      const key = JSON.stringify(tokens);
      if (key === this.lastTokens) return;
      this.lastTokens = key;
      post({ type: 'tokens', tokens });
    }, 400);
  }

  /** Measures (and draws the overlay) while the Medidas tab is open; only sends the data when it changes. */
  private scheduleMeasure(): void {
    clearTimeout(this.measureTimer);
    this.measureTimer = setTimeout(() => {
      const inspect = this.inspect;
      trackPointer(!!inspect?.enabled);
      if (!inspect?.enabled) {
        clearOverlay();
        this.lastMeasure = '';
        return;
      }
      const data = measure(inspect.index, inspect.hover, true);
      const key = JSON.stringify(data);
      if (key === this.lastMeasure) return;
      this.lastMeasure = key;
      post({ type: 'measure', data });
    }, 120);
  }
}
