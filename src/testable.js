import { createFilter } from '@rollup/pluginutils'

export default function testable (...tests) {
  const object = {}

  object.test = param => tests.every(test => test(param))

  object.idEndsWith = path => testable(
    ...tests,
    ({ id }) => (new RegExp(`(^|\/)${path}$`)).test(id)
  )

  object.queryIsEmpty = () => testable(
    ...tests,
    ({ query }) => !query || Object.keys(query).length === 0
  )

  object.filter = ({ include, exclude }) => testable(
    ...tests,
    ({ id }) => createFilter(include, exclude)(id)
  )
  object.include = include => object.filter({ include })
  object.exclude = exclude => object.filter({ exclude })

  return object
}

