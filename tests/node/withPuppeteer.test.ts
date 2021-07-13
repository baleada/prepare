import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { withPuppeteer } from '../../src/withPuppeteer'
import {
  suite as suiteStub,  
} from '../stubs/withPuppeteer'

const suite = createSuite('withPuppeteer')

suite('adds before, before each, and after hooks', context => {
  const value = withPuppeteer(suiteStub)

  assert.ok(value.hasOwnProperty('before'))
  assert.ok(value.before.hasOwnProperty('each'))
  assert.ok(value.hasOwnProperty('after'))
})

suite.skip(`launches, runs tests, and closes browser without errors`, async context => {
  // ?
})

suite.skip('does not reload between tests unless reloadNext is called', context => {
  // ?
})

suite.skip('defaults to testing chrome on macOS', context => {
  // ?
})

suite.run()
