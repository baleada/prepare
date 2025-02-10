import type { Options as VirtualOptions } from '@baleada/rollup-plugin-virtual'
import type { RollupNodeResolveOptions as ResolveOptions } from '@rollup/plugin-node-resolve'
import type { Options as ReactOptions } from '@vitejs/plugin-react'
import react from '@vitejs/plugin-react'
import type { Options as VueOptions } from '@vitejs/plugin-vue'
import vue from '@vitejs/plugin-vue'
import type { Options as VueJsxOptions } from '@vitejs/plugin-vue-jsx'
import vueJsx from '@vitejs/plugin-vue-jsx'
import type { Options as VueMacrosOptions } from 'unplugin-vue-macros'
import vueMacros from 'unplugin-vue-macros/vite'
import type {
  AliasOptions,
  BuildOptions,
  PluginOption,
  UserConfig,
} from 'vite'
import lightningcss from 'vite-plugin-lightningcss'
import type { UserOptions as PagesOptions } from 'vite-plugin-pages'
import pages from 'vite-plugin-pages'
import { toFn } from '../toFn'
import { Rollup } from './Rollup'

export class Vite {
  private config: UserConfig & BuildOptions
  virtual: VirtualMethod
  constructor (config = {}) {
    this.config = config
    this.virtual = createVirtualMethod(this.plugin.bind(this))
  }

  configure () {
    this.configureVue()
    this.configureVueJsx()
    this.configureVueMacros()
    return this.config
  }

  alias (aliases: AliasOptions) {
    this.config.resolve = {
      alias: aliases,
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

  private configuresVue = false
  private vueOptions: VueOptions
  vue (options?: VueOptions) {
    this.configuresVue = true
    this.vueOptions = options
    return this
  }
  private configureVue () {
    if (!this.configuresVue || this.configuresVueMacros) return 
    this.plugin(toFn(vue)(this.vueOptions))
  }

  private configuresVueJsx = false
  private vueJsxOptions: VueJsxOptions
  vueJsx (options?: VueJsxOptions) {
    this.configuresVueJsx = true
    this.vueJsxOptions = options
    return this
  }
  private configureVueJsx () {
    if (!this.configuresVueJsx || this.configuresVueMacros) return
    this.plugin(toFn(vueJsx)(this.vueJsxOptions))
  }

  private configuresVueMacros = false
  private vueMacrosOptions: VueMacrosOptions
  vueMacros (options?: Omit<VueMacrosOptions, 'plugins'>) {
    this.configuresVueMacros = true
    this.vueMacrosOptions = options
    return this
  }
  private configureVueMacros () {
    if (!this.configuresVueMacros) return
    this.plugin(toFn(vueMacros)({
      ...this.vueMacrosOptions,
      plugins: {
        ...this.vueMacrosOptions?.plugins,
        vue: this.configuresVue ? toFn(vue)(this.vueOptions) : undefined,
        vueJsx: this.configuresVueJsx ? toFn(vueJsx)(this.vueJsxOptions) : undefined,
      }
    }))
  }
  
  react (options?: ReactOptions) {
    return this.plugin(toFn(react)(options))
  }
  
  pages (options?: PagesOptions) {
    return this.plugin(toFn(pages)(options))
  }

  lightningcss (options?: Parameters<typeof lightningcss>[0]) {
    return this.plugin(toFn(lightningcss)(options))
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
