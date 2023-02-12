// import baleadaComponents from '@baleada/tailwind-components'
import { getLinearNumeric } from '@baleada/tailwind-linear-numeric'
import * as themeUtils from '@baleada/tailwind-theme-utils'
import forms from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'
import containerQueries from '@tailwindcss/container-queries'
import lineClamp from '@tailwindcss/line-clamp'
import typography from '@tailwindcss/typography'
import { plugin as ancestorVariants, toTheme as toAncestorVariantsTheme } from '@baleada/tailwind-ancestor-variants'
import type { AncestorVariantsOptions } from '@baleada/tailwind-ancestor-variants'
import { plugin as utilities, toDimensionTheme, toStretchHeightTheme, toStretchWidthTheme } from '@baleada/tailwind-utilities'
import type { UtilitiesOptions } from '@baleada/tailwind-utilities'
import defaultConfig from 'tailwindcss/defaultConfig'
import colors from 'tailwindcss/colors'
import createPlugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss/types/config'
import resolveConfig from 'tailwindcss/resolveConfig'

export class Tailwindcss {
  private config: Partial<Config>
  constructor (config: Partial<Config> = {}) {
    this.config = config
  }

  configure () {
    return this.config
  }

  important () {
    this.config.important = true
    return this
  }

  darkMode (mode: Config['darkMode']) {
    this.config.darkMode = mode
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
    const narrowedTheme = narrowTheme({ theme: themeOrGetTheme, currentConfig: this.config })

    this.config.theme = {
      ...(this.config.theme ?? {}),
      ...narrowedTheme,
    }
    
    return this
  }

  extend (extendOrGetExtend: Config['theme']['extend'] | ((api: GetThemeApi) => Config['theme']['extend'])) {
    const narrowedExtend = narrowTheme({ theme: extendOrGetExtend, currentConfig: this.config })
    
    return this.theme({
      extend: {
        ...((this.config.theme?.extend) ?? {}),
        ...narrowedExtend,
      }
    })
  }

  forms (options?: Parameters<typeof forms>[0]) {
    return this.plugin(forms(options))
  }

  typography (options?: Parameters<typeof typography>[0]) {
    return this.plugin(typography(options))
  }

  lineClamp () {
    return this.plugin(lineClamp)
  }
  
  aspectRatio () {
    return this.plugin(aspectRatio)
  }

  containerQueries () {
    return this.plugin(containerQueries)
  }

  ancestorVariants (options?: AncestorVariantsOptions) {
    return this.plugin(ancestorVariants(options))
  }

  utilities (options?: UtilitiesOptions) {
    return this.plugin(utilities(options))
  }

  plugin (plugin: Config['plugins'][0]) {
    this.config.plugins = [
      ...(this.config.plugins ?? []),
      plugin
    ]

    return this
  }

  customPlugin (plugin: Parameters<typeof createPlugin>[0]) {
    return this.plugin(createPlugin(plugin))
  }
}

type GetThemeApi = {
  defaultConfig: Config,
  currentConfig: Partial<Config>,
  colors: typeof colors,
  resolveConfig: typeof resolveConfig,
  themeUtils: typeof themeUtils,
  getLinearNumeric: typeof getLinearNumeric,
  toTheme: {
    ancestorVariants: typeof toAncestorVariantsTheme,
    dimension: typeof toDimensionTheme,
    stretchHeight: typeof toStretchHeightTheme,
    stretchWidth: typeof toStretchWidthTheme,
  }
}

function narrowTheme ({ theme, currentConfig }: { theme: Config['theme'] | ((api: GetThemeApi) => Config['theme']), currentConfig: Partial<Config> }): Config['theme'] {
  return typeof theme === 'function'
    ? theme({
      defaultConfig,
      currentConfig,
      colors,
      resolveConfig,
      themeUtils,
      getLinearNumeric,
      toTheme: {
        ancestorVariants: toAncestorVariantsTheme,
        dimension: toDimensionTheme,
        stretchHeight: toStretchHeightTheme,
        stretchWidth: toStretchWidthTheme,
      }
    })
    : theme
}
