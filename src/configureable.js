import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import vue from 'rollup-plugin-vue'
import analyze from 'rollup-plugin-analyzer'
import virtual from '@baleada/rollup-plugin-virtual'
import sourceTransform from '@baleada/rollup-plugin-source-transform'

export function rollup (config = {}) {
  const configureable = naiveDeepClone(config)

  // Generic
  configureable.input = file => ({ ...configureable, input: file }),
  configureable.plugin = plugin => push({ config: configureable, array: 'plugin', value: plugin })
  configureable.output = output => push({ config: configureable, array: 'output', value: output })
  configureable.external = external => push({ config: configureable, array: 'external', value: external })
  
  // Simple plugin additions
  configureable.resolve = (...args) => configureable.plugin(resolve(...args))
  configureable.vue = (...args) => configureable.plugin(vue(...args))
  configureable.analyze = (...args) => configureable.plugin(analyze(...args))
  configureable.virtual = (...args) => configureable.plugin(virtual(...args))
  configureable.sourceTransform = (...args) => configureable.plugin(sourceTransform(...args))

  // Babel
  configureable.toBabelConfig = target => {
    const sharedConfig = {
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-transform-runtime',
      ],
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }

    switch (target) {
      case 'browser':
        return {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: 'supports es6-modules',
                modules: false, // Don't transform modules
              },
            ],
          ],
          ...sharedConfig,
        }
      case 'node':
        return {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { node: true },
                modules: false, // Don't transform modules
              },
            ],
          ],
          ...sharedConfig,
        }
    }
  }
  configureable.babel = target => configureable.plugin(
    babel(
      configureable.toBabelConfig(target)
    )
  )

  // ESM standard config
  configureable.esm = ({ file, target }) => {
    return configureable
      .output({ file, format: 'esm' })
      .babel(target)
  }

  configureable.cjs = ({ file }) => {
    return configureable
      .output({ file, format: 'cjs' })
      .babel('node')
  }

  return configureable
}

function naiveDeepClone (configureable) {
  return JSON.parse(JSON.stringify(configureable))
}

export function push ({ config, array, value }) {
  return {
    ...(config || {}),
    [array]: [
      ...(config[array] || []),
      ...ensureArray(value)
    ]
  }
}

function ensureArray (arrayOrNotArray) {
  return Array.isArray(arrayOrNotArray)
    ? arrayOrNotArray
    : [arrayOrNotArray]
}
