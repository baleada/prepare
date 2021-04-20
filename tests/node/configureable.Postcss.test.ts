import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { Postcss as Configureable } from '../../src/configureables/Postcss'
import type { PluginCreator } from 'postcss'

const suite = createSuite('configureable.Postcss (node)')

suite(`configures plugins`, context => {
  const value = new Configureable()
          .plugin((() => {}) as PluginCreator<any>)
          .configure()
  
  assert.is(value.plugins.length, 1)
})

suite(`configures import plugin`, context => {
  const value = new Configureable()
          .import()
          .configure()
  
  assert.is(value.plugins.length, 1)
})

suite(`configures nested plugin`, context => {
  const value = new Configureable()
          .nested()
          .configure()
  
  assert.is(value.plugins.length, 1)
})

suite(`configures tailwindcss plugin`, context => {
  const value = new Configureable()
          .tailwindcss()
          .configure()
  
  assert.is(value.plugins.length, 1)
})

suite(`configures autoprefixer plugin`, context => {
  const value = new Configureable()
          .autoprefixer()
          .configure()
  
  assert.is(value.plugins.length, 1)
})

// suite(`configures presetEnv plugin`, context => {
//   const value = new Configureable()
//           .presetEnv()
//           .configure()
  
//   assert.is(value.plugins.length, 1)
// })

suite.run()
