// Baleada Prepare's standard rollup config depends on
// a bundled version of Baleada Prepare.
//
// This more traditional config is used to bundle that 
// pre-built version of Baleada Prepare.

import multiEntry from '@rollup/plugin-multi-entry'
import resolve from '@rollup/plugin-node-resolve'
import del from 'rollup-plugin-delete'
import analyzer from 'rollup-plugin-analyzer'
import babel from '@rollup/plugin-babel'
import esbuild from 'rollup-plugin-esbuild'
import commonjs from '@rollup/plugin-commonjs'
import { external } from './external'

const esm = {
  input: [
    'src/configureable.ts',
    'src/getIcons.ts',
    'src/Testable.ts',
    'src/withPuppeteer.ts',
    'src/virtual-util.ts',
  ],
  external,
  output: [
    { file: 'lib/index.js', format: 'esm' },
  ],
  plugins: [
    del({ targets: 'lib/*', verbose: true }),
    multiEntry(),
    commonjs(),
    esbuild(),
    resolve(),
    babel({
      presets: [
        [
          '@babel/preset-env',
          {
            targets: 'supports es6-module',
            modules: false,
          },
        ],
      ],
      plugins: [
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
        [
          '@babel/plugin-transform-runtime',
          { useESModules: true }
        ]
      ],
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
    analyzer(),
  ]
}

export default [esm]
