import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { withPlaywright } from '../../src/withPlaywright'
import {
  suite as suiteStub,  
} from '../stubs/withPuppeteer'

const suite = createSuite('withPlaywright')

suite('adds before, before each, and after hooks', context => {
  const value = withPlaywright(suiteStub)

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
