/** Shared model of the explorer. Entries are built from the stories by `registry.ts`. */

export type ControlKind = 'boolean' | 'text' | 'number' | 'select' | 'inline-radio' | 'color';

export interface ControlDef {
  name: string;
  kind: ControlKind;
  /** Values for select and inline-radio; `undefined` means "component default". */
  options?: unknown[];
  /** Bounds of a number control, from `control: { type: 'number', min, max }`. */
  min?: number;
  max?: number;
  description?: string;
  /** Default documented by the component, if any. */
  defaultSummary?: string;
  /** Value in the story's base args (may be undefined). */
  initial: unknown;
}

export interface EventDef {
  name: string;
  description?: string;
}

export interface PresetDef {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface RenderedStory {
  template: string;
  props: Record<string, unknown>;
  imports: unknown[];
  providers: unknown[];
}

export type LayoutKind = 'padded' | 'fullscreen' | 'centered';

export interface ComponentEntry {
  /** URL-safe id, e.g. `form-select`. */
  id: string;
  /** Design system the component belongs to (`AEM/...` story titles are AEM). */
  ds: DesignSystemId;
  /** Source files shown in the code panel for HTML/CSS/JS design systems (AEM). */
  sources?: { css?: string; js?: string };
  title: string;
  category: CategoryId;
  description?: string;
  figmaUrl?: string;
  /** `import { ... } from '...';` lines a consumer needs, taken from the story source. */
  codeImports: string[];
  layout: LayoutKind;
  /** Suggested minimum height of the stage, from the story parameters. */
  height?: string;
  /** Position in its section (`parameters.order`); entries without it go after, by title. */
  order?: number;
  controls: ControlDef[];
  events: EventDef[];
  /** `Default` first. */
  presets: PresetDef[];
  /** Story args without the event recorders. */
  baseArgs: Record<string, unknown>;
  imports: unknown[];
  providers: unknown[];
  /** Runs the story `render` with the given args; `handlers` are bound to the events. */
  render: (args: Record<string, unknown>, handlers: Record<string, (payload: unknown) => void>) => RenderedStory;
}

export type CategoryId =
  | 'Button'
  | 'Form'
  | 'Data'
  | 'Panel'
  | 'Overlay'
  | 'Menu'
  | 'Messages'
  | 'Media'
  | 'Misc'
  | 'Proeduca'
  | 'aem-buttons'
  | 'aem-inputs'
  | 'aem-status'
  | 'aem-messaging'
  | 'aem-content'
  | 'aem-navigation'
  | 'aem-modules'
  | 'aem-pages';

export type DesignSystemId = 'prime-one' | 'aem';

export interface DesignSystemDef {
  id: DesignSystemId;
  /** Short name for the switcher. */
  name: string;
  /** Technology of the components, for the home. */
  stack: string;
  description: string;
  figmaUrl: string;
  /** PrimeNG themes (Estudiantes, Prodi, Foundations) and dark mode apply. */
  themed: boolean;
}

export const DESIGN_SYSTEMS: DesignSystemDef[] = [
  {
    id: 'prime-one',
    name: 'PrimeOne',
    stack: 'Angular · PrimeNG 21',
    description:
      'Componentes Angular sobre PrimeNG 21 con los temas de Proeduca, conectados a Figma con Code Connect. Un único lenguaje visual para Estudiantes, Prodi y Foundations, en claro y oscuro.',
    figmaUrl: 'https://www.figma.com/design/lWpcnToQVkqEqFifm67QaG/Design-system---PrimeOne',
    themed: true,
  },
  {
    id: 'aem',
    name: 'AEM Portales',
    stack: 'HTML · CSS · JS',
    description:
      'Componentes y módulos de los portales en Adobe Experience Manager: HTML con clases BEM, CSS con los tokens de Figma y JavaScript sin dependencias, listos para llevar a los componentes de AEM.',
    figmaUrl: 'https://www.figma.com/design/hT9BgF8wE5lXM54ldUcy9H/Design-System---AEM-Portales',
    themed: false,
  },
];

export interface CategoryDef {
  id: CategoryId;
  ds: DesignSystemId;
  /** Second segment of the story title for AEM (`AEM/Buttons/Button`), the first one otherwise. */
  key: string;
  label: string;
  /** Phosphor icon class, e.g. `ph ph-textbox`. */
  icon: string;
  /** One line for the home and the section page. */
  description: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'Button', ds: 'prime-one', key: 'Button', label: 'Botones', icon: 'ph ph-cursor-click', description: 'Acciones principales y secundarias: botones, split buttons y speed dial.' },
  { id: 'Form', ds: 'prime-one', key: 'Form', label: 'Formulario', icon: 'ph ph-textbox', description: 'Campos de entrada, selección y etiquetas para construir formularios.' },
  { id: 'Data', ds: 'prime-one', key: 'Data', label: 'Datos', icon: 'ph ph-table', description: 'Tablas, listas, árboles y paginación para mostrar y ordenar información.' },
  { id: 'Panel', ds: 'prime-one', key: 'Panel', label: 'Paneles', icon: 'ph ph-layout', description: 'Contenedores y estructura: cards, pestañas, acordeones y separadores.' },
  { id: 'Overlay', ds: 'prime-one', key: 'Overlay', label: 'Superposición', icon: 'ph ph-stack', description: 'Capas sobre el contenido: diálogos, drawers, popovers y confirmaciones.' },
  { id: 'Menu', ds: 'prime-one', key: 'Menu', label: 'Menús', icon: 'ph ph-list', description: 'Navegación: breadcrumb, menubar, menú contextual, mega menú y dock.' },
  { id: 'Messages', ds: 'prime-one', key: 'Messages', label: 'Mensajes', icon: 'ph ph-chat-circle-dots', description: 'Mensajes en línea y notificaciones toast por nivel de gravedad.' },
  { id: 'Media', ds: 'prime-one', key: 'Media', label: 'Media', icon: 'ph ph-image', description: 'Imágenes, galerías, carruseles y comparadores de imágenes.' },
  { id: 'Misc', ds: 'prime-one', key: 'Misc', label: 'Varios', icon: 'ph ph-puzzle-piece', description: 'Avatares, badges, chips, tags, indicadores de progreso y utilidades.' },
  { id: 'Proeduca', ds: 'prime-one', key: 'Proeduca', label: 'Proeduca', icon: 'ph ph-graduation-cap', description: 'Patrones propios de Proeduca: chat IA, agenda, tareas, navegación móvil y campos.' },
  { id: 'aem-buttons', ds: 'aem', key: 'Buttons', label: 'Botones', icon: 'ph ph-cursor-click', description: 'Botones, botón de descarga y botón flotante (FAB).' },
  { id: 'aem-inputs', ds: 'aem', key: 'Inputs', label: 'Entradas y selección', icon: 'ph ph-textbox', description: 'Campos de texto, búsqueda, desplegables, filtros, chips, casillas, radios, toggles y sliders.' },
  { id: 'aem-status', ds: 'aem', key: 'Status', label: 'Indicadores y estado', icon: 'ph ph-spinner-gap', description: 'Indicadores de carga y etiquetas de estado.' },
  { id: 'aem-messaging', ds: 'aem', key: 'Messaging', label: 'Mensajes', icon: 'ph ph-chat-circle-dots', description: 'Notificaciones y ticker de avisos.' },
  { id: 'aem-content', ds: 'aem', key: 'Content', label: 'Contenido', icon: 'ph ph-cards', description: 'Acordeones, avatares, cards, tablas y listas.' },
  { id: 'aem-navigation', ds: 'aem', key: 'Navigation', label: 'Navegación', icon: 'ph ph-compass', description: 'Menú de anclas, breadcrumb, paginación y pestañas.' },
  { id: 'aem-modules', ds: 'aem', key: 'Modules', label: 'Módulos', icon: 'ph ph-squares-four', description: 'Bloques de página: hero, banners, formularios, testimonios, cabecera y pie.' },
  { id: 'aem-pages', ds: 'aem', key: 'Pages', label: 'Páginas', icon: 'ph ph-browsers', description: 'Plantillas de página del portal y de las landings montadas con los módulos, en sus breakpoints.' },
];

/** What the stage shows: the home, the overview of a section or the selected component. */
export type ExplorerView = { kind: 'portal' } | { kind: 'home' } | { kind: 'foundations' } | { kind: 'section'; id: CategoryId } | { kind: 'component' };

export interface CategoryGroup extends CategoryDef {
  entries: ComponentEntry[];
}

/** Design token used by the rendered component: Figma-style name, CSS variable and resolved value. */
export interface TokenRecord {
  name: string;
  cssVar: string;
  value: string;
}

/** Element of the rendered component that can be measured. */
export interface MeasureElement {
  index: number;
  label: string;
  depth: number;
}

/** Box model and layout of the measured element, in px. Sides are [top, right, bottom, left]. */
export interface BoxMeasure {
  label: string;
  width: number;
  height: number;
  content: [number, number];
  padding: number[];
  border: number[];
  margin: number[];
  /** [top-left, top-right, bottom-right, bottom-left]. */
  radius: number[];
  boxSizing: string;
  display: string;
  direction: string;
  gap: [number, number];
  font: { family: string; size: number; lineHeight: string; weight: string };
  children: number;
}

export interface MeasureData {
  elements: MeasureElement[];
  selected: number;
  box: BoxMeasure | null;
}

export interface EventRecord {
  id: number;
  name: string;
  /** Epoch ms. */
  time: number;
  /** Short, safe description of the payload. */
  payload: string;
}

export type ThemeId = 'estudiantes' | 'prodi' | 'foundations';
export type SchemeId = 'light' | 'dark';
export type ViewportId = 'auto' | 'mobile' | 'tablet';

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: 'estudiantes', label: 'Estudiantes' },
  { id: 'prodi', label: 'Prodi' },
  { id: 'foundations', label: 'Foundations' },
];

/** Breakpoints of the AEM page templates (Figma frames Desktop 1920, Desktop 1280, Tablet 768 and Mobile 375). */
export const PAGE_BREAKPOINTS: { width: number; label: string; icon: string }[] = [
  { width: 1920, label: 'Escritorio 1920', icon: 'ph ph-monitor' },
  { width: 1280, label: 'Escritorio 1280', icon: 'ph ph-desktop' },
  { width: 768, label: 'Tablet 768', icon: 'ph ph-device-tablet' },
  { width: 375, label: 'Móvil 375', icon: 'ph ph-device-mobile' },
];

export const VIEWPORTS: { id: ViewportId; label: string; icon: string; width?: number }[] = [
  { id: 'auto', label: 'Escritorio', icon: 'ph ph-desktop' },
  { id: 'tablet', label: 'Tablet', icon: 'ph ph-device-tablet', width: 768 },
  { id: 'mobile', label: 'Móvil', icon: 'ph ph-device-mobile', width: 390 },
];
