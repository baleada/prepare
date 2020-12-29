import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import configureable from '../../src/configureable.js'
import koaFactory from '../../src/configureables/koa.js'
import rollupFactory from '../../src/configureables/rollup.js'
import viteFactory from '../../src/configureables/vite.js'
import markdownitFactory from '../../src/configureables/markdownit.js'
import postcssFactory from '../../src/configureables/postcss.js'
import tailwindcssFactory from '../../src/configureables/tailwindcss.js'

const suite = createSuite('configureable (node)')

suite(`looks up configureables`, context => {
  const koa = Object.keys(configureable('koa')),
        rollup = Object.keys(configureable('rollup')),
        vite = Object.keys(configureable('vite')),
        markdownit = Object.keys(configureable('markdownit')),
        postcss = Object.keys(configureable('postcss')),
        tailwindcss = Object.keys(configureable('tailwindcss'))
  
  assert.equal(koa, Object.keys(koaFactory()))
  assert.equal(rollup, Object.keys(rollupFactory()))
  assert.equal(vite, Object.keys(viteFactory()))
  assert.equal(markdownit, Object.keys(markdownitFactory()))
  assert.equal(postcss, Object.keys(postcssFactory()))
  assert.equal(tailwindcss, Object.keys(tailwindcssFactory()))
})

suite.run()
