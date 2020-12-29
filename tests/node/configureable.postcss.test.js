import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import configureable from '../../src/configureables/postcss.js'

const suite = createSuite('configureable.postcss (node)')

suite(`configures import plugin`, context => {
  const value = configureable()
          .import()
          .configure()
  
  assert.ok(value.plugins[0])
})

suite(`configures nested plugin`, context => {
  const value = configureable()
          .nested()
          .configure()
  
  assert.ok(value.plugins[0])
})

suite(`configures tailwindcss plugin`, context => {
  const value = configureable()
          .tailwindcss()
          .configure()
  
  assert.ok(value.plugins[0])
})

suite(`configures presetEnv plugin`, context => {
  const value = configureable()
          .presetEnv()
          .configure()
  
  assert.ok(value.plugins[0])
})

suite.run()
