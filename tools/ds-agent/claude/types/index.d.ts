export type CheckStatus = 'pending' | 'ok' | 'fail'

export type Check = { status: CheckStatus; detail: string }

/** The banner of a session: `tick` counts animation frames since it opened. */
export type Banner = { isActive: boolean; isHidden: boolean; tick: number; checks: Check[] }

declare module 'claude-code' {
  interface PluginState {
    'ds-agent': { banner: Banner }
  }
}
