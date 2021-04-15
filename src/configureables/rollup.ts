import { babel } from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import multi from '@rollup/plugin-multi-entry'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import del from 'rollup-plugin-delete'
import vue from 'rollup-plugin-vue'
import analyze from 'rollup-plugin-analyzer'
import virtual from '@baleada/rollup-plugin-virtual'
import sourceTransform from '@baleada/rollup-plugin-source-transform'
import createFilesToIndex from '@baleada/source-transform-files-to-index'
import createFilesToRoutes from '@baleada/source-transform-files-to-routes'
import { Testable } from '../Testable'
import toIconComponent from '../util/toIconComponent.js'
import toIconComponentIndex from '../util/toIconComponentIndex.js'
import type {
  InputOptions,
  OutputOptions,
  ExternalOption,
  Plugin
} from 'rollup'

export default function configureable (config = {}) {
  const object: Record<string, Function> = {}

  // Return the final config
  object.configure = () => config

  // Generic
  object.input = file => configureable({ ...config, input: file }),
  object.output = output => configureable(push({ config, array: 'output', value: output }))
  object.external = external => configureable(push({ config, array: 'external', value: external }))
  object.plugin = plugin => configureable(push({ config, array: 'plugins', value: plugin }))
  
  // Simple plugin additions
  object.resolve = (...args) => object.plugin(resolve(...args))
  object.multi = (...args) => object.plugin(multi(...args))
  object.commonjs = (...args) => object.plugin(commonjs(...args))
  object.json = (...args) => object.plugin(json(...args))
  object.vue = (...args) => object.plugin(vue(...args))
  object.delete = (...args) => object.plugin(del(...args))
  object.analyze = (...args) => object.plugin(analyze(...args))
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
  // object.toTypeScriptConfig = () => ({})
  // object.typescript = (...args) => object.plugin(typescript(...args))

  // Virtual
  object.virtual = (...args) => object.plugin(virtual(ensureVirtualParams(...args)))
  object.virtual.index = (path, createFilesToIndexOptions = {}) => object.virtual(({ testable }) => ({
    test: testable.idEndsWith(path).test,
    transform: createFilesToIndex(createFilesToIndexOptions),
  }))
  object.virtual.routes = ({ path, router }, createFilesToRoutesOptions = {}) => object.virtual(({ testable }) => ({
    test: testable.idEndsWith(path).test,
    transform: createFilesToRoutes(router, createFilesToRoutesOptions),
  }))
  // TODO: add iconExt param to support more than just .vue
  object.virtual.iconComponentIndex = ({ icons }) => object.virtual(({ testable }) => ({
    test: testable.idEndsWith('src/index.js').test,
    transform: () => toIconComponentIndex({ icons })
  }))
  object.virtual.iconComponents = ({ icons }) => object.virtual(({ testable }) => ({
    test: param => 
    icons.some(({ componentName }) => testable.idEndsWith(`src/components/${componentName}.vue`).test(param))
    &&
    testable.queryIsEmpty().test(param),
    transform: ({ id }) => toIconComponent(icons.find(({ componentName }) => id.endsWith(`${componentName}.vue`)))
  }))

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

class Rollup {
  private config: InputOptions
  private virtual: Virtual
  constructor (config = {}) {
    this.config = config
    this.virtual = new Virtual()
  }

  configure () {
    return this.config
  }

  input (file: string) {
    this.config.input = file
    return this
  }
  output (output: OutputOptions | OutputOptions[]) {
    this.config = push<OutputOptions | OutputOptions[]>({ config: this.config, array: 'output', value: output })
    return this
  }
  external (external: ExternalOption) {
    this.config = push<ExternalOption>({ config: this.config, array: 'external', value: external })
    return this
  }
  plugin (plugin: Plugin) {
    this.config = push<Plugin>({ config: this.config, array: 'plugins', value: plugin })
    return this
  }
  resolve (...args) {
    return this.plugin(resolve(...args))
  }
  multi (...args) {
    return this.plugin(multi(...args))
  }
  commonjs (...args) {
    return this.plugin(commonjs(...args))
  }
  json (...args) {
    return this.plugin(json(...args))
  }
  vue (...args) {
    return this.plugin(vue(...args))
  }
  delete (...args) {
    return this.plugin(del(...args))
  }
  analyze (...args) {
    return this.plugin(analyze(...args))
  }
  sourceTransform (...args) {
    return this.plugin(sourceTransform(...args))
  }
}

class Virtual {
  
}


export function push<Value> ({ config, array, value }: { config: InputOptions, array: string, value: Value }): InputOptions {
  return {
    ...config,
    [array]: [
      ...(config[array] || []),
      ...ensureArray(value)
    ]
  }
}

function ensureArray (unknown: unknown): any[] {
  return Array.isArray(unknown)
    ? unknown
    : [unknown]
}

function ensureVirtualParams (rawParams) {
  return typeof rawParams === 'function'
    ? rawParams({ testable: new Testable() })
    : rawParams
}
