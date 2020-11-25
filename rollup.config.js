import configureable from './src/configureable.js'

const shared = configureable()
  .input('src/index.js')
  .resolve()
  .virtualIndex('src/index.js')
  .external([
    '@rollup/plugin-babel',
    '@rollup/plugin-node-resolve',
    'rollup-plugin-delete',
    'rollup-plugin-vue',
    'rollup-plugin-analyzer',
    '@baleada/rollup-plugin-virtual',
    '@baleada/rollup-plugin-source-transform',
    '@baleada/source-transform-files-to-index',
    
    // Not necessary, since these aren't imported, but I want to be explicit about package dependencies here
    '@babel/preset-env',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-transform-runtime',
  ])

export default [
  shared
    .delete({ targets: 'lib/index.esm.js', verbose: true })
    .esm({ file: 'lib/index.esm.js', target: 'node' })
    .analyze()
    .configure(),
  shared
    .delete({ targets: 'lib/index.js', verbose: true })
    .cjs({ file: 'lib/index.js' })
    .configure(),
]
