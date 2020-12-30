import virtual from '@baleada/vite-serve-virtual'
import asVue from '@baleada/vite-serve-as-vue'
import createFilesToIndex from '@baleada/source-transform-files-to-index'
import createFilesToRoutes from '@baleada/source-transform-files-to-routes'
import testable from '../testable.js'
import toIconComponent from '../util/toIconComponent.js'
import toIconComponentIndex from '../util/toIconComponentIndex.js'

export default function configureable (config = []) {
  const object = {}

  // Return the final config
  object.configure = () => config

  object.plugin = plugin => configureable([...config, plugin])
  object.plugin.api = {
    createFilesToIndex,
    createFilesToRoutes,
  }

  object.virtual = (...args) => object.plugin(virtual(ensureVirtualParams(...args)))
  object.asVue = (...args) => object.plugin(asVue(...args))

  // Frequently needed virtual files
  object.virtual.index = (path, createFilesToIndexOptions = {}) => {
    return object.virtual(({ testable }) => ({
      test: testable.idEndsWith(path).test,
      transform: createFilesToIndex({ test: () => true, importType: 'relativeFromRoot', ...createFilesToIndexOptions })
    }))
  }
  object.virtual.routes = ({ path, router }, createFilesToRoutesOptions = {}) => {
    return object.virtual(({ testable }) => ({
      test: testable.idEndsWith(path).test,
      transform: createFilesToRoutes(router, { test: () => true, importType: 'relativeFromRoot', ...createFilesToRoutesOptions })
    }))
  }
  object.virtual.iconComponentIndex = ({ icons }) => object.virtual(({ testable }) => ({
    test: testable.idEndsWith('src/index.js').test,
    transform: () => toIconComponentIndex({ icons })
  }))
  object.virtual.iconComponents = ({ icons }) => object.virtual(({ testable }) => ({
    test: param => 
    icons.some(({ componentName }) => testable.idEndsWith(`src/components/${componentName}.vue`).test(param))
    &&
    testable.queryIsEmpty().test(param),
    transform: ({ id }) => toIconComponent(icons.find(({ componentName }) => id.endsWith(`${componentName}.vue`)))
  }))

  return object
}

function ensureVirtualParams (rawParams) {
  return typeof rawParams === 'function'
    ? rawParams({ testable: testable() })
    : rawParams
}
