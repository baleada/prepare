import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import configureable from '../../src/configureable.js'
import koaFactory from '../../src/configureables/koa.js'
import rollupFactory from '../../src/configureables/rollup.js'
import viteFactory from '../../src/configureables/vite.js'

const suite = createSuite('configureable')

suite(`looks up configureables`, context => {
  const koa = Object.keys(configureable('koa')),
        rollup = Object.keys(configureable('rollup')),
        vite = Object.keys(configureable('vite'))
  
  assert.equal(koa, Object.keys(koaFactory()))
  assert.equal(rollup, Object.keys(rollupFactory()))
  assert.equal(vite, Object.keys(viteFactory()))
})

suite.run()
