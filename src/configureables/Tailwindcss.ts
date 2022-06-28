// import baleadaComponents from '@baleada/tailwind-components'
import { getLinearNumeric } from '@baleada/tailwind-linear-numeric'
import * as themeUtils from '@baleada/tailwind-theme-utils'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import lineClamp from '@tailwindcss/line-clamp'
import aspectRatio from '@tailwindcss/aspect-ratio'
import defaultConfig from 'tailwindcss/defaultConfig'
import colors from 'tailwindcss/colors'
import createPlugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss/types/config'
import resolveConfig from 'tailwindcss/resolveConfig'

export class Tailwindcss {
  private config: Partial<Config>
  plugin: PluginMethod
  constructor (config: Partial<Config> = {}) {
    this.config = config
    this.plugin = createPluginMethod(this.addPlugin.bind(this))
  }

  private addPlugin (plugin: ReturnType<typeof createPlugin>) {
    this.config.plugins = [
      ...(this.config.plugins ?? []),
      plugin
    ]

    return this
  }

  configure () {
    return this.config
  }

  important () {
    this.config.important = true
    return this
  }

  content (paths: string[]) {
    this.config.content = [
      ...((this.config.content as string[]) ?? []),
      ...paths,
    ]
    return this
  }

  theme (themeOrGetTheme: Config['theme'] | ((api: GetThemeApi) => Config['theme'])) {
    const ensuredTheme = ensureTheme({ themeRaw: themeOrGetTheme, currentConfig: this.config })

    this.config.theme = {
      ...(this.config.theme ?? {}),
      ...ensuredTheme,
    }
    
    return this
  }

  extend (extendOrGetExtend: Config['theme']['extend'] | ((api: GetThemeApi) => Config['theme']['extend'])) {
    const ensuredExtend = ensureTheme({ themeRaw: extendOrGetExtend, currentConfig: this.config })
    
    return this.theme({
      extend: {
        ...((this.config.theme?.extend) ?? {}),
        ...ensuredExtend,
      }
    })
  }

  forms () {
    return this.plugin(forms as unknown as ReturnType<typeof createPlugin>)
  }

  typography () {
    return this.plugin(typography)
  }

  lineClamp () {
    return this.plugin(lineClamp)
  }
  
  aspectRatio () {
    return this.plugin(aspectRatio)
  }
  // baleadaComponents () {
  //   this.plugin(baleadaComponents)
  // }
}

type GetThemeApi = {
  defaultConfig: Config,
  currentConfig: Partial<Config>,
  colors: typeof colors,
  resolveConfig: typeof resolveConfig,
  themeUtils: typeof themeUtils,
  getLinearNumeric: typeof getLinearNumeric,
}

function ensureTheme ({ themeRaw, currentConfig }: { themeRaw: Config['theme'] | ((api: GetThemeApi) => Config['theme']), currentConfig: Partial<Config> }): Config['theme'] {
  return typeof themeRaw === 'function'
    ? themeRaw({ defaultConfig, currentConfig, colors, resolveConfig, themeUtils, getLinearNumeric })
    : themeRaw
}


type PluginMethod = {
  (plugin: ReturnType<typeof createPlugin>): Tailwindcss,
  custom: (plugin: Parameters<typeof createPlugin>[0]) => Tailwindcss
}

function createPluginMethod (addPlugin: (plugin: ReturnType<typeof createPlugin>) => Tailwindcss): PluginMethod {
  function plugin (plugin: ReturnType<typeof createPlugin>) {
    return addPlugin(plugin)
  }

  function custom (customPlugin: Parameters<typeof createPlugin>[0]) {
    return addPlugin(createPlugin(customPlugin))
  }

  plugin.custom = custom

  return plugin
}
