import baleada from '@baleada/tailwind-theme'
// import baleadaComponents from '@baleada/tailwind-components'
import linearNumeric from '@baleada/tailwind-linear-numeric'
import * as themeUtils from '@baleada/tailwind-theme-utils'
import forms from '@tailwindcss/forms'
// import typography from '@tailwindcss/typography'
import defaultConfig from 'tailwindcss/defaultConfig.js'
import colors from 'tailwindcss/colors.js'
import createPlugin from 'tailwindcss/plugin.js'
import resolveConfig from 'tailwindcss/resolveConfig.js'

export default function configureable (config = {}) {
  const object = {}
  
  object.configure = () => config

  object.important = () => configureable({ ...config, important: true })

  object.purge = paths => configureable({
    ...config,
    purge: {
      content: [
        ...(config.purge?.content ?? []),
        ...paths,
      ]
    }
  })

  object.theme = theme => {
    const ensuredTheme = ensureTheme({ rawTheme: theme, currentConfig: config })
    return configureable({
      ...config,
      theme: {
        ...(config.theme ?? {}),
        ...ensuredTheme,
      }
    })
  }
  object.baleada = () => object.theme(baleada)
  object.theme.extend = theme => {
    const ensuredTheme = ensureTheme({ rawTheme: theme, currentConfig: config })
    return object.theme({
      extend: {
        ...(config.theme?.extend ?? {}),
        ...ensuredTheme,
      }
    })
  }
  
  object.variants = variants => {
    const ensuredVariants = ensureVariants({ rawVariants: variants, currentConfig: config })
    return configureable({
      ...config,
      variants: {
        ...(config.variants ?? {}),
        ...ensuredVariants,
      }
    })
  }
  object.variants.extend = variants => {
    const ensuredVariants = ensureVariants({ rawVariants: variants, currentConfig: config })
    return object.variants({
      extend: {
        ...(config.variants?.extend ?? {}),
        ...ensuredVariants,
      }
    })
  }

  object.plugin = plugin => configureable({
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      createPlugin(plugin),
    ]
  })
  object.forms = () => object.plugin(forms)
  // object.typography = () => object.plugin(typography)
  // object.baleadaComponents = () => object.plugin(baleadaComponents)
  
  object.preset = preset => configureable({
    ...config,
    presets: [
      ...(config.presets ?? []),
      preset,
    ]
  })

  return object
}

function ensureTheme ({ rawTheme, currentConfig }) {
  return typeof rawTheme === 'function'
    ? rawTheme({ defaultConfig, currentConfig, colors, resolveConfig, themeUtils, linearNumeric, baleada })
    : rawTheme
}

function ensureVariants ({ rawVariants, currentConfig }) {
  return typeof rawVariants === 'function'
    ? rawVariants({ defaultConfig, currentConfig, colors, resolveConfig, themeUtils, linearNumeric, baleada })
    : rawVariants
}
