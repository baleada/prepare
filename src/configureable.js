import koa from './configureables/koa.js'
import rollup from './configureables/rollup.js'
import vite from './configureables/vite.js'
// import markdownIt from './configureables/markdownIt.js'

const configureablesByTool = {
  koa,
  rollup,
  vite,
  // markdownIt,
}

export default function configureable (tool) {
  return configureablesByTool[tool]()
}

