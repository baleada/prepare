import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import configureable from '../../src/configureable.js'

const suite = createSuite('configureable.koa')

suite(`plugin(...) adds plugin to config`, context => {
  const value = configureable('koa')
          .plugin(() => {})
          .configure()[0]

  assert.type(value, 'function')
})

suite(`virtual(...) adds Baleada Vite Serve Virtual to config`, context => {
  const value = configureable('koa')
          .virtual({ test: () => true, transform: () => '' })
          .configure()[0]

  assert.type(value, 'function')
})

suite(`asVue(...) adds Baleada Vite Serve as Vue to config`, context => {
  const value = configureable('koa')
          .asVue({ test: () => true, toVue: () => '' })
          .configure()[0]

  assert.type(value, 'function')
})

suite(`virtualIndex(...) configures virtual index`, context => {
  const value = configureable('koa')
          .virtualIndex('src/index.js')
          .configure()[0]

  assert.type(value, 'function')
})

suite(`virtualRoutes(...) configures virtual routes`, context => {
  const value = configureable('koa')
          .virtualRoutes({ path: 'src/routes.js', router: 'vue' })
          .configure()[0]

  assert.type(value, 'function')
})

suite.run()
