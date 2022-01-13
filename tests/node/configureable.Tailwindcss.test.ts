import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { Tailwindcss as Configureable } from '../../src/configureables/Tailwindcss'

const suite = createSuite('configureable.Tailwindcss (node)')

suite(`configures important`, () => {
  const value = new Configureable()
          .important()
          .configure(),
        expected = {
          important: true
        }
  
  assert.equal(value, expected)
})

suite(`configures content paths`, () => {
  const value = new Configureable()
          .content(['index.html'])
          .configure(),
        expected = {
          content: [
            'index.html'
          ]
        }
  
  assert.equal(value, expected)
})

suite(`configures theme`, () => {
  const value = new Configureable()
          .theme({ spacing: { 'stub': 'stub' } })
          .configure(),
        expected = {
          theme: {
            spacing: { 'stub': 'stub' }
          }
        }
        
  assert.equal(value, expected)
})

suite(`configures theme via configureTheme callback`, () => {
  const value = new Configureable()
          .theme(() => ({ screens: { all: '0' } }))
          .configure(),
        expected = {
          theme: {
            screens: { all: '0' },
          }
        }
        
  assert.equal(value, expected)
})

suite(`extends theme`, () => {
  const value = new Configureable()
          .theme(() => ({ screens: { all: '0' } }))
          .extend({ spacing: { stub: 'stub' } })
          .configure(),
        expected = {
          theme: {
            screens: { all: '0' },
            extend: {
              spacing: { 'stub': 'stub' }
            }
          }
        }
        
  assert.equal(value, expected)
})

suite(`extends theme via callback`, () => {
  const value = new Configureable()
          .theme(() => ({ screens: { all: '0' } }))
          .extend(() => ({ spacing: { stub: 'stub' } }))
          .configure(),
        expected = {
          theme: {
            screens: { all: '0' },
            extend: {
              spacing: { 'stub': 'stub' }
            }
          }
        }
        
  assert.equal(value, expected)
})

suite(`configures plugins`, () => {
  const pluginStub = () => {}
  const value = new Configureable()
          .plugin(pluginStub as any)
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures custom plugins`, () => {
  const pluginStub = () => {}
  const value = new Configureable()
          .plugin.custom(() => pluginStub)
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures forms plugin`, () => {
  const value = new Configureable()
          .forms()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures typography plugin`, () => {
  const value = new Configureable()
          .typography()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures lineClamp plugin`, () => {
  const value = new Configureable()
          .lineClamp()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures aspectRatio plugin`, () => {
  const value = new Configureable()
          .aspectRatio()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite.run()
