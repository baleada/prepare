import virtual from '@baleada/vite-serve-virtual'
import asVue from '@baleada/vite-serve-as-vue'

export default function configureable (config = []) {
  const object = {}

  // Return the final config
  object.configure = () => config

  object.plugin = plugin => configureable([...config, plugin])

  object.virtual = (...args) => object.plugin(virtual(...args))
  object.asVue = (...args) => object.plugin(asVue(...args))

  return object
}
