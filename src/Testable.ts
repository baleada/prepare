import { createFilter } from '@rollup/pluginutils'
import type { FilterPattern } from '@rollup/pluginutils'
import type { ParsedQuery } from 'query-string'

export type TestApi = {
  id?: string,
  source?: string,
  query?: ParsedQuery<any>,
}

export type Test = (api: TestApi) => boolean

/**
 * Testable exposes methods that are commonly needed during bundling to decide 
 * whether or not a module should be transformed.
 */
export class Testable {
  constructor (private tests: Test[] = []) {}
  
  test (api: TestApi) {
    return this.tests.every(test => test(api))
  }

  suite (test: Test) {
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
