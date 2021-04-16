import { resolve } from 'path'
import { Rollup } from './Rollup'
import vue from '@vitejs/plugin-vue'
import type { Options as VueOptions } from '@vitejs/plugin-vue'
import type { RollupNodeResolveOptions as ResolveOptions } from '@rollup/plugin-node-resolve'
import type {
  UserConfig,
  AliasOptions,
  BuildOptions,
  PluginOption,
} from 'vite'

export class Vite {
  private config: UserConfig & BuildOptions
  virtual: Virtual
  constructor (config = {}) {
    this.config = config
    this.virtual = createVirtual()
  }

  configure () {
    return this.config
  }

  alias (aliases) {
    this.config.resolve = {
      alias: {
        ...(this.config.resolve?.alias ?? {}),
        ...ensureAliases(aliases),
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
  
  rollup (configureRollup: ({ rollup }: { rollup: Rollup }) => BuildOptions['rollupOptions']) {
    this.config.rollupOptions = configureRollup({ rollup: new Rollup() })
    return this
  }

  plugin (plugin: PluginOption) {
    this.config.plugins = [
      ...(this.config.plugins || []),
      plugin
    ]
    
    return this
  }

  vue (options?: VueOptions) {
    return this.plugin(vue(options))
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

type Virtual = {
  (options: Record<any, any>): Vite,
  routes: ({ path, router }: { path: string, router: string }, createFilesToRoutesOptions?: Record<any, any>) => Vite,
}

function createVirtual (): Virtual {
  function virtual (options: Record<any, any>) {
    return (this as Vite).plugin(virtual(options))
  }

  // TODO: better types
  function routes ({ path, router }: { path: string, router: string }, createFilesToRoutesOptions: Record<any, any> = {}) {
    return (this as Vite).plugin(
      new Rollup()
        .virtual.routes({ path, router }, createFilesToRoutesOptions)
        .configure()
        .plugins[0]
    )
  }

  virtual.routes = routes
  
  return virtual
}

type Resolve = typeof resolve
function ensureAliases (rawAliases: AliasOptions | (({ resolve, basePath }: { resolve: Resolve, basePath: string }) => AliasOptions)): AliasOptions {
  return typeof rawAliases === 'function'
    ? rawAliases({ resolve, basePath: resolve('') })
    : rawAliases
}
