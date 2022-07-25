import { resolve } from 'path'
import { Rollup } from './Rollup'
import vue from '@vitejs/plugin-vue'
import type { Options as VueOptions } from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import type { Options as ReactOptions } from '@vitejs/plugin-react'
import pages from 'vite-plugin-pages'
import inspect, { Options as InspectOptions } from 'vite-plugin-inspect'
import type { UserOptions as PagesOptions } from 'vite-plugin-pages'
import type { RollupNodeResolveOptions as ResolveOptions } from '@rollup/plugin-node-resolve'
import type { Options as VirtualOptions } from '@baleada/rollup-plugin-virtual'
import type {
  UserConfig,
  AliasOptions,
  BuildOptions,
  PluginOption,
} from 'vite'

export class Vite {
  private config: UserConfig & BuildOptions
  virtual: VirtualMethod
  constructor (config = {}) {
    this.config = config
    this.virtual = createVirtualMethod(this.plugin.bind(this))
  }

  configure () {
    return this.config
  }

  alias (aliasesOrConfigureAliases: AliasOptions | (({ resolve, basePath }: { resolve: Resolve, basePath: string }) => AliasOptions)) {
    this.config.resolve = {
      alias: {
        ...(this.config.resolve?.alias ?? {}),
        ...ensureAliases(aliasesOrConfigureAliases),
      }
    }

    return this
  }

  includeDeps (deps: string[]) {
    this.config.optimizeDeps = {
      include: [
        ...(this.config.optimizeDeps?.include ?? []),
        ...deps,
      ],
      exclude: this.config.optimizeDeps?.exclude ?? [],
    }
    
    return this
  }

  excludeDeps (deps: string[]) {
    this.config.optimizeDeps = {
      exclude: [
        ...(this.config.optimizeDeps?.exclude ?? []),
        ...deps,
      ],
      include: this.config.optimizeDeps?.include ?? [],
    }
    
    return this
  }
  
  rollup (configureRollup: ({ configureable }: { configureable: Rollup }) => BuildOptions['rollupOptions']) {
    this.config.rollupOptions = configureRollup({ configureable: new Rollup() })
    return this
  }

  plugin (plugin: PluginOption | PluginOption[]) {
    this.config.plugins = [
      ...(this.config.plugins || []),
      plugin
    ]
    
    return this
  }

  vue (options?: VueOptions) {
    return this.plugin(vue(options))
  }
  
  react (options?: ReactOptions) {
    return this.plugin(react(options))
  }
  
  pages (options?: PagesOptions) {
    return this.plugin(pages(options))
  }

  inspect (options?: InspectOptions) {
    return this.plugin(inspect(options))
  }

  resolve (options?: ResolveOptions) {
    return this.plugin(
      new Rollup()
        .resolve(options)
        .configure()
        .plugins[0]
    )
  }

  sourceTransform (options?: any) {
    return this.plugin(
      new Rollup()
        .sourceTransform(options)
        .configure()
        .plugins[0]
    )
  }

  // Virtual handled separately, to allow for sub methods
}

type VirtualMethod = {
  (options: VirtualOptions): Vite,
}

function createVirtualMethod (plugin: (plugin: PluginOption) => Vite): VirtualMethod {
  function virtual (options: VirtualOptions) {
    return plugin(
      new Rollup()
        .virtual(options)
        .configure()
        .plugins[0]
    )
  }
  
  return virtual
}

type Resolve = typeof resolve
function ensureAliases (rawAliases: AliasOptions | (({ resolve, basePath }: { resolve: Resolve, basePath: string }) => AliasOptions)): AliasOptions {
  return typeof rawAliases === 'function'
    ? rawAliases({ resolve, basePath: resolve('') })
    : rawAliases
}
