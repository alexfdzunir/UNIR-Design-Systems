import { atom, read, update } from 'claude-code'
import type { EngineInterface, McpToolResult, Register } from 'claude-code'

import type { Banner, CheckStatus } from '../types'

// Brand colours: BLUE_UNIR in src/theme/presets.ts and the AEM accents in src/aem/styles/tokens.css.
const BLUE = '#0d61f2'
const BLUE_400 = '#6ea0f7'
const SKY = '#87d7f2'
const RIOJA = '#e01e5d'
const WHITE = '#ffffff'

// First line of the repo's AGENTS.md: the banner only opens in a session started in the DS repo.
const MARKER = '# Agente de los sistemas de diseño de UNIR'
const SUBTITLE = 'Design Systems UNIR  ·  PrimeOne + AEM Portales'
const SPIN = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
const FRAME_MS = 40
// MCP servers connect after the session starts: the Figma check asks again until MCP_WAIT_MS has passed.
const MCP_WAIT_MS = 10000
const MCP_RETRY_MS = 1000
const MCP_TIMEOUT_MS = 5000

// "DS-AGENT" in the ANSI Shadow figlet font, six rows a letter.
const LETTERS: Record<string, readonly string[]> = {
  D: ['██████╗ ', '██╔══██╗', '██║  ██║', '██║  ██║', '██████╔╝', '╚═════╝ '],
  S: ['███████╗', '██╔════╝', '███████╗', '╚════██║', '███████║', '╚══════╝'],
  '-': ['        ', '        ', ' █████╗ ', ' ╚════╝ ', '        ', '        '],
  A: [' █████╗ ', '██╔══██╗', '███████║', '██╔══██║', '██║  ██║', '╚═╝  ╚═╝'],
  G: [' ██████╗ ', '██╔════╝ ', '██║  ███╗', '██║   ██║', '╚██████╔╝', ' ╚═════╝ '],
  E: ['███████╗', '██╔════╝', '█████╗  ', '██╔══╝  ', '███████╗', '╚══════╝'],
  N: ['███╗   ██╗', '████╗  ██║', '██╔██╗ ██║', '██║╚██╗██║', '██║ ╚████║', '╚═╝  ╚═══╝'],
  T: ['████████╗', '╚══██╔══╝', '   ██║   ', '   ██║   ', '   ██║   ', '   ╚═╝   '],
}
const LOGO = [0, 1, 2, 3, 4, 5].map(row => [...'DS-AGENT'].map(ch => LETTERS[ch]?.[row] ?? '').join(''))
const LOGO_WIDTH = [...(LOGO[0] ?? '')].length

/** The checks in the order they open; `probe` resolves each one's detail or rejects to show `failure`. */
const PROBES = [
  { name: 'AGENTS.md', failure: 'no encontrado' },
  { name: 'Figma MCP', failure: 'sin conexión' },
  { name: 'Skills', failure: 'no encontradas' },
  { name: 'PrimeOne', failure: 'package.json ilegible' },
  { name: 'AEM Portales', failure: 'sin componentes' },
] as const

type ProbeName = (typeof PROBES)[number]['name']

// Timeline in frames: the logo reveals 4 columns a frame and a shine sweeps it; the check rows
// open CHECK_GAP frames apart and each spins at least that long before showing its result.
const REVEAL_END = Math.ceil(LOGO_WIDTH / 4)
const SHINE_END = REVEAL_END + Math.ceil((LOGO_WIDTH + 8) / 4)
const CHECKS_START = REVEAL_END + 3
const CHECK_GAP = 5
// Logo, subtitle, a blank row, the checks and the status label: 14 rows, what a 45-row terminal leaves the band.
const BANNER_ROWS = LOGO.length + 2 + PROBES.length + 1

const IDLE: Banner = { isActive: false, isHidden: false, tick: 0, checks: [] }
const banner = atom({ plugin: 'ds-agent', key: 'banner' } as const, IDLE)

const opensAt = (i: number) => CHECKS_START + i * CHECK_GAP
const isShown = (b: Banner, i: number) => b.checks[i]?.status !== 'pending' && b.tick >= opensAt(i) + CHECK_GAP
const isSettled = (b: Banner) => b.checks.every((_, i) => isShown(b, i)) && b.tick >= SHINE_END

const hex = (color: string) => [1, 3, 5].map(at => parseInt(color.slice(at, at + 2), 16))
const mix = (from: string, to: string, t: number) => {
  const [a, b] = [hex(from), hex(to)]
  return '#' + a.map((v, i) => Math.round(v + ((b[i] ?? v) - v) * t).toString(16).padStart(2, '0')).join('')
}
const shade = (x: number, shine: number) => {
  const base = mix(BLUE, SKY, x / LOGO_WIDTH)
  const distance = Math.abs(x - shine)
  return distance < 4 ? mix(WHITE, base, distance / 4) : base
}

async function probe($: EngineInterface, name: ProbeName, root: string): Promise<string> {
  switch (name) {
    case 'AGENTS.md':
      return 'instrucciones'
    case 'Figma MCP':
      return figma($)
    case 'Skills':
      return skills($, root)
    case 'PrimeOne':
      return primeOne($, root)
    case 'AEM Portales':
      return aem($, root)
  }
}

async function figma($: EngineInterface): Promise<string> {
  const deadline = (await $.clock.now()) + MCP_WAIT_MS
  for (;;) {
    const result = await whoami($).catch(() => undefined)
    if (result) {
      if (result.isError) throw new Error('Figma MCP whoami failed')
      return 'conectado'
    }
    if ((await $.clock.now()) + MCP_RETRY_MS >= deadline) throw new Error('Figma MCP not connected')
    await pause($, MCP_RETRY_MS)
  }
}

function whoami($: EngineInterface): Promise<McpToolResult> {
  return new Promise<McpToolResult>((resolve, reject) => {
    const timer = $.clock.after(MCP_TIMEOUT_MS, () => reject(new Error('Figma MCP did not answer')))
    $.mcp.call('figma', 'whoami').then(resolve, reject).finally(() => timer.cancel())
  })
}

function pause($: EngineInterface, ms: number): Promise<void> {
  return new Promise(resolve => {
    $.clock.after(ms, () => resolve())
  })
}

async function skills($: EngineInterface, root: string): Promise<string> {
  const dirs = (await $.fs.list(`${root}/skills`)).filter(entry => entry.kind === 'dir')
  const found = await Promise.all(dirs.map(dir => $.fs.exists(`${root}/skills/${dir.name}/SKILL.md`)))
  const count = found.filter(Boolean).length
  if (count === 0) throw new Error('No skills in skills/')
  return `${count} cargadas`
}

async function primeOne($: EngineInterface, root: string): Promise<string> {
  const pkg = JSON.parse(await $.fs.read(`${root}/package.json`)) as { devDependencies?: Record<string, string> }
  const major = (name: string) => pkg.devDependencies?.[name]?.match(/\d+/)?.[0] ?? '?'
  return `Angular ${major('@angular/core')} · PrimeNG ${major('primeng')}`
}

async function aem($: EngineInterface, root: string): Promise<string> {
  const count = (await $.fs.list(`${root}/src/aem/components`)).filter(entry => entry.kind === 'dir').length
  if (count === 0) throw new Error('No AEM components')
  return `${count} componentes · HTML · CSS · JS`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    if (!e.isInteractive) return started

    const root = await $.session.root()
    const agents = await $.fs.read(`${root}/AGENTS.md`).catch(() => '')
    if (!agents.startsWith(MARKER)) return started

    await update($, banner, () => ({ ...IDLE, isActive: true, checks: PROBES.map(() => ({ status: 'pending', detail: '' })) }))
    PROBES.forEach(({ name, failure }, i) => {
      const settle = (status: CheckStatus, detail: string) =>
        update($, banner, b => ({ ...b, checks: b.checks.map((check, j) => (j === i ? { status, detail } : check)) }))
      void probe($, name, root).then(
        detail => settle('ok', detail),
        () => settle('fail', failure),
      )
    })
    const frames = $.clock.every(FRAME_MS, () => {
      void update($, banner, b => ({ ...b, tick: b.tick + 1 })).then(b => {
        if (b.isHidden || isSettled(b)) frames.cancel()
      })
    })

    return started
  })

  // The banner greets the session: the first prompt sent puts it away.
  on('prompt.submit', async ($, e, next) => {
    const b = await read($, banner)
    if (b.isActive && !b.isHidden) await update($, banner, value => ({ ...value, isHidden: true }))

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const b = await read($, banner)
    if (!b.isActive || b.isHidden || e.props.hasSurvey) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    const isCompact = e.props.bodyColumns < LOGO_WIDTH || e.props.maxRows < BANNER_ROWS
    const reveal = Math.min(LOGO_WIDTH, b.tick * 4)
    const shine = b.tick > REVEAL_END ? (b.tick - REVEAL_END) * 4 - 4 : -LOGO_WIDTH
    const fails = b.checks.filter(check => check.status === 'fail').length
    const isDone = b.checks.every((_, i) => isShown(b, i))

    const logoRow = (row: string) => {
      const chars = [...row].slice(0, reveal)
      if (chars.length === 0) return <Text> </Text>
      const parts = []
      for (let x = 0; x < chars.length; x += 2) {
        parts.push(<Text color={shade(x, shine)}>{chars.slice(x, x + 2).join('')}</Text>)
      }
      return <Text>{parts}</Text>
    }

    const checkRow = (name: string, i: number) => {
      const check = b.checks[i]
      if (!check || b.tick < opensAt(i)) return <Text> </Text>
      if (!isShown(b, i)) {
        return (
          <Text>
            {'  '}
            <Text color={BLUE_400}>{SPIN.charAt(b.tick % SPIN.length)}</Text>
            {` ${name}`}
          </Text>
        )
      }
      return (
        <Text>
          {'  '}
          {check.status === 'ok' ? <Text color="success">✓</Text> : <Text color={RIOJA}>✗</Text>}
          {` ${name}`}
          <Text dimColor>{` ${'.'.repeat(Math.max(2, 16 - name.length))} ${check.detail}`}</Text>
        </Text>
      )
    }

    const label = fails === 0 ? ' ● CONECTADO ' : ` ● CONECTADO · ${fails} ${fails === 1 ? 'aviso' : 'avisos'} `

    return (
      <Box flexDirection="column">
        {isCompact ? (
          <Text bold color={BLUE}>
            ◆ DS-AGENT
          </Text>
        ) : (
          LOGO.map(logoRow)
        )}
        <Text dimColor>{SUBTITLE.slice(0, Math.max(0, (b.tick - REVEAL_END) * 3)) || ' '}</Text>
        <Text> </Text>
        {PROBES.map(({ name }, i) => checkRow(name, i))}
        {isDone ? (
          <Text bold color={WHITE} backgroundColor={fails === 0 ? BLUE : RIOJA}>
            {label}
          </Text>
        ) : (
          <Text> </Text>
        )}
      </Box>
    )
  })
}
