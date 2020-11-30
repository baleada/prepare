import configureable from './src/configureable.js'

const shared = configureable()
        .input('src/index.js')
        .resolve()
        .virtualIndex('src/index.js')
        .external([
          '@rollup/plugin-babel',
          '@rollup/plugin-commonjs',
          '@rollup/plugin-json',
          '@rollup/plugin-node-resolve',
          'rollup-plugin-delete',
          'rollup-plugin-vue',
          'rollup-plugin-analyzer',
          '@baleada/rollup-plugin-virtual',
          '@baleada/rollup-plugin-source-transform',
          '@baleada/source-transform-files-to-index',
          'puppeteer-core',
          
          // Not necessary, since these aren't imported, but I want to be explicit about package dependencies here
          '@babel/preset-env',
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-transform-runtime',
        ]),
      esm = shared
        .delete({ targets: 'lib/*', verbose: true })
        .esm({ file: 'lib/index.js', target: 'node' })
        .analyze()
        .configure(),
      cjs = shared
        .cjs({ file: 'lib/index.cjs' })
        .configure(),
      test = configureable()
        .input('src/index.js')
        .resolve()
        .sourceTransform({
          test: ({ source }) => source === '',
          transform: ({ id, source }) => {
            console.log(id)
            return readFileSync(id, 'utf8')
          }
        })
        .json()
        .commonjs()
        .virtualIndex('src/index.js')
        .esm({ file: 'tests/fixtures/TEST_BUNDLE.js', target: 'node' })
        .configure()

export default [
  esm,
  cjs,
  // test,
]
