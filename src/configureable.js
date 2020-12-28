import koa from './configureables/koa.js'
import rollup from './configureables/rollup.js'
import vite from './configureables/vite.js'
import markdownIt from './configureables/markdownIt.js'
// import postcss from './configureables/postcss.js'
// import tailwindcss from './configureables/tailwindcss.js'

const configureablesByTool = {
  koa,
  rollup,
  vite,
  markdownIt,
  // postcss,
  // tailwindcss,
}

export default function configureable (tool) {
  return configureablesByTool[tool]()
}

