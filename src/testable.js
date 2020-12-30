export default function testable (tests = []) {
  const object = {}

  object.test = testParam => tests.every(test => test(testParam))

  object.idEndsWith = path => testable([
    ...tests,
    ({ id }) => (new RegExp(`(^|\/)${path}$`)).test(id)
  ])

  object.queryIsEmpty = () => testable([
    ...tests,
    ({ query }) => Object.keys(query) === 0,
  ])

  return object
}

