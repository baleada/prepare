import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { Vite as Configureable } from '../../src/configureables/Vite'
import { resolve } from 'path'
import type { PluginOption } from 'vite'

const suite = createSuite('configureable.Vite')

suite(`configures aliases`, () => {
  const value = new Configureable()
          .alias({ '@components': 'src/components' })
          .configure(),
        expected = {
          resolve: {
            alias: {
              '@components': 'src/components'
            }
          }
        }
  
  assert.equal(value, expected)
})

suite(`configures aliases via the configureAliases closure`, () => {
  let value = new Configureable()
        .alias(api => ({ stub: api.basePath }))
        .configure(),
      expected = {
        resolve: {
          alias: {
            stub: resolve('')
          }
        }
      }
  
  assert.equal(value, expected)
  
})

suite(`includes deps`, () => {
  const value = new Configureable()
          .includeDeps(['stub'])
          .configure(),
        expected = {
          optimizeDeps: {
            include: ['stub'],
            exclude: [],
          }
        }

  assert.equal(value, expected)
})

suite(`excludes deps`, () => {
  const value = new Configureable()
          .excludeDeps(['stub'])
          .configure(),
        expected = {
          optimizeDeps: {
            exclude: ['stub'],
            include: [],
          }
        }

  assert.equal(value, expected)
})

suite(`configures Rollup input options`, () => {
  const value = new Configureable()
          .rollup(({ configureable }) => configureable
            .input('src/index.js')
            .configure()
          )
          .configure(),
        expected = {
          rollupOptions: { input: 'src/index.js' }
        }
  
  assert.equal(value, expected)
})

suite(`configures plugins`, () => {
  const value = new Configureable()
          .plugin((() => {}) as unknown as PluginOption)
          .configure()

  assert.is(value.plugins.length, 1)  
})

suite(`configures vue`, context => {
  const value = new Configureable()
          .vue()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures react`, context => {
  const value = new Configureable()
          .react()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures pages`, context => {
  const value = new Configureable()
          .pages()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures resolve`, context => {
  const value = new Configureable()
          .resolve()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures sourceTransform`, context => {
  const value = new Configureable()
          .sourceTransform()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures virtual plugin`, () => {
  const value = new Configureable()
          .virtual({ test: () => true, transform: () => '' })
          .configure()

  assert.is(value.plugins.length, 1)
})

suite.run()
