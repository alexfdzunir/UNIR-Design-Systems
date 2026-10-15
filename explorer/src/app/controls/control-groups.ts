import type { ComponentEntry, ControlDef, PresetDef } from '../model';
import { PRIMENG_DEFAULTS } from './primeng-defaults';

/**
 * Sorts the controls of a story into the sections of the control panel: appearance (visual enums as
 * segmented choices), elements (parts that can be shown or hidden), state (flags such as disabled or
 * loading), content (texts and key numbers) and advanced (everything else).
 */

export interface ChoiceOption {
  label: string;
  /** Args set when the option is chosen; `undefined` leaves the component default. */
  args: Record<string, unknown>;
  icon?: string;
  /** CSS colour of the swatch shown before the label (severities). */
  swatch?: string;
  /** Shown only while each of these args (or its fallback) has one of the values. */
  when?: Record<string, unknown[]>;
}

export interface ChoiceField {
  /** Main arg of the field. */
  name: string;
  label: string;
  description?: string;
  options: ChoiceOption[];
  /** Effective value of each arg while it is unset. */
  fallbacks: Record<string, unknown>;
}

export interface NamedControl {
  control: ControlDef;
  label: string;
}

export interface ControlGroups {
  appearance: ChoiceField[];
  elements: NamedControl[];
  state: NamedControl[];
  content: NamedControl[];
  advanced: ControlDef[];
}

/** Visual enums in display order, with their label. Only the first size-like arg is used. */
const APPEARANCE: [name: string, label: string][] = [
  ['type', 'Tipo'],
  ['variant', 'Variante'],
  ['severity', 'Color'],
  ['size', 'Tamaño'],
  ['pSize', 'Tamaño'],
  ['badgeSize', 'Tamaño'],
  ['spinnerSize', 'Tamaño'],
  ['shape', 'Forma'],
  ['pattern', 'Composición'],
  ['background', 'Fondo'],
  ['layout', 'Disposición'],
  ['orientation', 'Orientación'],
  ['position', 'Posición'],
  ['direction', 'Dirección'],
  ['view', 'Vista'],
  ['mode', 'Modo'],
  ['state', 'Estado'],
  ['role', 'Rol'],
  ['priority', 'Prioridad'],
  ['taskType', 'Tipo de tarea'],
  ['display', 'Visualización'],
  ['stepCount', 'Pasos'],
  ['active', 'Pestaña activa'],
  ['iconPos', 'Posición del icono'],
  ['iconPosition', 'Posición del icono'],
  ['align', 'Alineación'],
  ['tagSeverity', 'Color del tag'],
  ['thumbnailsPosition', 'Posición de miniaturas'],
  ['indicatorsPosition', 'Posición de indicadores'],
  ['paginatorPosition', 'Posición del paginador'],
  ['controlsPosition', 'Posición de controles'],
  ['labelPosition', 'Posición de etiquetas'],
  ['labelOrientation', 'Orientación de etiquetas'],
  ['tooltipPosition', 'Posición'],
];

const SIZES = new Set(['size', 'pSize', 'badgeSize', 'spinnerSize']);

/** Booleans shown as a two-way choice: `small` when there is no size enum, `mobile` always. */
const BOOLEAN_CHOICES: Record<string, { label: string; options: [value: boolean, label: string, icon?: string][] }> = {
  small: { label: 'Tamaño', options: [[true, 'S'], [false, 'M']] },
  mobile: {
    label: 'Dispositivo',
    options: [
      [false, 'Escritorio', 'ph ph-desktop'],
      [true, 'Móvil', 'ph ph-device-mobile'],
    ],
  },
};

/* Value labels. The key order is the display order. */

const SIZE_LABELS = { s: 'S', small: 'S', m: 'M', normal: 'M', medium: 'M', large: 'L', xlarge: 'XL' };

/** Avatar sizes of the DS: PrimeNG normal, large and xlarge are S, M and L (see the S and L stories). */
const AVATAR_SIZES = { normal: 'S', large: 'M', xlarge: 'L' };

const SEVERITY_LABELS = {
  primary: 'Primario',
  secondary: 'Secundario',
  success: 'Éxito',
  info: 'Info',
  warn: 'Aviso',
  warning: 'Aviso',
  danger: 'Peligro',
  error: 'Error',
  help: 'Ayuda',
  contrast: 'Contraste',
};

/**
 * Options that PrimeNG only honours with some value of another arg. Timeline and Divider align along
 * their layout; SpeedDial takes the diagonals in a quarter circle, the rest in a line or a semicircle
 * and no direction in a full circle.
 */
const DEPENDENT_OPTIONS: Record<string, Record<string, Record<string, Record<string, unknown[]>>>> = {
  Timeline: {
    align: {
      left: { layout: ['vertical'] },
      right: { layout: ['vertical'] },
      top: { layout: ['horizontal'] },
      bottom: { layout: ['horizontal'] },
    },
  },
  Divider: {
    align: {
      left: { layout: ['horizontal'] },
      right: { layout: ['horizontal'] },
      top: { layout: ['vertical'] },
      bottom: { layout: ['vertical'] },
    },
  },
  SpeedDial: {
    direction: Object.fromEntries(
      ['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right'].map((direction) => [
        direction,
        { type: direction.includes('-') ? ['quarter-circle'] : ['linear', 'semi-circle'] },
      ]),
    ),
  },
};

const POSITION_LABELS = {
  top: 'Arriba',
  up: 'Arriba',
  bottom: 'Abajo',
  down: 'Abajo',
  left: 'Izquierda',
  start: 'Inicio',
  center: 'Centro',
  right: 'Derecha',
  end: 'Fin',
  topleft: 'Arriba izquierda',
  'top-left': 'Arriba izquierda',
  'up-left': 'Arriba izquierda',
  'top-center': 'Arriba centro',
  topright: 'Arriba derecha',
  'top-right': 'Arriba derecha',
  'up-right': 'Arriba derecha',
  bottomleft: 'Abajo izquierda',
  'bottom-left': 'Abajo izquierda',
  'down-left': 'Abajo izquierda',
  'bottom-center': 'Abajo centro',
  bottomright: 'Abajo derecha',
  'bottom-right': 'Abajo derecha',
  'down-right': 'Abajo derecha',
  full: 'Completo',
  both: 'Ambos',
  alternate: 'Alterna',
  horizontal: 'Horizontal',
  vertical: 'Vertical',
};

const VALUE_LABELS: Record<string, Record<string, string>> = {
  size: SIZE_LABELS,
  pSize: SIZE_LABELS,
  badgeSize: SIZE_LABELS,
  spinnerSize: { '16px': 'XS', '24px': 'S', '32px': 'M', '42px': 'L', '64px': 'XL' },
  severity: SEVERITY_LABELS,
  tagSeverity: SEVERITY_LABELS,
  variant: { outlined: 'Contorno', filled: 'Relleno', text: 'Texto', simple: 'Simple', over: 'Encima', in: 'Dentro', on: 'En el borde' },
  type: {
    default: 'Por defecto',
    expandable: 'Expandible',
    product: 'Producto',
    horizontal: 'Horizontal',
    'horizontal-full': 'Horizontal completa',
    linear: 'Lineal',
    circle: 'Círculo',
    'semi-circle': 'Semicírculo',
    'quarter-circle': 'Cuarto de círculo',
    pending: 'Pendientes',
    completed: 'Completadas',
    overdue: 'Vencidas',
    multiple: 'Múltiple',
    single: 'Única',
    text: 'Texto',
    paginator: 'Paginador',
    editor: 'Editor',
    solid: 'Continua',
    dashed: 'Discontinua',
    dotted: 'Punteada',
  },
  shape: { circle: 'Círculo', square: 'Cuadrado', rectangle: 'Rectángulo' },
  pattern: { single: 'Simple', text: 'Texto', start: 'Avatar al inicio', end: 'Avatar al final' },
  background: { white: 'Blanco', grey: 'Gris' },
  layout: { list: 'Lista', grid: 'Cuadrícula', horizontal: 'Horizontal', vertical: 'Vertical' },
  mode: { advanced: 'Avanzado', basic: 'Básico', determinate: 'Determinado', indeterminate: 'Indeterminado' },
  view: {
    date: 'Fecha',
    day: 'Día',
    'three-days': '3 días',
    week: 'Semana',
    'academic-week': 'Semana lectiva',
    month: 'Mes',
    year: 'Año',
    agenda: 'Agenda',
  },
  state: { default: 'Por defecto', unanswered: 'Sin contestar', success: 'Correcta', error: 'Incorrecta', corrected: 'Corregida' },
  role: { student: 'Estudiante', teacher: 'Docente' },
  priority: { high: 'Alta', mid: 'Media', low: 'Baja' },
  taskType: { academic: 'Académica', deliveries: 'Entregas', personal: 'Personal', management: 'Gestión' },
  display: { comma: 'Comas', chip: 'Chips' },
  active: { home: 'Inicio', subjects: 'Asignaturas', chat: 'Chat', profile: 'Perfil' },
};

/** Value labels that depend on the component. */
const TITLE_VALUE_LABELS: Record<string, Record<string, Record<string, string>>> = {
  Avatar: { size: AVATAR_SIZES },
  AvatarGroup: { size: AVATAR_SIZES },
};

const ARROWS: Record<string, string> = {
  top: 'ph ph-arrow-up',
  up: 'ph ph-arrow-up',
  bottom: 'ph ph-arrow-down',
  down: 'ph ph-arrow-down',
  left: 'ph ph-arrow-left',
  start: 'ph ph-arrow-left',
  center: 'ph ph-arrows-in-simple',
  right: 'ph ph-arrow-right',
  end: 'ph ph-arrow-right',
  topleft: 'ph ph-arrow-up-left',
  'top-left': 'ph ph-arrow-up-left',
  'up-left': 'ph ph-arrow-up-left',
  'top-center': 'ph ph-arrow-up',
  topright: 'ph ph-arrow-up-right',
  'top-right': 'ph ph-arrow-up-right',
  'up-right': 'ph ph-arrow-up-right',
  bottomleft: 'ph ph-arrow-down-left',
  'bottom-left': 'ph ph-arrow-down-left',
  'down-left': 'ph ph-arrow-down-left',
  'bottom-center': 'ph ph-arrow-down',
  bottomright: 'ph ph-arrow-down-right',
  'bottom-right': 'ph ph-arrow-down-right',
  'down-right': 'ph ph-arrow-down-right',
  full: 'ph ph-arrows-out',
  both: 'ph ph-arrows-down-up',
};

const SWATCHES: Record<string, string> = {
  primary: 'var(--p-primary-color)',
  secondary: 'var(--p-surface-400, #94a3b8)',
  success: 'var(--p-green-500, #22c55e)',
  info: 'var(--p-sky-500, #0ea5e9)',
  warn: 'var(--p-orange-500, #f97316)',
  warning: 'var(--p-orange-500, #f97316)',
  danger: 'var(--p-red-500, #ef4444)',
  error: 'var(--p-red-500, #ef4444)',
  help: 'var(--p-purple-500, #a855f7)',
  contrast: 'var(--p-text-color)',
};

/** Parts that can be shown or hidden, besides every `show*` and `*Visible`. */
const ELEMENTS = new Set([
  'closable',
  'removable',
  'dismissable',
  'dismissible',
  'toggleable',
  'collapsible',
  'filter',
  'checkmark',
  'checkbox',
  'paginator',
  'mask',
  'modal',
  'preview',
  'dropdown',
  'feedback',
  'toggleMask',
  'maximizable',
  'popup',
  'inline',
  'stripedRows',
  'striped',
  'photo',
  'dividers',
  'floatLabel',
  'withAttachment',
  'legalCheck',
  'marketingCheck',
  'grouped',
  'prefixIcon',
  'suffixIcon',
  'iconOnly',
  'suggestions',
  'bar',
  'shadow',
  'group',
]);

const STATE = new Set([
  'disabled',
  'invalid',
  'readonly',
  'loading',
  'raised',
  'rounded',
  'plain',
  'outlined',
  'text',
  'link',
  'fluid',
  'interactive',
  'expanded',
  'collapsed',
  'overlayVisible',
  'fullScreen',
  'contrast',
  'dark',
  'narrow',
  'active',
  'selected',
  'completed',
  'empty',
  'busy',
  'recording',
  'transcribing',
  'blocked',
  'indeterminate',
  'badgeDisabled',
  'multiple',
  'range',
  'linear',
  'circular',
  'autoPlay',
  'autoResize',
  'scrollable',
  'rowHover',
  'dragdrop',
  'draggable',
  'resizable',
  'sticky',
  'danger',
  'checked',
  'compact',
  'single',
]);

/** Names of the boolean args (elements and state). */
const FLAG_NAMES: Record<string, string> = {
  showSubtext: 'Tipo de archivo',
  showSupporting: 'Texto de ayuda',
  showCategory: 'Categoría',
  showState: 'Estado',
  showPlay: 'Botón de vídeo',
  checked: 'Marcado',
  group: 'Grupo',
  compact: 'Compacto',
  suggestions: 'Sugerencias',
  single: 'Uno abierto',
  bar: 'A todo el ancho',
  shadow: 'Sombra',
  prefixIcon: 'Icono delante',
  suffixIcon: 'Icono detrás',
  iconOnly: 'Solo icono',
  danger: 'Peligro',
  showClear: 'Botón limpiar',
  showHeader: 'Cabecera',
  showFooter: 'Pie',
  showIcon: 'Icono',
  showIconLeft: 'Icono izquierdo',
  showIconRight: 'Icono derecho',
  showTitle: 'Título',
  showSubtitle: 'Subtítulo',
  showTag: 'Tag',
  showImage: 'Imagen',
  showContent: 'Contenido',
  showText: 'Texto',
  showBullets: 'Viñetas',
  showNumber: 'Métrica',
  showTagsRow: 'Fila de etiquetas',
  showItems: 'Items',
  showSlot: 'Contenido libre',
  showCaption: 'Fechas',
  showAuthor: 'Autor',
  showLink: 'Enlace',
  showButton: 'Botón',
  showLabel: 'Etiqueta',
  showLabels: 'Etiquetas',
  showPaginator: 'Paginador',
  showAvatar: 'Avatar',
  showCurrentPageReport: 'Resumen de página',
  showFirstLastIcon: 'Primera y última',
  showPageLinks: 'Números de página',
  showJumpToPageDropdown: 'Salto con desplegable',
  showJumpToPageInput: 'Salto con campo',
  showIndicators: 'Indicadores',
  showNavigators: 'Flechas',
  showThumbnails: 'Miniaturas',
  showItemNavigators: 'Flechas',
  showThumbnailNavigators: 'Flechas de miniaturas',
  showItemNavigatorsOnHover: 'Flechas al pasar',
  showIndicatorsOnItem: 'Indicadores sobre imagen',
  showLoader: 'Indicador de carga',
  showToggleAll: 'Seleccionar todo',
  showTime: 'Hora',
  showSeconds: 'Segundos',
  showWeek: 'Número de semana',
  showButtonBar: 'Barra de botones',
  showOtherMonths: 'Otros meses',
  showOnFocus: 'Abrir al enfocar',
  showValue: 'Valor',
  showUploadButton: 'Botón subir',
  showCancelButton: 'Botón cancelar',
  showButtons: 'Botones',
  showEmptyMessage: 'Mensaje vacío',
  showGridlines: 'Líneas de tabla',
  showInitialSortBadge: 'Insignia de orden',
  showSourceFilter: 'Filtro de origen',
  showTargetFilter: 'Filtro de destino',
  showSourceControls: 'Controles de origen',
  showTargetControls: 'Controles de destino',
  showHandle: 'Tirador',
  showClose: 'Botón cerrar',
  showSearch: 'Buscador',
  showDate: 'Fecha',
  showType: 'Tipo',
  showLogout: 'Cerrar sesión',
  showLogo: 'Logo',
  showContact: 'Contacto',
  showOffer: 'Descuento',
  paddingTop: 'Margen superior',
  showToggle: 'Desplegable',
  showMenuButton: 'Botón de menú',
  showAttach: 'Adjuntar',
  showAudio: 'Audio',
  showActions: 'Acciones',
  showName: 'Nombre',
  showBack: 'Volver',
  showViewSelector: 'Selector de vista',
  acceptVisible: 'Botón aceptar',
  rejectVisible: 'Botón rechazar',
  closable: 'Botón cerrar',
  removable: 'Botón quitar',
  dismissable: 'Cerrar al pulsar fuera',
  dismissible: 'Cerrar al pulsar fuera',
  toggleable: 'Plegable',
  collapsible: 'Plegable',
  filter: 'Filtro',
  checkmark: 'Marca de selección',
  checkbox: 'Casillas',
  paginator: 'Paginador',
  mask: 'Máscara',
  modal: 'Modal',
  preview: 'Vista previa',
  dropdown: 'Desplegable',
  feedback: 'Indicador de fuerza',
  toggleMask: 'Ver contraseña',
  maximizable: 'Maximizar',
  popup: 'Emergente',
  inline: 'En línea',
  stripedRows: 'Filas alternas',
  striped: 'Filas alternas',
  photo: 'Foto',
  dividers: 'Separadores',
  floatLabel: 'Etiqueta flotante',
  withAttachment: 'Adjunto',
  legalCheck: 'Aceptación legal',
  marketingCheck: 'Aceptación comercial',
  grouped: 'Agrupado',
  disabled: 'Deshabilitado',
  invalid: 'Inválido',
  readonly: 'Solo lectura',
  loading: 'Cargando',
  raised: 'Elevado',
  rounded: 'Redondeado',
  plain: 'Plano',
  outlined: 'Contorno',
  text: 'Solo texto',
  link: 'Estilo enlace',
  fluid: 'Ancho completo',
  interactive: 'Interactivo',
  expanded: 'Expandido',
  collapsed: 'Plegado',
  overlayVisible: 'Desplegado',
  fullScreen: 'Pantalla completa',
  contrast: 'Contraste',
  dark: 'Fondo primario',
  narrow: 'Estrecho',
  active: 'Activo',
  selected: 'Seleccionado',
  completed: 'Completada',
  empty: 'Vacío',
  busy: 'Ocupado',
  recording: 'Grabando',
  transcribing: 'Transcribiendo',
  blocked: 'Bloqueado',
  indeterminate: 'Indeterminado',
  badgeDisabled: 'Deshabilitado',
  multiple: 'Selección múltiple',
  range: 'Rango',
  linear: 'Lineal',
  circular: 'Circular',
  autoPlay: 'Reproducción automática',
  autoResize: 'Altura automática',
  scrollable: 'Con scroll',
  rowHover: 'Resaltar al pasar',
  dragdrop: 'Arrastrar y soltar',
  draggable: 'Arrastrable',
  resizable: 'Redimensionable',
  sticky: 'Fija',
};

/** Text and number args that hold what the component shows (plus any visible `*Label` text). */
const CONTENT_NAMES: Record<string, string> = {
  label: 'Texto',
  header: 'Cabecera',
  heading: 'Título',
  title: 'Título',
  subtitle: 'Subtítulo',
  content: 'Contenido',
  text: 'Texto',
  message: 'Mensaje',
  summary: 'Resumen',
  detail: 'Detalle',
  legend: 'Leyenda',
  placeholder: 'Placeholder',
  value: 'Valor',
  tag: 'Tag',
  badge: 'Badge',
  avatar: 'Avatar',
  author: 'Autor',
  caption: 'Texto inferior',
  metric: 'Métrica',
  metricUnit: 'Unidad',
  statement: 'Enunciado',
  feedback: 'Explicación',
  feedbackTitle: 'Título de la explicación',
  time: 'Hora',
  name: 'Nombre',
  unit: 'Unidad',
  suffix: 'Sufijo',
  prefix: 'Prefijo',
  icon: 'Icono',
  iconRight: 'Icono derecho',
  actionIcon: 'Icono de acción',
  display: 'Texto visible',
  welcomeMessage: 'Bienvenida',
  prompt: 'Prompt',
  extra: 'Extra',
  recordingTime: 'Tiempo de grabación',
  imageAlt: 'Texto alternativo',
  alt: 'Texto alternativo',
  tooltip: 'Tooltip',
  acceptLabel: 'Botón aceptar',
  rejectLabel: 'Botón rechazar',
  cancelLabel: 'Botón cancelar',
  chooseLabel: 'Botón elegir',
  uploadLabel: 'Botón subir',
  primaryLabel: 'Botón principal',
  secondaryLabel: 'Botón secundario',
  actionLabel: 'Botón de acción',
  linkLabel: 'Enlace',
  labelCaption: 'Rótulo',
  logoutLabel: 'Texto de cerrar sesión',
  onLabel: 'Texto activado',
  offLabel: 'Texto desactivado',
  promptLabel: 'Texto de ayuda',
  weakLabel: 'Nivel débil',
  mediumLabel: 'Nivel medio',
  strongLabel: 'Nivel fuerte',
  prefixLabel: 'Prefijo',
  selectedItemsLabel: 'Texto de selección',
  rows: 'Filas por página',
  totalRecords: 'Total de registros',
  page: 'Página',
  pages: 'Páginas',
  totalPages: 'Total de páginas',
  words: 'Palabras',
  activeStep: 'Paso activo',
  number: 'Número',
  stars: 'Estrellas',
  numVisible: 'Visibles',
  numScroll: 'Desplazar',
  radius: 'Radio (px)',
  length: 'Longitud',
  size: 'Tamaño (px)',
  life: 'Duración (ms)',
  zoom: 'Zoom',
  steps: 'Pasos',
};

/** Names that depend on the component. */
const TITLE_NAMES: Record<string, Record<string, string>> = {
  Textarea: { rows: 'Filas' },
  Stepper: { value: 'Paso activo' },
  Accordion: { multiple: 'Varios abiertos' },
  PanelMenu: { multiple: 'Varios abiertos' },
};

function humanize(name: string): string {
  const spaced = name
    .replace(/[-_]/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Documented default as an arg value (`'false'` -> false, `'left'` -> 'left'). */
function parseDefault(control: ControlDef): unknown {
  const summary = control.defaultSummary?.trim().replace(/^['"]|['"]$/g, '');
  if (!summary || summary === 'undefined' || summary === 'null') return undefined;
  if (summary === 'true' || summary === 'false') return summary === 'true';
  return /^-?\d+(\.\d+)?$/.test(summary) ? Number(summary) : summary;
}

/** Value of an arg while unset: the default documented in the story, else the PrimeNG one. */
export function defaultValue(entry: ComponentEntry, control: ControlDef): unknown {
  return parseDefault(control) ?? PRIMENG_DEFAULTS[entry.title]?.[control.name];
}

function isElement(name: string): boolean {
  if (name === 'overlayVisible') return false;
  return /^show[A-Z]/.test(name) || /.Visible$/.test(name) || ELEMENTS.has(name);
}

function isContent(control: ControlDef): boolean {
  if (control.kind !== 'text' && control.kind !== 'number') return false;
  if (control.name in CONTENT_NAMES) return true;
  // Visible texts such as `acceptLabel`; accessibility and data keys stay in Avanzado
  return control.kind === 'text' && /Label$/.test(control.name) && !/^(aria|option|input)/.test(control.name);
}

function controlLabel(title: string, control: ControlDef): string {
  const names = control.kind === 'boolean' ? FLAG_NAMES : CONTENT_NAMES;
  return TITLE_NAMES[title]?.[control.name] ?? names[control.name] ?? humanize(control.name.replace(/^show(?=[A-Z])/, ''));
}

function enumField(entry: ComponentEntry, control: ControlDef, label: string): ChoiceField | null {
  if (control.kind !== 'inline-radio' && control.kind !== 'select') return null;
  const values = control.options ?? [];
  if (values.length < 2) return null;
  const { name } = control;
  const sized = SIZES.has(name);
  const severity = /severity/i.test(name);
  const labels =
    TITLE_VALUE_LABELS[entry.title]?.[name] ??
    VALUE_LABELS[name] ??
    (/position|direction|iconPos|orientation|align/i.test(name) ? POSITION_LABELS : undefined);
  const defaultLabel = sized ? 'M' : severity ? 'Primario' : 'Por defecto';
  const text = (value: unknown) => (value === undefined ? defaultLabel : (labels?.[String(value)] ?? humanize(String(value))));

  // Unset arg: the known default, or an explicit option equal to the anonymous default (Button `primary`)
  const documented = defaultValue(entry, control);
  const fallback =
    documented !== undefined && values.includes(documented)
      ? documented
      : values.includes(undefined)
        ? values.find((value) => value !== undefined && text(value) === defaultLabel)
        : undefined;
  const kept = fallback === undefined ? values : values.filter((value) => value !== undefined);

  const keys = Object.keys(labels ?? {});
  const rank = (value: unknown) => {
    if (value === undefined) return sized ? keys.indexOf('normal') : -1;
    const index = keys.indexOf(String(value));
    return index === -1 ? keys.length : index;
  };
  const arrows = /position|direction|iconPos|align/i.test(name) && kept.every((value) => value === undefined || ARROWS[String(value)]);
  const dependent = DEPENDENT_OPTIONS[entry.title]?.[name];
  const dependencies = new Set(Object.values(dependent ?? {}).flatMap((when) => Object.keys(when)));

  return {
    name,
    label,
    description: control.description,
    // Sorted as pairs: `Array.sort` always moves `undefined` values to the end
    options: kept
      .map((value) => ({ value, rank: rank(value) }))
      .sort((a, b) => a.rank - b.rank)
      .map(({ value }) => ({
        label: text(value),
        args: { [name]: value },
        icon: arrows && value !== undefined ? ARROWS[String(value)] : undefined,
        swatch: severity ? SWATCHES[value === undefined ? 'primary' : String(value)] : undefined,
        when: value === undefined ? undefined : dependent?.[String(value)],
      })),
    fallbacks: {
      [name]: fallback,
      ...Object.fromEntries(
        entry.controls.filter((other) => dependencies.has(other.name)).map((other) => [other.name, defaultValue(entry, other)]),
      ),
    },
  };
}

/** Avatar: XS and XL of the DS live in `extraSize`, outside PrimeNG `size`; both go into one size choice. */
function mergeExtraSize(field: ChoiceField, extra: ControlDef): void {
  // XS builds on the smallest PrimeNG size and XL on the largest, as the ExtraSmall and ExtraLarge stories do
  const smallest = { ...field.options[0]?.args };
  const largest = { ...field.options[field.options.length - 1]?.args };
  for (const option of field.options) option.args[extra.name] = undefined;
  for (const value of extra.options ?? []) {
    if (value === undefined) continue;
    const option = { label: String(value).toUpperCase(), args: { ...(value === 'xs' ? smallest : largest), [extra.name]: value } };
    if (value === 'xs') field.options.unshift(option);
    else field.options.push(option);
  }
  field.fallbacks[extra.name] = undefined;
}

export function groupControls(entry: ComponentEntry): ControlGroups {
  const groups: ControlGroups = { appearance: [], elements: [], state: [], content: [], advanced: [] };
  const byName = new Map(entry.controls.map((control) => [control.name, control]));
  const used = new Set<string>();

  for (const [name, label] of APPEARANCE) {
    const control = byName.get(name);
    if (!control || (SIZES.has(name) && groups.appearance.some((field) => SIZES.has(field.name)))) continue;
    // Elsewhere it only places the tooltip of the component
    if (name === 'tooltipPosition' && entry.title !== 'Tooltip') continue;
    const field = enumField(entry, control, label);
    if (!field) continue;
    groups.appearance.push(field);
    used.add(name);
  }

  const sizeField = groups.appearance.find((field) => SIZES.has(field.name));
  const extra = byName.get('extraSize');
  if (sizeField && extra) {
    mergeExtraSize(sizeField, extra);
    used.add(extra.name);
  }

  for (const [name, choice] of Object.entries(BOOLEAN_CHOICES)) {
    const control = byName.get(name);
    if (control?.kind !== 'boolean' || (name === 'small' && sizeField)) continue;
    groups.appearance.push({
      name,
      label: choice.label,
      description: control.description,
      options: choice.options.map(([value, label, icon]) => ({ label, icon, args: { [name]: value } })),
      fallbacks: { [name]: defaultValue(entry, control) === true },
    });
    used.add(name);
  }

  // Boolean twins of a variant value (Button `outlined`, `text`) would repeat it
  const variants = new Set((byName.get('variant')?.options ?? []).filter((value) => value !== undefined).map(String));

  for (const control of entry.controls) {
    if (used.has(control.name)) continue;
    const { name, kind } = control;
    const item = { control, label: controlLabel(entry.title, control) };
    if (kind === 'boolean' && !variants.has(name) && isElement(name)) groups.elements.push(item);
    else if (kind === 'boolean' && !variants.has(name) && STATE.has(name)) groups.state.push(item);
    else if (isContent(control)) groups.content.push(item);
    else groups.advanced.push(control);
  }
  return groups;
}

/** Same arg value: identical, same JSON, or unset against the effective value of the unset arg. */
function sameArg(a: unknown, b: unknown, fallback?: unknown): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined) return fallback !== undefined && (a ?? b) === fallback;
  return typeof a === 'object' && typeof b === 'object' && JSON.stringify(a) === JSON.stringify(b);
}

/**
 * A preset that, texts and icons aside, only differs from `from` (Default or another example) in choices of the
 * Apariencia section repeats the panel: Button `Danger outlined`, Galleria `Indicators top` (from `Indicators`).
 * A preset that also changes anything else (state, elements, data) is a real example.
 */
export function repeatsAppearance(entry: ComponentEntry, preset: PresetDef, from: PresetDef, groups: ControlGroups = groupControls(entry)): boolean {
  const content = new Set(groups.content.map((item) => item.control.name));
  const target = { ...entry.baseArgs, ...preset.args };
  const start = { ...entry.baseArgs, ...from.args };
  const changed = [...new Set([...Object.keys(preset.args), ...Object.keys(from.args)])].filter(
    (name) => !content.has(name) && !sameArg(target[name], start[name]),
  );
  return (
    changed.length > 0 &&
    changed.every((name) =>
      groups.appearance.some((field) =>
        field.options.some((option) => name in option.args && Object.entries(option.args).every(([arg, set]) => sameArg(set, target[arg], field.fallbacks[arg]))),
      ),
    )
  );
}
