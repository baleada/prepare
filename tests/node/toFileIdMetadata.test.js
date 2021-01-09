import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import toFileIdMetadata from '../../src/util/toFileIdMetadata.js'
import { resolve } from 'path'

const suite = createSuite('toFileIdMetadata (node)')

const basePath = resolve('')

suite('extracts metadata from file in same directory as an index', () => {
  const value = toFileIdMetadata({ id: `${basePath}/tests/stubs/files/foo.js`, indexDir: `${basePath}/tests/stubs/files` }),
        expected = {
          name: 'foo',
          extension: 'js',
          relativePaths: {
            fromProjectRoot: '/tests/stubs/files/',
            fromIndex: './',
            fromSystemRoot: `${basePath}/tests/stubs/files/`,
          }
        }

  assert.equal(value, expected)
})

suite.run()


