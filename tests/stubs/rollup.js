import pluginBabel from '@rollup/plugin-babel'
import pluginResolve from '@rollup/plugin-node-resolve'
import pluginVue from 'rollup-plugin-vue'
import pluginAnalyze from 'rollup-plugin-analyzer'
import pluginVirtual from '@baleada/rollup-plugin-virtual'
import pluginSourceTransform from '@baleada/rollup-plugin-source-transform'

export const resolve = pluginResolve()
