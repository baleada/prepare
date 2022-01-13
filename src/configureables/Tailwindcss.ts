// import baleadaComponents from '@baleada/tailwind-components'
import { getLinearNumeric } from '@baleada/tailwind-linear-numeric'
import * as themeUtils from '@baleada/tailwind-theme-utils'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import lineClamp from '@tailwindcss/line-clamp'
import aspectRatio from '@tailwindcss/aspect-ratio'
import defaultConfig from 'tailwindcss/defaultConfig'
import colors from 'tailwindcss/colors'
import createPlugin, { TailwindPlugin } from 'tailwindcss/plugin'
import resolveConfig from 'tailwindcss/resolveConfig'
import { TailwindConfig } from 'tailwindcss/tailwind-config'

export class Tailwindcss {
  private config: Partial<TailwindConfig>
  plugin: PluginMethod
  constructor (config: Partial<TailwindConfig> = {}) {
    this.config = config
    this.plugin = createPluginMethod(this.addPlugin.bind(this))
  }

  private addPlugin (plugin: TailwindPlugin) {
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

  theme (themeOrGetTheme: TailwindConfig['theme'] | ((api: GetThemeApi) => TailwindConfig['theme'])) {
    const ensuredTheme = ensureTheme({ themeRaw: themeOrGetTheme, currentConfig: this.config })

    this.config.theme = {
      ...(this.config.theme ?? {}),
      ...ensuredTheme,
    }
    
    return this
  }

  extend (extendOrGetExtend: TailwindConfig['theme']['extend'] | ((api: GetThemeApi) => TailwindConfig['theme']['extend'])) {
    const ensuredExtend = ensureTheme({ themeRaw: extendOrGetExtend, currentConfig: this.config })
    
    return this.theme({
      extend: {
        ...((this.config.theme?.extend) ?? {}),
        ...ensuredExtend,
      }
    })
  }

  forms () {
    return this.plugin(forms)
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
  defaultConfig: TailwindConfig,
  currentConfig: Partial<TailwindConfig>,
  colors: typeof colors,
  resolveConfig: typeof resolveConfig,
  themeUtils: typeof themeUtils,
  getLinearNumeric: typeof getLinearNumeric,
}

function ensureTheme ({ themeRaw, currentConfig }: { themeRaw: TailwindConfig['theme'] | ((api: GetThemeApi) => TailwindConfig['theme']), currentConfig: Partial<TailwindConfig> }): TailwindConfig['theme'] {
  return typeof themeRaw === 'function'
    ? themeRaw({ defaultConfig, currentConfig, colors, resolveConfig, themeUtils, getLinearNumeric })
    : themeRaw
}


type PluginMethod = {
  (plugin: TailwindPlugin): Tailwindcss,
  custom: (plugin: Parameters<typeof createPlugin>[0]) => Tailwindcss
}

function createPluginMethod (addPlugin: (plugin: TailwindPlugin) => Tailwindcss): PluginMethod {
  function plugin (plugin: TailwindPlugin) {
    return addPlugin(plugin)
  }

  function custom (customPlugin: Parameters<typeof createPlugin>[0]) {
    return addPlugin(createPlugin(customPlugin))
  }

  plugin.custom = custom

  return plugin
}
