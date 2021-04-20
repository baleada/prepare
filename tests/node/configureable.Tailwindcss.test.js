import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { Tailwindcss as Configureable } from '../../src/configureables/Tailwindcss'
import baleada from '@baleada/tailwind-theme'
import defaultConfig from 'tailwindcss/defaultConfig.js'

const suite = createSuite('configureable.Tailwindcss (node)')

suite(`configures purge paths`, context => {
  const value = new Configureable()
          .purge(['index.html'])
          .configure(),
        expected = {
          purge: {
            content: [
              'index.html'
            ]
          }
        }
  
  assert.equal(value, expected)
})

suite(`configures theme`, context => {
  const value = new Configureable()
          .theme({ stub: { 'stub': 'stub' } })
          .configure(),
        expected = {
          theme: {
            stub: { 'stub': 'stub' }
          }
        }
        
  assert.equal(value, expected)
})

suite(`configures theme via callback`, context => {
  const value = new Configureable()
          .theme(({ baleada }) => ({ colors: baleada.colors }))
          .configure(),
        expected = {
          theme: {
            colors: baleada.colors,
          }
        }
        
  assert.equal(value, expected)
})

suite(`extends theme`, context => {
  const value = new Configureable()
          .theme(({ baleada }) => ({ colors: baleada.colors }))
          .theme.extend({ stub: { stub: 'stub' } })
          .configure(),
        expected = {
          theme: {
            colors: baleada.colors,
            extend: {
              stub: { 'stub': 'stub' }
            }
          }
        }
        
  assert.equal(value, expected)
})

suite(`extends theme via callback`, context => {
  const value = new Configureable()
          .theme(({ baleada }) => ({ colors: baleada.colors }))
          .theme.extend(({ baleada }) => ({ colors: baleada.colors }))
          .configure(),
        expected = {
          theme: {
            colors: baleada.colors,
            extend: {
              colors: baleada.colors,
            }
          }
        }
        
  assert.equal(value, expected)
})

suite(`configures Baleada Theme`, context => {
  const value = new Configureable()
          .baleada()
          .configure(),
        expected = {
          theme: baleada,
        }
        
  assert.equal(value, expected)
})

suite(`configures variants`, context => {
  const value = new Configureable()
          .variants({ stub: ['stub'] })
          .configure(),
        expected = {
          variants: {
            stub: ['stub']
          }
        }
        
  assert.equal(value, expected)
})

suite(`configures variants via callback`, context => {
  const value = new Configureable()
          .variants(({ defaultConfig }) => ({ colors: defaultConfig.variants.colors }))
          .configure(),
        expected = {
          variants: {
            colors: defaultConfig.variants.colors,
          }
        }
        
  assert.equal(value, expected)
})

suite(`extends variants`, context => {
  const value = new Configureable()
          .variants(({ defaultConfig }) => ({ colors: defaultConfig.variants.colors }))
          .variants.extend({ colors: defaultConfig.variants.colors })
          .configure(),
        expected = {
          variants: {
            colors: defaultConfig.variants.colors,
            extend: {
              colors: defaultConfig.variants.colors
            }
          }
        }
        
  assert.equal(value, expected)
})

suite(`extends variants via callback`, context => {
  const value = new Configureable()
          .variants(({ defaultConfig }) => ({ colors: defaultConfig.variants.colors }))
          .variants.extend(({ defaultConfig }) => ({ colors: defaultConfig.variants.colors }))
          .configure(),
        expected = {
          variants: {
            colors: defaultConfig.variants.colors,
            extend: {
              colors: defaultConfig.variants.colors,
            }
          }
        }
        
  assert.equal(value, expected)
})

suite(`configures plugins`, context => {
  const pluginStub = () => {}
  const value = new Configureable()
          .plugin(pluginStub)
          .configure()

  assert.ok(value.plugins[0])
})

suite(`configures forms plugin`, context => {
  const value = new Configureable()
          .forms()
          .configure()

  assert.ok(value.plugins[0])
})

suite(`configures presets`, context => {
  const value = new Configureable()
          .preset('stub')
          .configure(),
        expected = {
          presets: ['stub'],
        }

  assert.equal(value, expected)
})

suite.run()
