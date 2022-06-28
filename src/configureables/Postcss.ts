import atImport from 'postcss-import'
import nesting from 'tailwindcss/nesting'
// import presetEnv from 'postcss-preset-env'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import type { PluginCreator } from 'postcss'

type PluginsItem = PluginCreator<any> | [plugin: PluginCreator<any>, options: any]

export class Postcss {
  constructor (private config: { plugins: PluginsItem[] } = { plugins: [] }) {}

  configure () {
    return this.config
  }

  plugin (plugin: PluginCreator<any>, options?: any) {
    this.config.plugins.push(options ? [plugin, options] : plugin)
    return this
  }

  import () {
    return this.plugin(atImport)
  }

  nesting () {
    return this.plugin(nesting)
  }

  tailwindcss () {
    return this.plugin(tailwindcss as unknown as PluginCreator<any>)
  }

  autoprefixer () {
    return this.plugin(autoprefixer)
  }
}

