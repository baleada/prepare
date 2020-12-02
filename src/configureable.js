import koa from './configureables/koa.js'
import rollup from './configureables/rollup.js'
import vite from './configureables/vite.js'

const configureablesByTool = {
  koa,
  rollup,
  vite,
}

export default function configureable (tool) {
  return configureablesByTool[tool]()
}

