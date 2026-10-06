import figma from 'figma'
import type { InstanceHandle, TextHandle } from 'figma'
import { attr, bind, firstText, isInstance, jsText, part, phIcon, prop, slotCode, swapIcon, text } from '../helpers'
import { P } from '../props'

export type CardKind = 'default' | 'expandable' | 'product' | 'horizontal' | 'horizontal-full'

const SEVERITY: Record<string, string | undefined> = {
  Primary: undefined,
  Secondary: 'secondary',
  Success: 'success',
  Info: 'info',
  Warn: 'warn',
  Danger: 'danger',
  Contrast: 'contrast',
}
// Layers of the header that are not the left/right icons
const NOT_ICON = /^(avatar-ds|card-content|tag|Caret|button-|Icon button|Ellipse)/

// Figma gives each layer the names of all its ancestor frames; the `path` option needs the whole chain,
// which differs between the five sets, so blocks are found by one ancestor name instead
function under(node: unknown, frame: string): boolean {
  return ((node as { path?: string[] }).path ?? []).includes(frame)
}

// `true` unless the card defines one of the booleans and it is off
function on(instance: InstanceHandle, ...names: string[]): boolean {
  return names.every((name) => prop(instance, name) !== false)
}

function isText(handle: unknown): handle is TextHandle {
  return !!handle && (handle as { type?: string }).type === 'TEXT'
}

const quote = (value: string) => `'${jsText(value)}'`
const list = (values: string[]) => (values.length ? `[${values.map(quote).join(', ')}]` : undefined)

// Shared by the five DS card sets: one `prime-one-card` with every block that is visible in the instance
export function cardTemplate(instance: InstanceHandle, kind: CardKind) {
  const blocks = instance.findLayers((node) => node.name === 'card-content-text').filter(isInstance)
  const ofType = (type: string, size?: string) => blocks.filter((b) => prop(b, 'Type') === type && (!size || prop(b, 'Size') === size))
  const first = (type: string, layer: string) => {
    const block = ofType(type)[0]
    return block ? text(block, layer) : undefined
  }

  const headerPath = kind === 'default' ? 'list-row' : 'header'
  const header = on(instance, 'Header')
  const icons = instance
    .findLayers((node) => isInstance(node) && !NOT_ICON.test(node.name) && under(node, headerPath))
    .filter(isInstance)
  const leftOn = header && on(instance, P.nestedIconLeft, 'Icon Left', 'Show Icon')
  const rightOn = header && kind === 'default' && on(instance, P.nestedIconRight)
  const avatarLayer = header && on(instance, P.nestedAvatar) ? part(instance, 'avatar-ds') : undefined
  const headerTag = header && on(instance, P.nestedTag, 'Tag')
    ? instance.findLayers((node) => node.name === 'tag' && under(node, headerPath)).filter(isInstance)[0]
    : undefined

  const content = on(instance, 'Content')
  const tagsRow = content && on(instance, P.nestedShowTagsRow)
    ? instance.findLayers((node) => node.name === 'tag' && under(node, 'Tag Row')).filter(isInstance)
    : []
  const itemTags = on(instance, P.nestedShowItems) ? instance.findLayers((node) => node.name === 'tag' && under(node, 'Tags')).filter(isInstance) : []
  const itemTexts = on(instance, P.nestedShowItems) ? instance.findLayers((node) => node.name === 'Tag Item').filter(isText) : []
  const itemIcons = itemTexts.length ? instance.findLayers((node) => isInstance(node) && under(node, 'Item')).filter(isInstance) : []

  const footer = on(instance, 'Show Footer')
  const guide = footer && on(instance, P.nestedShowLink)
  const linkButton = guide && on(instance, P.deepShowButton)
    ? instance.findLayers((node) => node.name === 'button-large' && under(node, 'Cards guide')).filter(isInstance)[0]
    : undefined
  const labelBlock = guide && on(instance, P.deepShowLabel) ? ofType('label', 'l')[0] : undefined
  const pager = guide && on(instance, P.deepShowPaginator)
    ? instance.findLayers((node) => isText(node) && /\d+\s*de\s*\d+/.test(node.textContent)).filter(isText)[0]
    : undefined
  const [, page, pages] = pager?.textContent.match(/(\d+)\s*de\s*(\d+)/) ?? [undefined, '1', '2']

  const size = prop(instance, 'Size')
  const state = prop(instance, 'State')
  const title = header && on(instance, P.nestedTitle) ? first('title', 'Title') : undefined
  const subtitle = header && on(instance, P.nestedSubtitle, 'Subtitle') ? first('subtitle', 'Description Text') : undefined
  const body = content && on(instance, P.nestedShowText) ? first('text', 'Description Text') : undefined
  const bullets = content && on(instance, P.nestedShowBullets)
    ? ofType('bullet').map((b) => text(b, 'Description Text')).filter((t): t is string => !!t)
    : []
  const metric = content && on(instance, P.nestedShowNumber) ? first('metric', 'Title') : undefined
  const metricUnit = metric ? (text(instance, 'Metric Unit') ?? text(instance, 'Metric Label')) : undefined
  const captions = footer && on(instance, P.nestedShowCaption)
    ? ofType('label', 'm').map((b) => text(b, 'Description Text')).filter((t): t is string => !!t)
    : []
  const author = footer && on(instance, P.nestedShowAuthor) ? text(instance, 'Author Name') : undefined
  const labelValues = labelBlock
    ? labelBlock.findLayers((node) => isText(node) && node.name === 'Title').filter(isText).map((t) => t.textContent)
    : []
  const tags = tagsRow.map((t) => {
    const severity = SEVERITY[String(prop(t, 'Severity'))]
    return `{ value: ${quote(t.getString('Text'))}${severity ? `, severity: '${severity}'` : ''} }`
  })
  const items = itemTags.length
    ? itemTags.map((t) => {
        const icon = prop(t, 'Show Icon') !== false ? swapIcon(t, 'Icon') : undefined
        return `{ label: ${quote(t.getString('Text'))}${icon ? `, icon: '${icon}'` : ''} }`
      })
    : itemTexts.map((t, i) => {
        const icon = phIcon(itemIcons[i])
        return `{ label: ${quote(t.textContent)}${icon ? `, icon: '${icon}'` : ''} }`
      })

  const attrs = [
    attr('type', kind === 'default' ? undefined : kind),
    attr('size', size === 'S' || size === 'Mobile' ? 's' : undefined),
    attr('background', prop(instance, 'Background') === 'Grey' ? 'grey' : undefined),
    bind('disabled', state === 'Disabled' && 'true'),
    bind('interactive', (state === 'Hover' || state === 'Focus') && 'true'),
    attr('image', kind !== 'default' && kind !== 'expandable' && on(instance, 'Show Image') ? 'assets/card.jpg' : undefined),
    attr('avatar', avatarLayer ? firstText(avatarLayer) : undefined),
    attr('icon', leftOn ? phIcon(icons[0]) : undefined),
    attr('heading', title),
    attr('subtitle', subtitle),
    attr('tag', headerTag?.getString('Text')),
    attr('tagSeverity', headerTag ? SEVERITY[String(prop(headerTag, 'Severity'))] : undefined),
    attr('iconRight', rightOn ? phIcon(icons[icons.length - 1]) : undefined),
    bind('expanded', kind === 'expandable' && prop(instance, 'Expanded') === 'True' && 'true'),
    attr('text', body),
    bind('bullets', list(bullets)),
    attr('metric', metric),
    attr('metricUnit', metricUnit),
    bind('tags', tags.length > 0 && `[${tags.join(', ')}]`),
    bind('items', items.length > 0 && `[${items.join(', ')}]`),
    attr('author', author),
    bind('captions', list(captions)),
    attr('linkLabel', linkButton?.getString('Text')),
    attr('labelCaption', labelBlock ? text(labelBlock, 'Description Text') : undefined),
    bind('labelValues', list(labelValues)),
    bind('page', pager || (guide && on(instance, P.deepShowPaginator)) ? page : undefined),
    bind('pages', pager || (guide && on(instance, P.deepShowPaginator)) ? pages : undefined),
  ]
    .filter(Boolean)
    .map((a) => `\n ${a}`)
    .join('')

  const slot = on(instance, 'Show Slot') ? slotCode(instance, P.nestedSlot) : undefined
  const open = attrs ? `${attrs}\n` : ''
  const example = slot
    ? figma.code`<prime-one-card${open}>\n  ${slot}\n</prime-one-card>`
    : figma.code`<prime-one-card${open}${attrs ? '' : ' '}/>`
  return { example, imports: ["import { PrimeOneCard } from 'prime-one-ds';"] }
}
