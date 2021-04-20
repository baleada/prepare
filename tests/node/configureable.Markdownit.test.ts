import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { Markdownit as Configureable } from '../../src/configureables/Markdownit'

const suite = createSuite('configureable.Markdownit (node)')

suite(`configures html`, context => {
  const value = new Configureable()
          .html()
          .toConfig()

  assert.is(value.html, true)  
})

suite(`configures linkify`, context => {
  const value = new Configureable()
          .linkify()
          .toConfig()

  assert.is(value.linkify, true)  
})

suite(`configures highlight`, context => {
  const value1 = new Configureable()
          .highlight('refractorRehype')
          .toConfig(),
        value2 = new Configureable()
          .highlight('refractorRehypeWithEscapedVueMustache')
          .toConfig()

  assert.ok(typeof value1.highlight === 'function')  
  assert.ok(typeof value2.highlight === 'function')  
})

suite(`configures plugins`, context => {
  const value = new Configureable()
          .plugin(() => {})
          .toConfig()

  assert.is(value.plugins.length, 1)
  assert.is(value.plugins[0].length, 2) // Stores options
})

suite(`configures plugins`, context => {
  const value = new Configureable()
          .proseContainer()
          .toConfig()

  assert.is(value.plugins.length, 1)
})
suite(`configures plugins`, context => {
  const value = new Configureable()
          .spaLinks()
          .toConfig()

  assert.is(value.plugins.length, 1)
})
suite(`configures plugins`, context => {
  const value = new Configureable()
          .textContent()
          .toConfig()

  assert.is(value.plugins.length, 1)
})
suite(`configures plugins`, context => {
  const value = new Configureable()
          .linkAttributes()
          .toConfig()

  assert.is(value.plugins.length, 1)
})

suite.run()
