import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { rollup, push } from '../src/configureable'
import {
  resolve
} from './stubs/rollup'

test('configures Rollup Node resolve plugin', () => {
  const value = rollup.resolve(),
        expected = {
          plugins: [resolve],
        }

  assert.equal(value, expected)
})

test.run()
