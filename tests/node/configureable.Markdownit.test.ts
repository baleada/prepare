import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { Markdownit as Configureable } from '../../src/configureables/Markdownit'

const suite = createSuite('configureable.Markdownit (node)')

suite(`configures html`, context => {
  const value = new Configureable()
          .html()
          .configure()

  assert.is(value.options.html, true)  
})

suite(`configures linkify`, context => {
  const value = new Configureable()
          .linkify()
          .configure()

  assert.is(value.options.linkify, true)  
})

suite(`configures highlight`, context => {
  const value1 = new Configureable()
          .highlight('refractorRehype')
          .configure(),
        value2 = new Configureable()
          .highlight('refractorRehypeWithEscapedVueMustache')
          .configure()

  assert.ok(typeof value1.options.highlight === 'function')  
  assert.ok(typeof value2.options.highlight === 'function')  
})

suite.run()
