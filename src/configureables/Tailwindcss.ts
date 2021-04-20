// @ts-ignore
import baleada from '@baleada/tailwind-theme'
// import baleadaComponents from '@baleada/tailwind-components'
// @ts-ignore
import linearNumeric from '@baleada/tailwind-linear-numeric'
// @ts-ignore
import * as themeUtils from '@baleada/tailwind-theme-utils'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import lineClamp from '@tailwindcss/line-clamp'
import aspectRatio from '@tailwindcss/aspect-ratio'
import defaultConfig from 'tailwindcss/defaultConfig.js'
import colors from 'tailwindcss/colors.js'
import createPlugin from 'tailwindcss/plugin.js'
import resolveConfig from 'tailwindcss/resolveConfig.js'
import { TailwindConfig, TailwindFontConfig } from 'tailwindcss/tailwind-config'
// import type { PurgeCSS } from 'purgecss'

type Config = {
  mode?: 'jit',
  purge?:
    string[]
    // | 
    // {
    //   mode?: 'all',
    //   enabled?: boolean,
    //   preserveHtmlElements?: boolean,
    //   layers?: ('base' | 'components' | 'utilities')[],
    //   content?: string[],
    //   options?: PurgeCSS['options'],
    // },
  theme?: Record<string, TailwindThemePluginConfig | TailwindTheme>,
  variants?: {
    [plugin: string]: string[],
  }
  plugins?: TailwindPlugin[],
  important?: true
}

type TailwindTheme = { [plugin: string]: TailwindThemePluginConfig }
type TailwindThemePluginConfig = Record<string | number, TailwindThemeValue | TailwindThemeClosure>
type TailwindThemeClosure = (api: any) => TailwindThemeValue
type TailwindThemeValue = 
  string // Most plugins
  | TailwindFontConfig // custom lineheight
  | string[] // Font family
  | { [hue: string]: Record<string | number, string> } // Colors


type TailwindPlugin = TailwindPluginWithOptions | TailwindPluginWithoutOptions // TODO: Improve
type TailwindPluginWithOptions = Function
type TailwindPluginWithoutOptions = { handler: any, config: any }
type TailwindCustomPlugin = (api: CreatePluginApi) => TailwindPlugin
type CreatePluginApi = {
  postcss: Function,
  config: Function,
  theme: Function,
  corePlugins: Function,
  variants: Function,
  e: Function,
  prefix: Function,
  addUtilities: Function,
  addComponents: Function,
  addBase: Function,
  addVariant: Function,
}

export class Tailwindcss {
  private config: Config
  plugin: PluginMethod
  constructor (config: Config = {}) {
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

  jit () {
    this.config.mode = 'jit'
    return this
  }

  important () {
    this.config.important = true
    return this
  }

  purge (paths: string[]) {
    this.config.purge = [
      ...(this.config.purge ?? []),
      ...paths,
    ]
    return this
  }

  theme (themeOrConfigureTheme: TailwindTheme | ((api: ConfigureThemeApi) => TailwindTheme)) {
    const ensuredTheme = ensureTheme({ themeRaw: themeOrConfigureTheme, currentConfig: this.config })

    this.config.theme = {
      ...(this.config.theme ?? {}),
      ...ensuredTheme,
    }
    
    return this
  }

  baleada () {
    return this.theme(baleada)
  }

  extend (extendOrConfigureExtend: TailwindTheme | ((api: ConfigureThemeApi) => TailwindTheme)) {
    const ensuredExtend = ensureTheme({ themeRaw: extendOrConfigureExtend, currentConfig: this.config })
    
    return this.theme({
      extend: {
        ...((this.config.theme?.extend as TailwindTheme) ?? {}),
        ...ensuredExtend,
      } as unknown as TailwindThemePluginConfig
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

type ConfigureThemeApi = {
  defaultConfig: TailwindConfig,
  currentConfig: Config,
  colors: typeof colors,
  resolveConfig: typeof resolveConfig,
  themeUtils: any,
  linearNumeric: any,
  baleada: any,
}

function ensureTheme ({ themeRaw, currentConfig }: { themeRaw: TailwindTheme | ((api: ConfigureThemeApi) => TailwindTheme), currentConfig: Config }): TailwindTheme {
  return typeof themeRaw === 'function'
    ? themeRaw({ defaultConfig, currentConfig, colors, resolveConfig, themeUtils, linearNumeric, baleada })
    : themeRaw
}


type PluginMethod = {
  (plugin: TailwindPlugin): Tailwindcss,
  custom: (plugin: TailwindCustomPlugin) => Tailwindcss
}

function createPluginMethod (addPlugin: (plugin: TailwindPlugin) => Tailwindcss): PluginMethod {
  function plugin (plugin: TailwindPlugin) {
    return addPlugin(plugin)
  }

  function custom (customPlugin: TailwindCustomPlugin) {
    return addPlugin(createPlugin(customPlugin))
  }

  plugin.custom = custom

  return plugin
}
