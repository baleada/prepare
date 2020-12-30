export default function testable (tests = []) {
  const object = {}

  object.test = param => tests.every(test => test(param))

  object.idEndsWith = path => testable([
    ...tests,
    ({ id }) => (new RegExp(`(^|\/)${path}$`)).test(id)
  ])

  object.queryIsEmpty = () => testable([
    ...tests,
    ({ query }) => Object.keys(query).length === 0,
  ])

  return object
}

