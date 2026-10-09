import { describe, expect, mock, test } from 'claude-code/testing'
import type { FsEntry, On } from 'claude-code'

const ROOT = '/repo'
const AGENTS = '# Agente de los sistemas de diseño de UNIR\n\nEste repositorio...'
const PACKAGE = JSON.stringify({ devDependencies: { '@angular/core': '^21.2.0', primeng: '21.1.10' } })
const SKILLS = ['component-audit', 'component-generator', 'design-system-docs', 'design-tokens-sync', 'figma-to-code', 'figma-to-open-design', 'variable-architect']
const BAND = {
  plugin: 'ds-agent',
  surface: 'terminal',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 40, bodyColumns: 120, scroll: { offset: 0, bodyRows: 39 }, view: {} },
} as const
// Long enough for the logo, every check row and the status label.
const SETTLED_MS = 40 * 80

const dir = (name: string): FsEntry => ({ name, kind: 'dir', size: 0, mtimeMs: 0, isLink: false })

/**
 * The world beneath the plugin: a repo at ROOT with the given files and a Figma MCP server that is
 * not connected for its first `offlineCalls` calls, then answers (`isError` unless `isFigmaUp`).
 */
function world(on: On, files: Record<string, string>, { isFigmaUp = true, offlineCalls = 0 } = {}) {
  let calls = 0
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('session.root', () => ({ value: ROOT }))
  on('prompt.submit', ($, e) => ({ text: e.text }))
  on('ui.render', { component: 'AbovePrompt' }, ($, e) => {
    const { Box } = $.ui.resolve(e)
    return <Box />
  })
  on('fs.read', ($, e) => {
    const text = files[e.path]
    if (text === undefined) throw new Error(`ENOENT: ${e.path}`)
    return { value: text }
  })
  on('fs.list', ($, e) => ({ value: (e.path.endsWith('/skills') ? SKILLS : ['accordion', 'hero', 'footer']).map(dir) }))
  on('fs.exists', () => ({ value: true }))
  on('mcp.call', () => {
    calls += 1
    if (calls <= offlineCalls) throw new Error('no connected MCP tool "whoami" on a server named "figma"')
    return { value: { content: [], isError: !isFigmaUp } }
  })
  return { mcpCalls: () => calls }
}

const DS_REPO = { [`${ROOT}/AGENTS.md`]: AGENTS, [`${ROOT}/package.json`]: PACKAGE }

describe('DS-Agent banner', () => {
  test('opens in the DS repo and settles on CONECTADO with real checks', async ($, on) => {
    const clock = mock.clock(on)
    world(on, DS_REPO)
    await $.session.start({ cwd: ROOT, surface: 'terminal', isInteractive: true })
    const ui = await $.ui.mount(BAND)
    await clock.advance(SETTLED_MS)

    expect(await ui.find({ type: 'Text', text: /██████╗/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /7 cargadas/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /Angular 21 · PrimeNG 21/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /3 componentes/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: ' ● CONECTADO ' })).toBeDefined()
  })

  test('counts a failed check as an aviso', async ($, on) => {
    const clock = mock.clock(on)
    world(on, DS_REPO, { isFigmaUp: false })
    await $.session.start({ cwd: ROOT, surface: 'terminal', isInteractive: true })
    const ui = await $.ui.mount(BAND)
    await clock.advance(SETTLED_MS)

    expect(await ui.find({ type: 'Text', text: /sin conexión/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /CONECTADO · 1 aviso/ })).toBeDefined()
  })

  test('waits for the Figma MCP server to connect', async ($, on) => {
    const clock = mock.clock(on)
    const { mcpCalls } = world(on, DS_REPO, { offlineCalls: 2 })
    await $.session.start({ cwd: ROOT, surface: 'terminal', isInteractive: true })
    const ui = await $.ui.mount(BAND)
    await clock.advance(SETTLED_MS)

    expect(mcpCalls()).toBe(3)
    expect(await ui.find({ type: 'Text', text: /\.\.\. conectado/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: ' ● CONECTADO ' })).toBeDefined()
  })

  test('stays out of a session started anywhere else', async ($, on) => {
    const clock = mock.clock(on)
    world(on, { [`${ROOT}/package.json`]: PACKAGE })
    await $.session.start({ cwd: ROOT, surface: 'terminal', isInteractive: true })
    const ui = await $.ui.mount(BAND)
    await clock.advance(SETTLED_MS)

    expect(await ui.find({ type: 'Text', text: /CONECTADO|DS-AGENT|██/ })).toBeUndefined()
  })

  test('goes away with the first prompt', async ($, on) => {
    const clock = mock.clock(on)
    world(on, DS_REPO)
    await $.session.start({ cwd: ROOT, surface: 'terminal', isInteractive: true })
    const ui = await $.ui.mount(BAND)
    await clock.advance(SETTLED_MS)
    await $.prompt.submit({ text: 'hola', wait: false, origin: { kind: 'composer' } })

    expect(await ui.find({ type: 'Text', text: /CONECTADO/ })).toBeUndefined()
  })

  test('shrinks the logo to one line in a narrow terminal', async ($, on) => {
    const clock = mock.clock(on)
    world(on, DS_REPO)
    await $.session.start({ cwd: ROOT, surface: 'terminal', isInteractive: true })
    const ui = await $.ui.mount({ ...BAND, props: { ...BAND.props, bodyColumns: 60 } })
    await clock.advance(SETTLED_MS)

    expect(await ui.find({ type: 'Text', text: '◆ DS-AGENT' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /██/ })).toBeUndefined()
  })
})
