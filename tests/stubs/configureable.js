import pluginBabel from '@rollup/plugin-babel'
import pluginResolve from '@rollup/plugin-node-resolve'
import pluginCommonjs from '@rollup/plugin-commonjs'
import pluginJson from '@rollup/plugin-json'
import pluginDelete from 'rollup-plugin-delete'
import pluginVue from 'rollup-plugin-vue'
import pluginAnalyze from 'rollup-plugin-analyzer'
import pluginVirtual from '@baleada/rollup-plugin-virtual'
import pluginSourceTransform from '@baleada/rollup-plugin-source-transform'
import createFilesToIndex from '@baleada/source-transform-files-to-index'
import { 
  babelConfigBrowser,
  babelConfigNode,
} from '../fixtures/configureable'

// Generic
export const input = 'src/index.js'
export const plugin = { name: 'stub' }
export const outputEsm = { file: 'lib/index.esm.js', format: 'esm' }
export const outputCjs = { file: 'lib/index.js', format: 'cjs' }
export const external = 'stub'

// Plugins with no required params
export const resolve = pluginResolve()
export const commonjs = pluginCommonjs()
export const json = pluginJson()
export const vue = pluginVue()
export const analyze = pluginAnalyze()
export const del = pluginDelete()

// Plugins with required params
export const baleadaTransformPluginRequiredParam = {
  test: () => true,
  transform: () => '',
}
export const virtual = pluginVirtual(baleadaTransformPluginRequiredParam)
export const sourceTransform = pluginSourceTransform(baleadaTransformPluginRequiredParam)
export const virtualIndex = pluginVirtual({ test: ({ id }) => id.endsWith(input), transform: createFilesToIndex() })
export const babelNode = pluginBabel(babelConfigNode)
export const babelBrowser = pluginBabel(babelConfigBrowser)

// Formats
export const esmBrowser = {
  output: [
    outputEsm
  ],
  plugins: [
    babelBrowser
  ]
}
export const esmNode = {
  output: [
    outputEsm
  ],
  plugins: [
    babelNode
  ]
}
export const cjs = {
  output: [
    outputCjs
  ],
  plugins: [
    babelNode
  ]
}
