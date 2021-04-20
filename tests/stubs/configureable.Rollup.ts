import { babel as pluginBabel } from '@rollup/plugin-babel'
import { 
  babelConfigBrowser,
  babelConfigNode,
} from '../fixtures/configureable.Rollup'

export const outputEsm = { file: 'lib/index.esm.js', format: 'esm' }
export const outputCjs = { file: 'lib/index.js', format: 'cjs' }
export const external = 'stub'

export const babelNode = pluginBabel(babelConfigNode)
export const babelBrowser = pluginBabel(babelConfigBrowser)

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

