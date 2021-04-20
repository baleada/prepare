import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { resolve } from 'path'
import { toInducedDir } from '../../src/virtual-util'

const suite = createSuite('toInducedDir (node)')

const basePath = resolve('')

suite('recognizes directories', () => {
  const value = toInducedDir({ id: `${basePath}/tests/stubs/files` }),
        expected = `${basePath}/tests/stubs/files`

  assert.is(value, expected)
})

suite('recognizes files', () => {
  const value = toInducedDir({ id: `${basePath}/tests/stubs/files/foo.js` }),
        expected = `${basePath}/tests/stubs/files`

  assert.is(value, expected)
})

suite('recognizes fuzzy paths to files', () => {
  const value = toInducedDir({ id: `${basePath}/tests/stubs/files/foo` }),
        expected = `${basePath}/tests/stubs/files`

  assert.is(value, expected)
})


suite.run()

