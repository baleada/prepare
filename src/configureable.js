import rollup from './configureables/rollup.js'
import vite from './configureables/vite.js'
import markdownit from './configureables/markdownit.js'
import postcss from './configureables/postcss.js'
import tailwindcss from './configureables/tailwindcss.js'

const configureablesByTool = {
  rollup,
  vite,
  markdownit,
  postcss,
  tailwindcss,
}

export default function configureable (tool) {
  return configureablesByTool[tool]()
}

