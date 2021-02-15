import configureable from './src/configureable.js'

const shared = configureable('rollup')
        .input('src/index.js')
        .resolve()
        .virtual.index('src/index.js', { test: ({ id }) => /src\/\w+\.js$/.test(id) })
        .external([
          // rollup
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

          // source transforms
          '@baleada/source-transform-files-to-index',
          '@baleada/source-transform-files-to-routes',
          
          // markdown-it
          '@baleada/markdown-it-spa-links',
          '@baleada/markdown-it-prose-container',
          '@baleada/markdown-it-text-content',
          'markdown-it',
          'refractor',
          'rehype',
          'markdown-it-link-attributes',
          
          // vite
          '@vitejs/plugin-vue',

          // puppeteer
          'puppeteer-core',
          
          // tailwind
          '@baleada/tailwind-theme',
          '@baleada/tailwind-theme-utils',
          '@baleada/tailwind-linear-numeric',
          '@tailwindcss/forms',

          // postcss
          'postcss-import',
          'postcss-nested',
          /tailwindcss(\/|$)/,
          'autoprefixer',
          'postcss-preset-env',
          
          // babel
          '@babel/preset-env',
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator',
          '@babel/plugin-transform-runtime',

          // misc
          'parse5',
          '@rollup/pluginutils',
          'path',
          'fs',
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
