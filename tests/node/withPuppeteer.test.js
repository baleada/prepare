import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import withPuppeteer, { ensureLaunch } from '../../src/withPuppeteer.js'
import {
  suite as suiteStub,  
} from '../stubs/withPuppeteer.js'
import {
  launchApi
} from '../fixtures/withPuppeteer.js'

const suite = createSuite('withPuppeteer')

suite('ensures launch when launch is object', context => {
  const value = ensureLaunch({}),
        expected = {}

  assert.equal(value, expected)
})

suite('ensures launch when launch is function', context => {
  const value = ensureLaunch(() => ({})),
        expected = {}

  assert.equal(value, expected)
})

suite('calls launch function with launch API', context => {
  const value = ensureLaunch(launchApi => launchApi),
        expected = launchApi

  assert.equal(value, expected)
})

suite('adds before and after hooks', context => {
  const value = withPuppeteer(suiteStub)

  assert.ok(value.hasOwnProperty('before'))
  assert.ok(value.hasOwnProperty('after'))
})

suite.skip(`launches, runs tests, and closes browser without errors`, async context => {
  // Not sure how to implement
})

suite.skip('defaults to testing chrome on macOS', context => {
  // Not sure how to implement
})

suite.run()
