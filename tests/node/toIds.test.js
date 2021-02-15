import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { resolve } from 'path'
import toIds from '../../src/util/toIds.js'

const suite = createSuite('toIds (node)')

const basePath = resolve('')

suite('recurses through child folders', () => {
  const value = toIds(`${basePath}/tests/stubs/files`),
        expected = [
          `${basePath}/tests/stubs/files/bar`,
          `${basePath}/tests/stubs/files/bar/baz.md`,
          `${basePath}/tests/stubs/files/bar/index.js`,
          `${basePath}/tests/stubs/files/bar/qux`,
          `${basePath}/tests/stubs/files/bar/qux/poop.vue`,
          `${basePath}/tests/stubs/files/foo.js`,
        ]

  assert.equal(value, expected)
})


suite.run()

