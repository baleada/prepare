import { configureable } from './lib/index.js'
// import { configureable } from './src/configureable'

const shared = new configureable.Rollup()
        .input([
          'src/configureable.ts',
          'src/getIcons.ts',
          'src/Testable.ts',
          'src/withPuppeteer.ts',
          'src/virtual-util.ts',
        ])
        .external([
          // rollup
          '@rollup/plugin-babel',
          '@rollup/plugin-commonjs',
          '@rollup/plugin-json',
          '@rollup/plugin-node-resolve',
          '@rollup/plugin-multi-entry',
          '@rollup/plugin-typescript',
          'rollup-plugin-delete',
          'rollup-plugin-dts',
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
          '@tailwindcss/typography',
          '@tailwindcss/line-clamp',
          '@tailwindcss/aspect-ratio',

          // postcss
          'postcss-import',
          'postcss-nested',
          /tailwindcss(\/|$)/,
          'autoprefixer',
          
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
        ])
        .typescript()
        .resolve(),
      esm = shared
        // .delete({ targets: 'lib/*', verbose: true })
        .esm({ file: 'lib/index.js', target: 'node' })
        .analyzer()
        .configure(),
      cjs = shared
        .cjs({ file: 'lib/index.cjs' })
        .configure(),
      dts = new configureable.Rollup()
        .input([
          'types/configureable.d.ts',
          'types/getIcons.d.ts',
          'types/Testable.d.ts',
          'types/withPuppeteer.d.ts',
          'types/virtual.d-util.ts',
        ])
        .output({ file: 'lib/index.d.ts', format: 'esm' })
        .dts()
        .configure()

export default [
  esm,
  cjs,
  dts,
]

// STANDARD CONFIG
// For when lib/index.js is not available, until issues with src/configureable import are fixed.

// import multi from '@rollup/plugin-multi-entry'
// import resolve from '@rollup/plugin-node-resolve'
// import del from 'rollup-plugin-delete'
// import analyzer from 'rollup-plugin-analyzer'
// import babel from '@rollup/plugin-babel'
// import typescript from '@rollup/plugin-typescript'

// const esm = {
//   input: [
//     'src/configureable.ts',
//     'src/getIcons.ts',
//     'src/Testable.ts',
//     'src/withPuppeteer.ts',
//     'src/virtual-util.ts',
//   ],
//   external: [
//     // rollup
//     '@rollup/plugin-babel',
//     '@rollup/plugin-commonjs',
//     '@rollup/plugin-json',
//     '@rollup/plugin-node-resolve',
//     '@rollup/plugin-multi-entry',
//     '@rollup/plugin-typescript',
//     'rollup-plugin-delete',
//     'rollup-plugin-dts',
//     'rollup-plugin-vue',
//     'rollup-plugin-analyzer',
//     '@baleada/rollup-plugin-virtual',
//     '@baleada/rollup-plugin-source-transform',

//     // source transforms
//     '@baleada/source-transform-files-to-index',
//     '@baleada/source-transform-files-to-routes',
    
//     // markdown-it
//     '@baleada/markdown-it-spa-links',
//     '@baleada/markdown-it-prose-container',
//     '@baleada/markdown-it-text-content',
//     'markdown-it',
//     'refractor',
//     'rehype',
//     'markdown-it-link-attributes',
    
//     // vite
//     '@vitejs/plugin-vue',

//     // puppeteer
//     'puppeteer-core',
    
//     // tailwind
//     '@baleada/tailwind-theme',
//     '@baleada/tailwind-theme-utils',
//     '@baleada/tailwind-linear-numeric',
//     '@tailwindcss/forms',
//     '@tailwindcss/typography',
//     '@tailwindcss/line-clamp',
//     '@tailwindcss/aspect-ratio',

//     // postcss
//     'postcss-import',
//     'postcss-nested',
//     /tailwindcss(\/|$)/,
//     'autoprefixer',
    
//     // babel
//     '@babel/preset-env',
//     '@babel/plugin-proposal-optional-chaining',
//     '@babel/plugin-proposal-nullish-coalescing-operator',
//     '@babel/plugin-transform-runtime',

//     // misc
//     'parse5',
//     '@rollup/pluginutils',
//     'path',
//     'fs',
//   ],
//   output: [
//     { file: 'lib/index.js', format: 'esm' },
//   ],
//   plugins: [
//     del({ targets: 'lib/*', verbose: true }),
//     multi(),
//     resolve(),
//     typescript(),
//     babel({
//       presets: [
//         [
//           '@babel/preset-env',
//           {
//             targets: 'supports es6-module',
//             modules: false,
//           },
//         ],
//       ],
//       plugins: [
//         '@babel/plugin-proposal-nullish-coalescing-operator',
//         '@babel/plugin-proposal-optional-chaining',
//         [
//           '@babel/plugin-transform-runtime',
//           { useESModules: true }
//         ]
//       ],
//       babelHelpers: 'runtime',
//       exclude: 'node_modules/**',
//     }),
//     analyzer(),
//   ]
// }
