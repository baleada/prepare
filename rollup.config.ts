import { configureable } from './src/configureable'

const shared = new configureable.Rollup()
        .input([
          'src/configureable.ts',
          'src/getIcons.ts',
          'src/Testable.ts',
          'src/withPuppeteer.ts'
        ])
        .resolve()
        .external([
          // rollup
          '@rollup/plugin-babel',
          '@rollup/plugin-commonjs',
          '@rollup/plugin-json',
          '@rollup/plugin-node-resolve',
          '@rollup/plugin-multi-entry',
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
        .analyzer()
        .configure(),
      cjs = shared
        .cjs({ file: 'lib/index.cjs' })
        .configure()

export default [
  esm,
  cjs,
]
