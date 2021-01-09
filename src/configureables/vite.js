import { resolve } from 'path'
import rollup from './rollup.js'
import vue from '@vitejs/plugin-vue'

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
  
  object.rollup = callback => configureable({
    ...config,
    rollupOptions: callback(rollup(config.rollupOptions || {})),
  })

  object.plugin = plugin => configureable({
    ...config,
    plugins: [
      ...config.plugins || [],
      plugin
    ]
  })

  object.vue = (...args) => object.plugin(vue(...args))

  object.resolve = (...args) => object.plugin(rollup().resolve(...args).configure().plugins[0])
  object.sourceTransform = (...args) => object.plugin(rollup().sourceTransform(...args).configure().plugins[0])
  object.virtual = (...args) => object.plugin(rollup().virtual(...args).configure().plugins[0])
  object.virtual.index = (...args) => object.plugin(rollup().virtual.index(...args).configure().plugins[0])
  object.virtual.routes = (...args) => object.plugin(rollup().virtual.routes(...args).configure().plugins[0])

  object.includeDeps = deps => configureable({
    ...config,
    optimizeDeps: {
      include: [
        ...(config.optimizeDeps?.include || []),
        ...deps,
      ],
      exclude: [
        ...(config.optimizeDeps?.exclude || []),
      ]
    }
  })
  object.excludeDeps = deps => configureable({
    ...config,
    optimizeDeps: {
      exclude: [
        ...(config.optimizeDeps?.exclude || []),
        ...deps,
      ],
      include: [
        ...(config.optimizeDeps?.include || []),
      ]
    }
  })

  return object
}

function ensureAliases (rawAliases) {
  return typeof rawAliases === 'function'
    ? rawAliases({ resolve, basePath: resolve('') })
    : rawAliases
}
