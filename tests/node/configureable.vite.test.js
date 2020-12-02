import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import configureable from '../../src/configureable.js'

const suite = createSuite('configureable.vite')

suite(`configures aliases`, context => {
  const value = configureable('vite')
          .alias({ '@components': 'src/components' })
          .configure().alias,
        expected = { '@components': 'src/components' }
  
  assert.equal(value, expected)
})

suite(`configures koa`, context => {
  const value = configureable('vite')
          .koa(configureable => 
            configureable
              .virtual({ test: () => true, transform: () => '' })
              .asVue({ test: () => true, toVue: () => '' })
              .configure()
          )
          .configure().configureServer.length,
        expected = 2
  
  assert.is(value, expected)
})

suite(`configures rollup input options`, context => {
  const value = configureable('vite')
          .rollup(configureable => 
            configureable
              .input('src/index.js')
              .configure()
          )
          .configure().rollupInputOptions,
        expected = { input: 'src/index.js' }
  
  assert.equal(value, expected)
})

suite(`configures rollup plugin vue options`, context => {
  const value = configureable('vite')
          .rollup.vue({
            include: ['**/*.vue', '**/*.md']
          })
          .configure().rollupPluginVueOptions,
        expected = {
          include: ['**/*.vue', '**/*.md']
        }
  
  assert.equal(value, expected)
})

suite.run()
