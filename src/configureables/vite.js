import { resolve } from 'path'
import koa from './koa.js'
import rollup from './rollup.js'

export default function configureable (config = {}) {
  const object = {}

  // Return the final config
  object.configure = () => config

  object.alias = rawAliases => configureable({
    ...config,
    alias: {
      ...(config.alias || {}),
      ...ensureAliases(rawAliases),
    }
  })

  object.transform = transform => configureable({
    ...config,
    transforms: [
      ...(config.transforms || []),
      transform,
    ]
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

function ensureAliases (rawAliases) {
  return typeof rawAliases === 'function'
    ? rawAliases({ resolve, basePath: resolve('') })
    : rawAliases
}
