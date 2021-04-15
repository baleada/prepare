import { createFilter } from '@rollup/pluginutils'
import type { FilterPattern } from '@rollup/pluginutils'

export class Testable {
  constructor (private tests: ((...args: any[]) => boolean)[] = []) {}
  
  test (value: any) {
    return this.tests.every(test => test(value))
  }

  suite (test: (...args: any[]) => boolean) {
    this.tests = [...this.tests, test]
    return this
  }

  idEndsWith (path: string) {
    return this.suite(
      ({ id }) => (new RegExp(`(^|\/)${path}$`)).test(id)
    )
  }

  queryIsEmpty () {
    return this.suite(
      ({ query }) => !query || Object.keys(query).length === 0
    )
  }

  filter ({ include, exclude }: { include?: FilterPattern, exclude?: FilterPattern }) {
    return this.suite(
      ({ id }) => createFilter(include, exclude)(id)
    )
  }

  include (include: FilterPattern) {
    return this.filter({ include })
  }

  exclude (exclude: FilterPattern) {
    return this.filter({ exclude })
  }
}
