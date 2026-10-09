#!/usr/bin/env node
// Codex SessionStart hook: the DS-Agent pill of a session opened in the PrimeOne-DS repo.
// Codex shows the hook's statusMessage with its spinner while this runs, then the systemMessage line.
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

// First line of the repo's AGENTS.md, as the Claude Code banner checks it.
const MARKER = '# Agente de los sistemas de diseño de UNIR'
// Keeps the "Conectando DS-Agent…" spinner on screen long enough to be seen.
const SPINNER_MS = 1200

const read = path => (existsSync(path) ? readFileSync(path, 'utf8') : '')

function findRepo(dir) {
  for (let at = dir; ; at = dirname(at)) {
    if (read(join(at, 'AGENTS.md')).startsWith(MARKER)) return at
    if (dirname(at) === at) return null
  }
}

const input = JSON.parse(read('/dev/stdin') || '{}')
if (!findRepo(input.cwd ?? process.cwd())) process.exit(0)

const isFigma = /^\[mcp_servers\.figma\]/m.test(read(join(homedir(), '.codex', 'config.toml')))
await new Promise(resolve => setTimeout(resolve, SPINNER_MS))
process.stdout.write(JSON.stringify({ systemMessage: `● DS-Agent  PrimeOne · AEM · Figma ${isFigma ? '✓' : '✗'}` }))
