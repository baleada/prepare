import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import configureable from '../../src/configureable.js'
import { push } from '../../src/configureables/rollup.js'
import { 
  babelConfigBrowser,
  babelConfigNode,
} from '../fixtures/configureable.rollup.js'
import {
  input,
  plugin,
  outputEsm,
  outputCjs,
  external,
  resolve,
  commonjs,
  json,
  del,
  vue,
  analyze,
  baleadaTransformPluginRequiredParam,
  virtual,
  sourceTransform,
  babelBrowser,
  babelNode,
  esmBrowser,
  esmNode,
  cjs
} from '../stubs/configureable.rollup.js'

const suite = createSuite('configureable.rollup')

suite('push(...) pushes new items to end of nested array', () => {
  const value = push({ config: { stub: [] }, array: 'stub', value: 'stub' }),
        expected = {
          stub: ['stub']
        }
  
  assert.equal(value, expected)
})

suite('push(...) initializes nested array if not present', () => {
  const value = push({ config: {}, array: 'stub', value: 'stub' }),
        expected = {
          stub: ['stub']
        }
  
  assert.equal(value, expected)
})

suite('push(...) handles arrays, not just strings', () => {
  const value = push({ config: {}, array: 'stub', value: ['stub'] }),
        expected = {
          stub: ['stub']
        }
  
  assert.equal(value, expected)
})


// Generic
suite('input(...) configures input', () => {
  const value = configureable('rollup')
          .input(input)
          .configure(),
        expected = {
          input
        }
  
  assert.equal(value, expected)
})

suite('output(...) configures output', () => {
  const value = configureable('rollup')
          .output(outputEsm)
          .configure(),
        expected = {
          output: [outputEsm]
        }
  assert.equal(value, expected)
})

suite('plugin(...) configures plugin', () => {
  const value = configureable('rollup')
          .plugin(plugin)
          .configure(),
        expected = {
          plugins: [
            plugin,
          ]
        }

  assert.equal(value, expected)
})

suite('external(...) configures external', () => {
  const value = configureable('rollup')
          .external(external)
          .configure(),
        expected = {
          external: [
            external,
          ]
        }

  assert.equal(value, expected)
})


// Specific plugins
suite('resolve(...) configures plugin', () => {
  const value = configureable('rollup')
          .resolve()
          .configure(),
        expected = {
          plugins: [resolve],
        }
        
  assert.is(value.plugins[0].name, expected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(value.plugins[0].name, 'string')
})

suite('commonjs(...) configures plugin', () => {
  const value = configureable('rollup')
          .commonjs()
          .configure(),
        expected = {
          plugins: [commonjs],
        }
        
  assert.is(value.plugins[0].name, expected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(value.plugins[0].name, 'string')
})

suite('json(...) configures plugin', () => {
  const value = configureable('rollup')
          .json()
          .configure(),
        expected = {
          plugins: [json],
        }
        
  assert.is(value.plugins[0].name, expected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(value.plugins[0].name, 'string')
})

suite('delete(...) configures plugin', () => {
  const value = configureable('rollup')
          .delete()
          .configure(),
        expected = {
          plugins: [del],
        }
        
  assert.is(value.plugins[0].name, expected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(value.plugins[0].name, 'string')
})

suite('vue(...) configures plugin', () => {
  const value = configureable('rollup')
          .vue()
          .configure(),
        expected = {
          plugins: [vue],
        }
        
  assert.is(value.plugins[0].name, expected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(value.plugins[0].name, 'string')
})

suite('analyze(...) configures plugin', () => {
  const value = configureable('rollup')
          .analyze()
          .configure(),
        expected = {
          plugins: [analyze],
        }
        
  assert.is(value.plugins[0].name, expected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(value.plugins[0].name, 'string')
})

suite('virtual(...) configures plugin', () => {
  const value = configureable('rollup')
          .virtual(baleadaTransformPluginRequiredParam)
          .configure(),
        expected = {
          plugins: [virtual],
        }
        
  assert.is(value.plugins[0].name, expected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(value.plugins[0].name, 'string')
})

suite('virtualIndex(...) configures plugin', () => {
  const value = configureable('rollup')
          .virtualIndex(input)
          .configure(),
        expected = {
          plugins: [virtual],
        }
        
  assert.is(value.plugins[0].name, expected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(value.plugins[0].name, 'string')
})

suite('sourceTransform(...) configures plugin', () => {
  const value = configureable('rollup')
          .sourceTransform(baleadaTransformPluginRequiredParam)
          .configure(),
        expected = {
          plugins: [sourceTransform],
        }
        
  assert.is(value.plugins[0].name, expected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(value.plugins[0].name, 'string')
})

suite('toBabelConfig(...) retrieves babel configurations by compatibility', () => {
  const browserValue = configureable('rollup').toBabelConfig('browser'),
        nodeValue = configureable('rollup').toBabelConfig('node')

  assert.equal(browserValue, babelConfigBrowser)
  assert.equal(nodeValue, babelConfigNode)
})

suite('babel(...) configures plugin by compatibility', () => {
  const browserValue = configureable('rollup')
          .babel('browser')
          .configure(),
        nodeValue = configureable('rollup')
          .babel('node')
          .configure(),
        browserExpected = {
          plugins: [
            babelBrowser,
          ]
        },
        nodeExpected = {
          plugins: [
            babelNode,
          ]
        }
        
  assert.is(browserValue.plugins[0].name, browserExpected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(browserValue.plugins[0].name, 'string')

  assert.is(nodeValue.plugins[0].name, nodeExpected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(nodeValue.plugins[0].name, 'string')
})

suite('esm(...) configures standard ESM build by compatibility', () => {
  const browserValue = configureable('rollup')
          .esm({ file: outputEsm.file, target: 'browser' })
          .configure(),
        nodeValue = configureable('rollup')
          .esm({ file: outputEsm.file, target: 'node' })
          .configure(),
        browserExpected = esmBrowser,
        nodeExpected = esmNode

  assert.equal(browserValue.output, browserExpected.output)
  assert.equal(nodeValue.output, nodeExpected.output)
  assert.is(browserValue.plugins[0].name, browserExpected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(browserValue.plugins[0].name, 'string')
  assert.is(nodeValue.plugins[0].name, nodeExpected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(nodeValue.plugins[0].name, 'string')
})

suite('cjs(...) configures standard CJS build', () => {
  const value = configureable('rollup')
          .cjs({ file: outputCjs.file })
          .configure(),
        expected = cjs

  assert.equal(value.output, expected.output)
  assert.is(value.plugins[0].name, expected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(value.plugins[0].name, 'string')
})

suite('configureable(...) can chain', () => {
  const value = configureable('rollup')
          .input(input)
          .plugin(plugin)
          .external(external)
          .resolve()
          .analyze()
          .vue()
          .virtual(baleadaTransformPluginRequiredParam)
          .sourceTransform(baleadaTransformPluginRequiredParam)
          .esm({ file: outputEsm.file, target: 'browser' })
          .configure()

  assert.ok(value.input)
  assert.is(value.output.length, 1)
  assert.is(value.external.length, 2)
  assert.is(value.plugins.length, 7)
})

suite.run()