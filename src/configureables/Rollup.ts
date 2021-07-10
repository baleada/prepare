import path from 'path'
import { babel } from '@rollup/plugin-babel'
import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import type { RollupNodeResolveOptions as ResolveOptions } from '@rollup/plugin-node-resolve'
import multiEntry from '@rollup/plugin-multi-entry'
import commonjs from '@rollup/plugin-commonjs'
import type { RollupCommonJSOptions as CommonJSOptions } from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import type { RollupJsonOptions as JsonOptions } from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import type { RollupTypescriptOptions as TypescriptOptions } from '@rollup/plugin-typescript'
import esbuild from 'rollup-plugin-esbuild'
import type { Options as EsbuildOptions } from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import type { Options as DtsOptions } from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import type { Options as DeleteOptions } from 'rollup-plugin-delete'
import vue from 'rollup-plugin-vue'
import type { Options as VueOptions } from 'rollup-plugin-vue'
import analyzer from 'rollup-plugin-analyzer'
import type { AnalyzerOptions } from 'rollup-plugin-analyzer'
import { virtual as pluginVirtual } from '@baleada/rollup-plugin-virtual'
import type { Options as VirtualOptions } from '@baleada/rollup-plugin-virtual'
import { sourceTransform } from '@baleada/rollup-plugin-source-transform'
import type { Options as SourceTransformOptions } from '@baleada/rollup-plugin-source-transform'
import { Testable } from '../Testable'
import { toIconComponent, toIconComponentIndex } from '../virtual-util'
import type {
  RollupOptions,
  InputOption,
  OutputOptions,
  ExternalOption,
  Plugin,
} from 'rollup'
import type { Icon } from '../getIcons'

/**
 * Configuration API for Rollup
 */
export class Rollup {
  private config: RollupOptions
  virtual: VirtualMethod
  constructor (config = {}) {
    this.config = config
    this.virtual = createVirtualMethod(this.addVirtual.bind(this))
  }

  private addVirtual (options?: VirtualOptions) {
    return this.plugin(pluginVirtual(options))
  }

  configure () {
    return this.config
  }

  input (option: InputOption) {
    this.config.input = option
    return Array.isArray(option) ? this.multiEntry() : this
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
  resolve (options?: ResolveOptions) {
    return this.plugin(resolve(options))
  }
  multiEntry (options?: any) {
    return this.plugin(multiEntry(options))
  }
  commonjs (options?: CommonJSOptions) {
    return this.plugin(commonjs(options))
  }
  json (options?: JsonOptions) {
    return this.plugin(json(options))
  }
  vue (options?: VueOptions) {
    return this.plugin(vue(options))
  }
  delete (options?: DeleteOptions) {
    return this.plugin(del(options))
  }
  analyzer (options?: AnalyzerOptions) {
    return this.plugin(analyzer(options))
  }
  sourceTransform (options?: SourceTransformOptions) {
    return this.plugin(sourceTransform(options))
  }
  typescript (options?: TypescriptOptions) {
    return this.plugin(typescript(options))
  }
  esbuild (options?: EsbuildOptions) {
    return this.plugin(esbuild(options))
  }
  dts (options?: DtsOptions) {
    return this.plugin(dts(options))
  }

  toBabelConfig ({ target, format }: { target: 'node' | 'browser', format: 'esm' | 'cjs' }): RollupBabelInputPluginOptions {
    const sharedConfig: RollupBabelInputPluginOptions = {
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
  babel ({ target, format }: { target: 'node' | 'browser', format: 'esm' | 'cjs' }) {
    return this
      .plugin(babel(this.toBabelConfig(({ target, format }))))
      .external(/@babel\/runtime/)
  }

  esm ({ file, target }: { target: 'node' | 'browser', file: string }) {
    return this
      .output({ file, format: 'esm' })
      .babel({ target, format: 'esm' })
  }

  cjs ({ file }: { file: string }) {
    return this
      .output({ file, format: 'cjs' })
      .babel({ target: 'node', format: 'cjs' })
  }
}

type VirtualMethod = {
  (options: VirtualOptions): Rollup,
  iconComponentIndex: (...args: any[]) => Rollup
  iconComponents: (...args: any[]) => Rollup
}

function createVirtualMethod (addVirtual: (options: VirtualOptions) => Rollup): VirtualMethod {
  function virtual (options?: VirtualOptions) {
    return addVirtual(options)
  }

  function iconComponentIndex ({ icons }: { icons: Icon[] }) {
    return addVirtual({
      test: new Testable().idEndsWith('src/index.js').test,
      transform: () => toIconComponentIndex({ icons })
    })
  }

  function iconComponents ({ icons }: { icons: Icon[] }) {
    return addVirtual({
      test: api => 
        icons.some(({ componentName }) => new Testable().idEndsWith(`src/components/${componentName}.vue`).test(api))
        &&
        new Testable().queryIsEmpty().test(api),
      transform: ({ id }) => toIconComponent(icons.find(({ componentName }) => id.endsWith(`${componentName}.vue`)))
    })
  }

  virtual.iconComponentIndex = iconComponentIndex
  virtual.iconComponents = iconComponents
  
  return virtual
}

export function push<Value> ({ config, array, value }: { config: RollupOptions, array: 'plugins' | 'output' | 'external', value: Value }): RollupOptions {
  return {
    ...config,
    [array]: [
      ...((config[array] as any[]) || []),
      ...ensureArray(value)
    ]
  }
}

function ensureArray (unknown: unknown): any[] {
  return Array.isArray(unknown)
    ? unknown
    : [unknown]
}
