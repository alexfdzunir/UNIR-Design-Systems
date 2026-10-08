import type { ArgType, Meta, StoryObj } from '../shims/storybook-angular';
import { groupControls, repeatsAppearance } from './controls/control-groups';
import { CATEGORIES, type ComponentEntry, type ControlDef, type ControlKind, type EventDef, type PresetDef } from './model';
import { STORY_MODULES } from './stories-index';

const KINDS: ControlKind[] = ['boolean', 'text', 'number', 'select', 'inline-radio', 'color'];
const CATEGORY_ORDER = CATEGORIES.map((c) => c.id);
const AEM_PREFIX = 'AEM';

function slug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** `IconOnly` -> `Icon only`. */
function humanize(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

function controlKind(argType: ArgType): ControlKind | undefined {
  const control = typeof argType.control === 'string' ? argType.control : argType.control?.type;
  return KINDS.includes(control as ControlKind) ? (control as ControlKind) : undefined;
}

function toEntry(mod: Record<string, unknown>, figmaUrl: string | undefined, codeImports: string[], sources?: ComponentEntry['sources']): ComponentEntry {
  const meta = mod['default'] as Meta;
  // `AEM/<section>/<name>` for AEM Portales, `<section>/<name>` for PrimeOne
  const segments = meta.title.split('/');
  const ds = segments[0] === AEM_PREFIX ? 'aem' : 'prime-one';
  const [category, ...rest] = ds === 'aem' ? segments.slice(1) : segments;
  const title = rest.join('/') || category;
  const categoryDef = CATEGORIES.find((c) => c.ds === ds && c.key === category) ?? CATEGORIES.find((c) => c.ds === ds && c.key === 'Misc');
  const argTypes = meta.argTypes ?? {};

  const controls: ControlDef[] = [];
  const events: EventDef[] = [];
  for (const [name, argType] of Object.entries(argTypes)) {
    const kind = controlKind(argType);
    if (kind) {
      controls.push({
        name,
        kind,
        options: argType.options,
        description: argType.description,
        defaultSummary: argType.table?.defaultValue?.summary,
        initial: meta.args?.[name],
      });
    } else if (argType.action) {
      events.push({ name, description: argType.description });
    }
  }
  const eventNames = new Set(events.map((e) => e.name));
  const baseArgs = Object.fromEntries(Object.entries(meta.args ?? {}).filter(([name]) => !eventNames.has(name)));

  const presets: PresetDef[] = Object.entries(mod)
    .filter(([key, value]) => key !== 'default' && value !== null && typeof value === 'object')
    .map(([key, value]) => ({ id: key, name: (value as StoryObj).name ?? (key === 'Default' ? 'Por defecto' : humanize(key)), args: (value as StoryObj).args ?? {} }))
    .sort((a, b) => {
      // Story order from the generator; module namespaces only expose exports alphabetically
      const order: string[] = meta.parameters?.['storyOrder'] ?? [];
      const rank = (id: string) => (id === 'Default' ? -1 : order.includes(id) ? order.indexOf(id) : order.length);
      return rank(a.id) - rank(b.id) || a.name.localeCompare(b.name, 'es');
    });

  const decorators = meta.decorators ?? [];
  const imports = decorators.flatMap((d) => d.moduleMetadata?.imports ?? []);
  const providers = decorators.flatMap((d) => d.moduleMetadata?.providers ?? []);
  const docs = meta.parameters?.['docs'];

  const entry: ComponentEntry = {
    id: slug(meta.title),
    ds,
    sources,
    title,
    category: categoryDef?.id ?? CATEGORIES.filter((c) => c.ds === ds).at(-1)!.id,
    description: docs?.description?.component,
    // A story's own `parameters.figmaUrl` wins (AEM stories set it, and a folder can hold several modules);
    // otherwise the Code Connect template of the folder (`*.figma.ts`), as PrimeOne
    figmaUrl: meta.parameters?.['figmaUrl'] ?? figmaUrl,
    codeImports,
    layout: meta.parameters?.['layout'] ?? 'padded',
    height: docs?.story?.height,
    order: meta.parameters?.['order'],
    controls,
    events,
    presets,
    baseArgs,
    imports,
    providers,
    render: (args, handlers) => {
      const result = meta.render({ ...baseArgs, ...args, ...handlers });
      return { template: result.template ?? '', props: result.props ?? {}, imports, providers };
    },
  };
  // Ejemplos only keeps what the Apariencia choices cannot show from Default or from another kept example. The
  // simplest examples are weighed first, so the combination is the one left out (Right = NoActions + orientation).
  const groups = groupControls(entry);
  const kept = new Set<PresetDef>();
  for (const preset of [...presets].sort((a, b) => Object.keys(a.args).length - Object.keys(b.args).length)) {
    if (preset.id === 'Default' || ![...kept].some((from) => repeatsAppearance(entry, preset, from, groups))) kept.add(preset);
  }
  entry.presets = presets.filter((preset) => kept.has(preset));
  return entry;
}

/** All components of the DS, in catalogue order. */
export function buildRegistry(): ComponentEntry[] {
  return STORY_MODULES.map(({ module, figmaUrl, imports, sources }) => toEntry(module as Record<string, unknown>, figmaUrl, imports, sources)).sort(
    (a, b) =>
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
      (a.order ?? Infinity) - (b.order ?? Infinity) ||
      a.title.localeCompare(b.title, 'es'),
  );
}
