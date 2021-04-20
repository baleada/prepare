import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { resolve } from 'path'
import { toFileIds } from '../../src/virtual-util'

const suite = createSuite('toFileIds (node)')

const basePath = resolve('')

suite('recurses through child folders', () => {
  const value = toFileIds({ dir: `${basePath}/tests/stubs/files` }),
        expected = [
          `${basePath}/tests/stubs/files/bar/baz.md`,
          `${basePath}/tests/stubs/files/bar/index.js`,
          `${basePath}/tests/stubs/files/bar/qux/poop.vue`,
          `${basePath}/tests/stubs/files/foo.js`,
        ]

  assert.equal(value, expected)
})


suite.run()

