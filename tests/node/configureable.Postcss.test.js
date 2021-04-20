import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { Postcss as Configureable } from '../../src/configureables/Postcss'

const suite = createSuite('configureable.Postcss (node)')

suite(`configures import plugin`, context => {
  const value = new Configureable()
          .import()
          .configure()
  
  assert.ok(value.plugins[0])
})

suite(`configures nested plugin`, context => {
  const value = new Configureable()
          .nested()
          .configure()
  
  assert.ok(value.plugins[0])
})

suite(`configures tailwindcss plugin`, context => {
  const value = new Configureable()
          .tailwindcss()
          .configure()
  
  assert.ok(value.plugins[0])
})

suite(`configures presetEnv plugin`, context => {
  const value = new Configureable()
          .presetEnv()
          .configure()
  
  assert.ok(value.plugins[0])
})

suite.run()
