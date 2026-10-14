import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

type Shade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';
type Palette = Record<Shade, string>;

// Values resolved from the Figma variables Semantic/Common primary/* and Semantic/Color Scheme surface/*.
const BLUE_UNIR: Palette = {
  50: '#f9fcff', 100: '#e7effe', 200: '#cfdffc', 300: '#9ec0fa', 400: '#6ea0f7', 500: '#3d81f5',
  600: '#0d61f2', 700: '#0a4ec2', 800: '#083a91', 900: '#052761', 950: '#031330',
};

const BLUE_PRODI: Palette = {
  50: '#f9fcff', 100: '#e6efff', 200: '#bad2ff', 300: '#8eb6ff', 400: '#6299ff', 500: '#367cff',
  600: '#0a5cf5', 700: '#0047cc', 800: '#0039a3', 900: '#002b7b', 950: '#001d52',
};

const SURFACE_ESTUDIANTES: Palette = {
  50: '#fcfcfe', 100: '#f7f8fd', 200: '#eff2fb', 300: '#ebeefa', 400: '#bbc1d8', 500: '#848eae',
  600: '#5a6481', 700: '#4a5268', 800: '#383c48', 900: '#22252f', 950: '#181c26',
};

const SURFACE_SLATE: Palette = {
  50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b',
  600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617',
};

const SURFACE_DARK: Palette = {
  50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a',
  600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b',
};

/** Radius scale of the Figma "Primitive" collection, mode "Base 16" (the one the DS uses). */
const BORDER_RADIUS = { none: '0', xs: '4px', sm: '6px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px' };

/**
 * Type scale of the Figma "typography" collection (and its text styles: headlines SemiBold, body/label Regular,
 * Medium or SemiBold). Emitted as `--p-typography-*` through `extend`, the same in every theme.
 */
const TYPOGRAPHY = {
  family: "'Proeduca Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
  letterSpacing: { tight: '-2px', snug: '-1px', normal: '0', wide: '1px' },
  headline: {
    h1: { size: '1.875rem', lineHeight: '2.25rem' },
    h2: { size: '1.75rem', lineHeight: '2.125rem' },
    h3: { size: '1.625rem', lineHeight: '1.9375rem' },
    h4: { size: '1.5rem', lineHeight: '1.8125rem' },
    h5: { size: '1.375rem', lineHeight: '1.625rem' },
    h6: { size: '1.125rem', lineHeight: '1.375rem' },
  },
  body: {
    m: { size: '1rem', lineHeight: '1.5rem' },
    s: { size: '0.875rem', lineHeight: '1.25rem' },
    xs: { size: '0.75rem', lineHeight: '1rem' },
  },
  label: {
    l: { size: '1rem', lineHeight: '1.25rem' },
    m: { size: '0.875rem', lineHeight: '1.25rem' },
    s: { size: '0.75rem', lineHeight: '1rem' },
  },
  caption: { size: '0.625rem', lineHeight: '0.875rem' },
};

/** Spacing scale of the Figma "Primitive" collection (mode Base 16): `--p-scale-<rem>` with the rem as in Figma. */
const SCALE = {
  '0-125': '0.125rem', '0-25': '0.25rem', '0-375': '0.375rem', '0-5': '0.5rem', '0-625': '0.625rem', '0-75': '0.75rem',
  '0-875': '0.875rem', '1': '1rem', '1-125': '1.125rem', '1-25': '1.25rem', '1-375': '1.375rem', '1-5': '1.5rem',
  '1-625': '1.625rem', '1-75': '1.75rem', '1-875': '1.875rem', '2': '2rem', '2-25': '2.25rem', '2-5': '2.5rem',
  '2-75': '2.75rem', '3': '3rem', '4': '4rem', '5': '5rem',
};

/** Radius roles of the Figma "Semantic/Common" and "Component/Common" collections, per theme. */
interface ThemeRadius {
  content: string;
  formField: string;
  listOption: string;
  navigationItem: string;
  overlaySelect: string;
  overlayModal: string;
  card: string;
  components?: Record<string, unknown>;
}

/**
 * Figma "Component/Common" paginator: vertical padding and nav button radius per theme. Colours, sizes and
 * the transparent nav button background match Aura.
 */
function paginatorTokens(paddingY: string, navButtonRadius: string) {
  return {
    root: { padding: `${paddingY} 1rem` },
    navButton: { borderRadius: navButtonRadius },
  };
}

/**
 * Figma button sizes (same in every theme): md 42px high (padding 10/12, text 16/20), sm 34px (8/10, 14/16)
 * and lg 50px (14/14, 16/20). Icon-only buttons are square: 42 and 30 as in Figma, and 50 for lg to match
 * the row height (Figma draws it 52x50). The line height is fixed so the heights do not depend on the font.
 */
const BUTTON_SIZES = {
  paddingX: '0.75rem',
  paddingY: '0.625rem',
  gap: '0.5rem',
  iconOnlyWidth: '2.625rem',
  sm: { fontSize: '0.875rem', paddingX: '0.625rem', paddingY: '0.5rem', iconOnlyWidth: '1.875rem' },
  lg: { fontSize: '1rem', paddingX: '0.875rem', paddingY: '0.875rem', iconOnlyWidth: '3.125rem' },
};

const BUTTON_CSS = `
.p-button { line-height: 1.25rem; }
.p-button-sm { line-height: 1rem; }
.p-button-icon-only { height: var(--p-button-icon-only-width); padding-block: 0; }
.p-button-sm.p-button-icon-only { height: var(--p-button-sm-icon-only-width); }
.p-button-lg.p-button-icon-only { height: var(--p-button-lg-icon-only-width); }
.p-button.p-buttonchip { border-radius: var(--p-button-border-radius); font-size: 0.75rem; padding-block: 0.25rem; }
.p-button.p-buttonchip:not(.p-buttonchip-active) { color: var(--p-button-chip-color); border-color: var(--p-button-chip-border-color); }
.p-button.p-buttonchip:not(.p-buttonchip-active):not(:disabled):hover { color: var(--p-button-chip-color); border-color: var(--p-button-chip-border-color); background: var(--p-button-chip-hover-background); }
.p-button.p-buttonchip.p-buttonchip-active,
.p-button.p-buttonchip.p-buttonchip-active:not(:disabled):hover { color: var(--p-button-chip-color); border-color: var(--p-primary-color); background: var(--p-button-chip-active-background); }
`;

/** Figma "buttonchip": filter chip on a small secondary button (class `p-buttonchip`, `p-buttonchip-active` when on). */
const BUTTON_CHIP_TOKENS = {
  light: { chip: { color: '{surface.800}', borderColor: '{content.border.color}', hoverBackground: '{surface.100}', activeBackground: '#eff6ff' } },
  dark: { chip: { color: '{text.color}', borderColor: '{content.border.color}', hoverBackground: '{surface.800}', activeBackground: '{highlight.background}' } },
};

/**
 * Stepper as in Figma: steps before the active one are "past" (primary border and a check instead of the number).
 * PrimeNG 21 has no completed state, so they are found with `:has()` (horizontal steps and vertical step items).
 */
const STEPPER_CSS = `
.p-step-header { font-size: inherit; }
.p-step:has(~ .p-step-active) .p-step-number,
.p-stepitem:has(~ .p-stepitem-active) .p-step-number { border-color: var(--p-primary-color); color: transparent; font-size: 0; }
.p-step:has(~ .p-step-active) .p-step-number::before,
.p-stepitem:has(~ .p-stepitem-active) .p-step-number::before { content: "\\e182"; font-family: "Phosphor"; font-size: 1rem; line-height: 1; color: var(--p-primary-color); }
/* Mobile: steps closer together; the list scrolls (poCenterActive keeps the active step centred) */
@media (max-width: 575.98px) {
  .p-steplist { scrollbar-width: none; }
  .p-steplist .p-step { flex: 0 0 auto; gap: 0.5rem; padding-inline: 0.25rem; }
}
`;

/**
 * Accordion toggle as in Figma: 20px, primary in both states and pointing down when open. The collapsed icon of
 * PrimeNG 21 lacks the toggle-icon class, so it is styled by attribute.
 */
const ACCORDION_CSS = `
.p-accordionheader [data-p-icon] { width: 1.25rem; height: 1.25rem; transform: rotate(180deg); color: var(--p-accordion-header-toggle-icon-color); }
.p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader [data-p-icon] { color: var(--p-accordion-header-toggle-icon-active-color); }
`;

/**
 * Negative actions (Eliminar, Cancelar, Cerrar sesión): `styleClass: 'po-danger'` on the menu item or button turns
 * its hover and keyboard focus red, with a light red background. Shared by every menu type, SpeedDial and Button.
 */
const DANGER_CSS = `
.po-danger.po-danger:not(.p-disabled) > [class*="-item-content"]:hover,
.po-danger.po-danger.p-focus:not(.p-disabled) > [class*="-item-content"] { background: var(--p-danger-hover-background); color: var(--p-danger-color); }
.po-danger.po-danger:not(.p-disabled) > [class*="-item-content"]:hover :is([class*="-item-icon"], [class*="-item-label"]),
.po-danger.po-danger.p-focus:not(.p-disabled) > [class*="-item-content"] :is([class*="-item-icon"], [class*="-item-label"]) { color: var(--p-danger-color); }
.p-button.po-danger:not(:disabled):hover, .po-danger .p-speeddial-action:not(:disabled):hover { background: var(--p-danger-hover-background); border-color: transparent; color: var(--p-danger-color); }
`;

/**
 * PanelMenu as a tree: PrimeNG 21 wraps the root list in a bare <ul> that keeps the browser 40px padding. Without
 * it, and with a 24px indent (caret + gap), each level lines up with the icon of its parent.
 */
const PANELMENU_CSS = `
.p-panelmenu-content > ul:not([class]) { margin: 0; padding: 0; list-style: none; }
`;

/**
 * AutoComplete: the input fills the component whatever its width (Aura only stretches it when fluid), and the part of
 * an option that matches the typed text is in the primary colour (`po-autocomplete-match` in the item template).
 */
const AUTOCOMPLETE_CSS = `
.p-autocomplete > .p-autocomplete-input { flex: 1 1 auto; }
.p-autocomplete-option .po-autocomplete-match { color: var(--p-primary-color); }
`;

/** Password: the input fills the component whatever its width (Aura only stretches it when fluid). */
const PASSWORD_CSS = `
.p-password > .p-password-input { flex: 1 1 auto; }
`;

/** Breadcrumb separator (and default item icon) at the 14px of Figma. */
const BREADCRUMB_CSS = `
.p-breadcrumb-item-icon svg, .p-breadcrumb-separator svg { width: 0.875rem; height: 0.875rem; }
`;

/** Avatar initials and counters are Medium (500) in Figma; Aura has no token for it. */
const AVATAR_CSS = `
.p-avatar { font-weight: 500; }
`;

/** Checked and invalid checkbox: filled with the invalid colour, as in Figma (Aura only changes the border). */
const CHECKBOX_CSS = `
.p-checkbox-checked.p-invalid .p-checkbox-box { background: var(--p-checkbox-invalid-border-color); border-color: var(--p-checkbox-invalid-border-color); }
.p-checkbox-checked.p-invalid .p-checkbox-icon { color: var(--p-checkbox-icon-checked-color); }
`;

/**
 * Horizontal alternate timeline: three rows (above, line, below) with equal halves, so every marker sits on the same
 * line whatever each side holds. PrimeNG only lines them up when both sides are one line tall (`&nbsp;` in `opposite`).
 */
const TIMELINE_CSS = `
.p-timeline-horizontal .p-timeline-event-marker { flex-shrink: 0; }
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event { display: grid; grid-template-rows: 1fr auto 1fr; }
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event-separator { grid-row: 2; }
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-opposite,
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-content { grid-row: 1; align-self: end; }
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-content,
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-opposite { grid-row: 3; align-self: start; }
`;

/**
 * Dialogs never touch the screen edges: at least 16px on each side (maximized ones aside). The `breakpoints` input
 * does not reach ConfirmDialog in PrimeNG 21 (its media rule targets another element id). The footer text
 * (Figma "Description Text") sits on the left and the buttons on the right, all vertically centred.
 */
const DIALOG_CSS = `
.p-dialog:not(.p-dialog-maximized) { max-width: calc(100% - 2rem); }
.p-dialog-footer { align-items: center; }
.po-dialog-footer-text { margin-inline-end: auto; font-size: 1rem; line-height: 1.5; }
`;

/** Terminal as a code console: code font, prompt in the primary colour, output muted and multi-line. */
const TERMINAL_CSS = `
.p-terminal { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.875rem; line-height: 1.5; }
.p-terminal-welcome-message { color: var(--p-primary-color); font-weight: 600; }
.p-terminal-prompt-label { color: var(--p-primary-color); font-weight: 600; }
.p-terminal-command-value { color: var(--p-text-color); font-weight: 500; }
.p-terminal-command-response { color: var(--p-text-muted-color); white-space: pre-wrap; }
.p-terminal-prompt-value { font: inherit; color: var(--p-text-color); }
`;

const RADIUS_ESTUDIANTES: ThemeRadius = {
  content: '{border.radius.md}',
  formField: '{border.radius.sm}',
  listOption: '{border.radius.sm}',
  navigationItem: '{border.radius.md}',
  overlaySelect: '{border.radius.sm}',
  overlayModal: '{border.radius.lg}',
  card: '{content.border.radius}',
  components: {
    accordion: { header: { first: { topBorderRadius: '{border.radius.lg}' }, last: { bottomBorderRadius: '{border.radius.lg}' } } },
    tag: { root: { borderRadius: '{border.radius.md}' } },
    toast: { root: { borderRadius: '{border.radius.lg}' } },
    badge: { root: { borderRadius: '{border.radius.lg}' } },
    listbox: { root: { borderRadius: '{border.radius.lg}' } },
    paginator: paginatorTokens('0.625rem', '{border.radius.lg}'),
  },
};

const RADIUS_PRODI: ThemeRadius = {
  content: '{border.radius.xl}',
  formField: '{border.radius.xl}',
  listOption: '{border.radius.sm}',
  navigationItem: '{border.radius.2xl}',
  overlaySelect: '{border.radius.md}',
  overlayModal: '{border.radius.xl}',
  card: '{border.radius.2xl}',
  components: {
    button: { root: { roundedBorderRadius: '{border.radius.xl}' } },
    paginator: paginatorTokens('0.5rem', '1.25rem'),
  },
};

const RADIUS_FOUNDATIONS: ThemeRadius = {
  content: '{border.radius.none}',
  formField: '{border.radius.none}',
  listOption: '{border.radius.none}',
  navigationItem: '{border.radius.none}',
  overlaySelect: '{border.radius.none}',
  overlayModal: '{border.radius.none}',
  card: '{content.border.radius}',
  components: {
    paginator: paginatorTokens('0.5rem', '1.25rem'),
  },
};

/**
 * Component tokens and CSS shared by every theme, from the Figma "Component/Common" and "Component/Color Scheme"
 * collections. Sizes in rem assume the 16px root of the apps.
 */
const COMPONENTS = {
  accordion: { header: { toggleIcon: { color: '{primary.color}', activeColor: '{primary.color}' } }, css: ACCORDION_CSS },
  autocomplete: { list: { gap: '0.25rem' }, css: AUTOCOMPLETE_CSS },
  avatar: {
    root: { fontSize: '0.75rem' },
    lg: { fontSize: '0.875rem', icon: { size: '1.25rem' }, group: { offset: '-0.75rem' } },
    xl: { fontSize: '1rem' },
    css: AVATAR_CSS,
  },
  breadcrumb: { css: BREADCRUMB_CSS },
  contextmenu: { css: DANGER_CSS },
  button: { root: BUTTON_SIZES, colorScheme: BUTTON_CHIP_TOKENS, css: BUTTON_CSS + DANGER_CSS },
  checkbox: { css: CHECKBOX_CSS },
  chip: {
    root: { paddingY: '0.625rem', gap: '0.875rem' },
    colorScheme: { light: { icon: { color: '{primary.color}' } }, dark: { icon: { color: '{primary.color}' } } },
  },
  dialog: { footer: { gap: '1rem' }, css: DIALOG_CSS },
  megamenu: { css: DANGER_CSS },
  menu: { css: DANGER_CSS },
  menubar: { css: DANGER_CSS },
  panelmenu: { submenu: { indent: '1.5rem' }, css: PANELMENU_CSS + DANGER_CSS },
  password: { css: PASSWORD_CSS },
  speeddial: { css: DANGER_CSS },
  stepper: {
    step: { padding: '0.625rem', gap: '27px' },
    stepHeader: { gap: '0.625rem', borderRadius: '{border.radius.2xl}' },
    stepTitle: { color: '{text.color}' },
    stepNumber: { fontSize: '1rem', activeBackground: '{primary.color}', activeBorderColor: '{primary.color}', activeColor: '{primary.contrast.color}' },
    steppanels: { padding: '1.125rem 0.5rem 1.6875rem 0.5rem' },
    css: STEPPER_CSS,
  },
  terminal: { css: TERMINAL_CSS },
  tieredmenu: { css: DANGER_CSS },
  // Aura lets the horizontal marker shrink next to the 100% wide connector, so it turns into an oval
  timeline: { css: TIMELINE_CSS },
};

type Tokens = Record<string, unknown>;
const isTokens = (value: unknown): value is Tokens => typeof value === 'object' && value !== null && !Array.isArray(value);

/** Deep merge: a theme overrides single tokens of a component without dropping the shared ones. */
function mergeTokens(base: Tokens, extra: Tokens = {}): Tokens {
  const out: Tokens = { ...base };
  for (const [key, value] of Object.entries(extra)) out[key] = isTokens(out[key]) && isTokens(value) ? mergeTokens(out[key] as Tokens, value) : value;
  return out;
}

function primeOnePreset(primary: Palette, lightSurface: Palette, radius: ThemeRadius) {
  return definePreset(Aura, {
    primitive: { borderRadius: BORDER_RADIUS },
    extend: { typography: TYPOGRAPHY, scale: SCALE },
    // Loose record from the merge: the token shapes are checked by the Figma audit, not by the type
    components: mergeTokens(mergeTokens(COMPONENTS, { card: { root: { borderRadius: radius.card } } }), radius.components as Tokens) as never,
    semantic: {
      primary,
      // Figma form fields: 42px high like the md button (padding 10px), 34 small and 50 large
      formField: { borderRadius: radius.formField, paddingY: '0.625rem', sm: { paddingY: '0.5rem' }, lg: { fontSize: '1rem', paddingY: '0.875rem' } },
      content: { borderRadius: radius.content },
      list: { option: { borderRadius: radius.listOption } },
      navigation: { item: { borderRadius: radius.navigationItem } },
      overlay: {
        select: { borderRadius: radius.overlaySelect },
        popover: { borderRadius: '{border.radius.md}' },
        modal: { borderRadius: radius.overlayModal },
      },
      colorScheme: {
        light: {
          surface: { 0: '#ffffff', ...lightSurface },
          primary: {
            color: '{primary.600}',
            contrastColor: '#ffffff',
            hoverColor: '{primary.900}',
            activeColor: '{primary.800}',
          },
          highlight: {
            background: '{primary.50}',
            focusBackground: '{primary.100}',
            color: '{primary.700}',
            focusColor: '{primary.800}',
          },
          text: { color: '{surface.950}', mutedColor: '{surface.500}' },
          content: { borderColor: '{surface.300}' },
          formField: {
            background: '{surface.0}',
            borderColor: '{surface.500}',
            hoverBorderColor: '{primary.color}',
            placeholderColor: '{surface.700}',
            invalidBorderColor: '{red.700}',
            invalidPlaceholderColor: '{red.700}',
            disabledBackground: '#e5e7eb',
            disabledColor: '#1f2937',
          },
          danger: { color: '{red.600}', hoverBackground: '{red.50}' },
        },
        dark: {
          surface: { 0: '#ffffff', ...SURFACE_DARK },
          primary: {
            color: '{primary.400}',
            contrastColor: '{surface.900}',
            hoverColor: '{primary.300}',
            activeColor: '{primary.200}',
          },
          highlight: {
            background: '{primary.900}',
            focusBackground: '{primary.800}',
            color: 'rgba(255,255,255,.87)',
            focusColor: 'rgba(255,255,255,.87)',
          },
          text: { color: '{surface.0}', mutedColor: '{surface.400}' },
          content: { borderColor: '{surface.700}' },
          formField: { background: '{surface.950}', borderColor: '{surface.200}', hoverBorderColor: '{primary.color}' },
          danger: { color: '{red.400}', hoverBackground: 'rgba(248, 113, 113, 0.16)' },
        },
      },
    },
  });
}

/** PrimeNG presets per DS theme. Dark mode is enabled by the `darkModeSelector` option of `providePrimeNG`. */
export const PrimeOneEstudiantes = primeOnePreset(BLUE_UNIR, SURFACE_ESTUDIANTES, RADIUS_ESTUDIANTES);
export const PrimeOneProdi = primeOnePreset(BLUE_PRODI, SURFACE_SLATE, RADIUS_PRODI);
export const PrimeOneFoundations = primeOnePreset(BLUE_UNIR, SURFACE_SLATE, RADIUS_FOUNDATIONS);
