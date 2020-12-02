import virtual from '@baleada/vite-serve-virtual'
import asVue from '@baleada/vite-serve-as-vue'
import createFilesToIndex from '@baleada/source-transform-files-to-index'
import createFilesToRoutes from '@baleada/source-transform-files-to-routes'

export default function configureable (config = []) {
  const object = {}

  // Return the final config
  object.configure = () => config

  object.plugin = plugin => configureable([...config, plugin])

  object.virtual = (...args) => object.plugin(virtual(...args))
  object.asVue = (...args) => object.plugin(asVue(...args))

  // Frequently needed virtual files
  object.virtualIndex = (path, createFilesToIndexOptions = {}) => {
    return object.virtual({
      test: ({ id }) => id.endsWith(path),
      transform: createFilesToIndex({ test: () => true, importType: 'relative', ...createFilesToIndexOptions })
    })
  }
  object.virtualRoutes = (path, createFilesToRoutesOptions = {}) => {
    return object.virtual({
      test: ({ id }) => id.endsWith(path),
      transform: createFilesToRoutes({ test: () => true, importType: 'relative', ...createFilesToRoutesOptions })
    })
  }

  return object
}
