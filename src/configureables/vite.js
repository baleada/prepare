import koa from './koa.js'
import rollup from './rollup.js'

export default function configureable (config = {}) {
  const object = {}

  // Return the final config
  object.configure = () => config

  object.alias = aliases => configureable({
    ...config,
    alias: {
      ...(config.alias || {}),
      ...aliases,
    }
  })

  object.koa = callback => configureable({
    ...config,
    configureServer: callback(koa(config.configureServer || [])),
  })
  
  object.rollup = callback => configureable({
    ...config,
    rollupInputOptions: callback(rollup(config.rollupInputOptions || {})),
  })

  object.rollup.vue = options => configureable({
    ...config,
    rollupPluginVueOptions: {
      ...(config.rollupPluginVueOptions || {}),
      ...options,
    }
  })

  return object
}

