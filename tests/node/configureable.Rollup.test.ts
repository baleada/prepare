import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { resolve } from 'path'
import { Rollup as Configureable } from '../../src/configureables/Rollup'
import { 
  babelConfigBrowser,
  babelConfigNode,
} from '../fixtures/configureable.Rollup'
import {
  outputEsm,
  outputCjs,
  external,
  esmBrowser,
  esmNode,
  cjs
} from '../stubs/configureable.Rollup'

const suite = createSuite('configureable.Rollup')

suite(`configures treeshake boolean`, () => {
  const value = new Configureable()
    .treeshake(true)
    .treeshake(false)
    .configure()

  assert.is(value.treeshake, false)
})

suite(`configures treeshake string`, () => {
  const value = new Configureable()
    .treeshake('safest')
    .treeshake('smallest')
    .configure()

  assert.is(value.treeshake, 'smallest')
})

suite(`configures treeshake object`, () => {
  const value = new Configureable()
    .treeshake({ moduleSideEffects: false })
    .treeshake({ propertyReadSideEffects: true })
    .configure()

  assert.equal(value.treeshake, { moduleSideEffects: false, propertyReadSideEffects: true })
})

suite(`configures single input`, () => {
  const value1 = new Configureable()
          .input('index.ts')
          .configure()
  
  assert.is(value1.input, 'index.ts')
  
  const value2 = new Configureable()
          .input({ main: './index.html', nested: './nested/index.html' })
          .configure()
  
  assert.equal(value2.input, { main: './index.html', nested: './nested/index.html' })
})

suite(`configures multiple inputs`, () => {
  const value = new Configureable()
          .input(['index.ts'])
          .configure()
  
  assert.equal(value.input, ['index.ts'])
  assert.is(value.plugins.length, 1) // Auto-configures multi-entry plugin
})

suite(`configures single output`, () => {
  const value = new Configureable()
          .output({ file: 'lib/index.js' })
          .configure()

  assert.equal(value.output, [{ file: 'lib/index.js' }])
})

suite(`configures multiple outputs`, () => {
  const value = new Configureable()
          .output([{ file: 'lib/index.js' }, { file: 'lib/poop.ts' }])
          .configure()

  assert.equal(value.output, [{ file: 'lib/index.js' }, { file: 'lib/poop.ts' }])
})

suite(`configures external`, () => {
  const value = new Configureable()
          .external(external)
          .configure(),
        expected = {
          external: [
            external,
          ]
        }

  assert.equal(value, expected)
})

suite(`configures plugins`, () => {
  const value = new Configureable()
          .plugin(() => {})
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures resolve plugin`, () => {
  const value = new Configureable()
          .resolve()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures commonjs plugin`, () => {
  const value = new Configureable()
          .commonjs()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures json plugin`, () => {
  const value = new Configureable()
          .json()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures delete plugin`, () => {
  const value = new Configureable()
          .delete()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures dts plugin`, () => {
  const value = new Configureable()
          .dts()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures vue plugin`, () => {
  const value = new Configureable()
          .vue()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures analyzer plugin`, () => {
  const value = new Configureable()
          .analyzer()
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures virtual plugin`, () => {
  const value = new Configureable()
          .virtual({ test: () => true, transform: () => '' })
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`configures sourceTransform plugin`, () => {
  const value = new Configureable()
          .sourceTransform({ test: () => true, transform: () => '' })
          .configure()

  assert.is(value.plugins.length, 1)
})

suite(`retrieves babel configurations by compatibility`, () => {
  const browserValue = new Configureable().toBabelConfig({ target: 'browser', format: 'esm' }),
        nodeValue = new Configureable().toBabelConfig({ target: 'node', format: 'esm' })

  assert.equal(browserValue, babelConfigBrowser)
  assert.equal(nodeValue, babelConfigNode)
})

suite(`configures plugin by compatibility`, () => {
  const browserValue = new Configureable()
          .babel({ target: 'browser', format: 'esm' })
          .configure(),
        nodeValue = new Configureable()
          .babel({ target: 'node', format: 'esm' })
          .configure()

  assert.is(browserValue.plugins.length, 1)
  assert.is(nodeValue.plugins.length, 1)
})

suite(`configures standard ESM build by compatibility`, () => {
  const browserValue = new Configureable()
          .esm({ file: outputEsm.file, target: 'browser' })
          .configure(),
        nodeValue = new Configureable()
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

suite(`configures standard CJS build`, () => {
  const value = new Configureable()
          .cjs({ file: outputCjs.file })
          .configure(),
        expected = cjs

  assert.equal(value.output, expected.output)
  assert.is(value.plugins[0].name, expected.plugins[0].name) // Avoid comparing anonymous functions
  assert.type(value.plugins[0].name, 'string')
})

suite.run()
