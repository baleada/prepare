import baleadaTheme from '@baleada/tailwind-theme'
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

  object.purge = paths => configureable({
    ...config,
    purge: {
      content: {
        ...(config.purge?.content ?? []),
        ...paths
      }
    }
  })

  object.theme = theme => configureable({
    ...config,
    theme: {
      ...(config.theme ?? {}),
      ...theme,
    }
  })
  object.baleadaTheme = () => object.theme(baleadaTheme)
  object.theme.override = ({ property, values: rawValues }, usesContext) => {
    const values = ensureValues({ rawValues, usesContext })
    return object.theme({
      [property]: typeof values === 'function' ? values : {
        ...(config.theme?.[property] ?? {}),
        ...values,
      }
    })
  }
  object.theme.extend = ({ property, values: rawValues }, usesContext) => {
    const values = ensureValues({ rawValues, usesContext })
    return object.theme({
      extend: {
        ...(config.theme?.extend ?? {}),
        [property]: {
          ...(config.theme?.[property] ?? {}),
          ...values,
        }
      }
    })
  }
  
  object.variants = variants => configureable({
    ...config,
    variants: {
      ...(config.variants ?? {}),
      ...variants,
    }
  })
  object.variants.override = ({ property, values: rawValues }, usesContext) => {
    const values = ensureValues({ rawValues, usesContext })
    return object.variants({
      [property]: values
    })
  }
  object.variants.extend = ({ property, values: rawValues }, usesContext) => {
    const values = ensureValues({ rawValues, usesContext })
    return object.variants({
      extend: {
        ...(config.variants?.extend ?? {}),
        [property]: values,
      }
    })
  }

  object.plugin = (plugin, usesContext) => configureable({
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

function ensureValues ({ rawValues, usesContext }) {
  if (usesContext) {
    return rawValues({ defaultConfig, colors, resolveConfig, themeUtils, linearNumeric, baleadaTheme })
  }

  return rawValues
}
