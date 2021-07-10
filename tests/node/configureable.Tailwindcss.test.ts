import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { Tailwindcss as Configureable } from '../../src/configureables/Tailwindcss'
// @ts-ignore
import * as baleada from '@baleada/tailwind-theme'

const suite = createSuite('configureable.Tailwindcss (node)')

suite(`configures JIT mode`, context => {
  const value = new Configureable()
          .jit()
          .configure(),
        expected = {
          mode: 'jit'
        }
  
  assert.equal(value, expected)
})

suite(`configures important`, context => {
  const value = new Configureable()
          .important()
          .configure(),
        expected = {
          important: true
        }
  
  assert.equal(value, expected)
})

suite(`configures purge paths`, context => {
  const value = new Configureable()
          .purge(['index.html'])
          .configure(),
        expected = {
          purge: [
            'index.html'
          ]
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

suite(`configures theme via configureTheme callback`, context => {
  const value = new Configureable()
          .theme(({ baleada }) => ({ screens: baleada.screens }))
          .configure(),
        expected = {
          theme: {
            screens: baleada.screens,
          }
        }
        
  assert.equal(value, expected)
})

suite(`extends theme`, context => {
  const value = new Configureable()
          .theme(({ baleada }) => ({ screens: baleada.screens }))
          .extend({ stub: { stub: 'stub' } })
          .configure(),
        expected = {
          theme: {
            screens: baleada.screens,
            extend: {
              stub: { 'stub': 'stub' }
            }
          }
        }
        
  assert.equal(value, expected)
})

suite(`extends theme via callback`, context => {
  const value = new Configureable()
          .theme(({ baleada }) => ({ screens: baleada.screens }))
          .extend(({ baleada }) => ({ screens: baleada.screens }))
          .configure(),
        expected = {
          theme: {
            screens: baleada.screens,
            extend: {
              screens: baleada.screens,
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

// suite(`configures variants`, context => {
//   const value = new Configureable()
//           .variants({ stub: ['stub'] })
//           .configure(),
//         expected = {
//           variants: {
//             stub: ['stub']
//           }
//         }
        
//   assert.equal(value, expected)
// })

// suite(`configures variants via callback`, context => {
//   const value = new Configureable()
//           .variants(({ defaultConfig }) => ({ screens: defaultConfig.variants.screens }))
//           .configure(),
//         expected = {
//           variants: {
//             screens: defaultConfig.variants.screens,
//           }
//         }
        
//   assert.equal(value, expected)
// })

// suite(`extends variants`, context => {
//   const value = new Configureable()
//           .variants(({ defaultConfig }) => ({ screens: defaultConfig.variants.screens }))
//           .variants.extend({ screens: defaultConfig.variants.screens })
//           .configure(),
//         expected = {
//           variants: {
//             screens: defaultConfig.variants.screens,
//             extend: {
//               screens: defaultConfig.variants.screens
//             }
//           }
//         }
        
//   assert.equal(value, expected)
// })

// suite(`extends variants via callback`, context => {
//   const value = new Configureable()
//           .variants(({ defaultConfig }) => ({ screens: defaultConfig.variants.screens }))
//           .variants.extend(({ defaultConfig }) => ({ screens: defaultConfig.variants.screens }))
//           .configure(),
//         expected = {
//           variants: {
//             screens: defaultConfig.variants.screens,
//             extend: {
//               screens: defaultConfig.variants.screens,
//             }
//           }
//         }
        
//   assert.equal(value, expected)
// })

suite(`configures plugins`, context => {
  const pluginStub = () => {}
  const value = new Configureable()
          .plugin(pluginStub)
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures custom plugins`, context => {
  const pluginStub = () => {}
  const value = new Configureable()
          .plugin.custom(() => pluginStub)
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures forms plugin`, context => {
  const value = new Configureable()
          .forms()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures typography plugin`, context => {
  const value = new Configureable()
          .typography()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures lineClamp plugin`, context => {
  const value = new Configureable()
          .lineClamp()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures aspectRatio plugin`, context => {
  const value = new Configureable()
          .aspectRatio()
          .configure()

  assert.is(value.plugins.length, 1)
})

// suite(`configures presets`, context => {
//   const value = new Configureable()
//           .preset('stub')
//           .configure(),
//         expected = {
//           presets: ['stub'],
//         }

//   assert.equal(value, expected)
// })

suite.run()
