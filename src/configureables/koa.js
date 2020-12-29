import virtual from '@baleada/vite-serve-virtual'
import asVue from '@baleada/vite-serve-as-vue'
import createFilesToIndex from '@baleada/source-transform-files-to-index'
import createFilesToRoutes from '@baleada/source-transform-files-to-routes'

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
  object.virtualIndex = (path, createFilesToIndexOptions = {}) => {
    return object.virtual(({ createIdEndsWith }) => ({
      test: createIdEndsWith(path),
      transform: createFilesToIndex({ test: () => true, importType: 'relativeFromRoot', ...createFilesToIndexOptions })
    }))
  }
  object.virtualRoutes = ({ path, router }, createFilesToRoutesOptions = {}) => {
    return object.virtual(({ createIdEndsWith }) => ({
      test: createIdEndsWith(path),
      transform: createFilesToRoutes(router, { test: () => true, importType: 'relativeFromRoot', ...createFilesToRoutesOptions })
    }))
  }

  return object
}

function ensureVirtualParams (rawParams) {
  return typeof rawParams === 'function'
    ? rawParams({ createIdEndsWith })
    : rawParams
}

function createIdEndsWith (path) {
  return ({ id }) => (new RegExp(`(^|\/)${path}$`)).test(id)
}
