import atImport from 'postcss-import'
import nested from 'postcss-nested'
import presetEnv from 'postcss-preset-env'
import tailwindcss from 'tailwindcss'

export default function configureable (config = {}) {
  const object = {}  
  
  object.configure = () => config

  object.plugin = (...plugin) => configureable({
    ...config,
    plugins: [
      ...(config?.plugins || []),
      ...plugin,
    ],
  })

  object.import = () => object.plugin(atImport)
  object.nested = () => object.plugin(nested)
  object.tailwindcss = () => object.plugin(tailwindcss)
  object.presetEnv = options => object.plugin(presetEnv, { stage: 0, ...(options || {}) })

  return object
}
