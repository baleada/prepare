import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { toDirIds } from '../../src/virtual-util'
import { resolve } from 'path'

const suite = createSuite('toDirIds (node)')

const basePath = resolve('')

suite('recurses through child folders', () => {
  const value = toDirIds({ dir: `${basePath}/tests/stubs/files` }),
        expected = [
          `${basePath}/tests/stubs/files/bar`,
          `${basePath}/tests/stubs/files/bar/qux`,
        ]

  assert.equal(value, expected)
})

suite.run()


