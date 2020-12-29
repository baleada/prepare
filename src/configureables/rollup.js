import { babel } from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import del from 'rollup-plugin-delete'
import vue from 'rollup-plugin-vue'
import analyze from 'rollup-plugin-analyzer'
import virtual from '@baleada/rollup-plugin-virtual'
import sourceTransform from '@baleada/rollup-plugin-source-transform'
import createFilesToIndex from '@baleada/source-transform-files-to-index'
import createFilesToRoutes from '@baleada/source-transform-files-to-routes'

export default function configureable (config = {}) {
  const object = {}

  // Return the final config
  object.configure = () => config  

  // Generic
  object.input = file => configureable({ ...config, input: file }),
  object.output = output => configureable(push({ config, array: 'output', value: output }))
  object.external = external => configureable(push({ config, array: 'external', value: external }))
  object.plugin = plugin => configureable(push({ config, array: 'plugins', value: plugin }))
  object.plugin.api = {
    createFilesToIndex,
    createFilesToRoutes,
  }
  
  // Simple plugin additions
  object.resolve = (...args) => object.plugin(resolve(...args))
  object.commonjs = (...args) => object.plugin(commonjs(...args))
  object.json = (...args) => object.plugin(json(...args))
  object.vue = (...args) => object.plugin(vue(...args))
  object.delete = (...args) => object.plugin(del(...args))
  object.analyze = (...args) => object.plugin(analyze(...args))
  object.virtual = (...args) => object.plugin(virtual(ensureVirtualParams(...args)))
  object.sourceTransform = (...args) => object.plugin(sourceTransform(...args))

  // Babel
  object.toBabelConfig = ({ target, format }) => {
    const sharedConfig = {
      plugins: [
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
        [
          '@babel/plugin-transform-runtime',
          { useESModules: format === 'esm' }
        ]
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
                targets: 'supports es6-module',
                modules: false,
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
                modules: false,
              },
            ],
          ],
          ...sharedConfig,
        }
    }
  }
  object.babel = ({ target, format }) => object
    .plugin(babel(object.toBabelConfig(({ target, format }))))
    .external(/@babel\/runtime/)


  // Typescript
  object.toTypeScriptConfig = () => ({})
  object.typescript = (...args) => object.plugin(typescript(...args))

  // Frequently needed virtual files
  object.virtualIndex = (path, createFilesToIndexOptions = {}) => {
    return object.virtual(({ toEndsWithRETest }) => ({
      test: toEndsWithRETest(path),
      transform: createFilesToIndex({ test: () => true, ...createFilesToIndexOptions }),
    }))
  }
  object.virtualRoutes = ({ path, router }, createFilesToRoutesOptions = {}) => {
    return object.virtual(({ toEndsWithRETest }) => ({
      test: toEndsWithRETest(path),
      transform: createFilesToRoutes(router, { test: () => true, ...createFilesToRoutesOptions }),
    }))
  }

  // Standard configs for formats
  object.esm = ({ file, target }) => {
    return object
      .output({ file, format: 'esm' })
      .babel({ target, format: 'esm' })
  }

  object.cjs = ({ file }) => {
    return object
      .output({ file, format: 'cjs' })
      .babel({ target: 'node', format: 'cjs' })
  }

  object.ts = ({ file }) => {
    return object
      .output({ file })
      .typescript()
  }

  return object
}

export function push ({ config, array, value }) {
  return {
    ...config,
    [array]: [
      ...(config[array] || []),
      ...ensureArray(value)
    ]
  }
}

function ensureArray (unknown) {
  return Array.isArray(unknown)
    ? unknown
    : [unknown]
}

function ensureVirtualParams (rawParams) {
  return typeof rawParams === 'function'
    ? rawParams({ toEndsWithRETest })
    : rawParams
}

function toEndsWithRETest (path) {
  return ({ id }) => (new RegExp(`(^|\/)${path}$`)).test(id)
}
