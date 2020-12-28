import configureable from './src/configureable.js'

const shared = configureable('rollup')
        .input('src/index.js')
        .resolve()
        .virtualIndex('src/index.js', { test: ({ id }) => /src\/\w+\.js$/.test(id) })
        .external([
          '@rollup/plugin-babel',
          '@rollup/plugin-commonjs',
          '@rollup/plugin-json',
          '@rollup/plugin-node-resolve',
          '@rollup/plugin-typescript',
          'rollup-plugin-delete',
          'rollup-plugin-vue',
          'rollup-plugin-analyzer',
          '@baleada/rollup-plugin-virtual',
          '@baleada/rollup-plugin-source-transform',
          '@baleada/source-transform-files-to-index',
          '@baleada/source-transform-files-to-routes',
          '@baleada/markdown-it-spa-links',
          '@baleada/markdown-it-prose-container',
          '@baleada/markdown-it-text-content',
          'markdown-it',
          'refractor',
          'rehype',
          'markdown-it-link-attributes',
          '@baleada/vite-serve-virtual',
          '@baleada/vite-serve-as-vue',
          'puppeteer-core',
          'path',
          
          // Not necessary, since these aren't imported, but I want to be explicit about package dependencies here
          '@babel/preset-env',
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator',
          '@babel/plugin-transform-runtime',
        ]),
      esm = shared
        .delete({ targets: 'lib/*', verbose: true })
        .esm({ file: 'lib/index.js', target: 'node' })
        .analyze()
        .configure(),
      cjs = shared
        .cjs({ file: 'lib/index.cjs' })
        .configure()

export default [
  esm,
  cjs,
]
