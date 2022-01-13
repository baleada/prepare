import { rollup } from 'rollup'
import configs from '../rollup.config'

async function prepare () {
  for (const config of configs) {
    const bundle = await rollup(config)

    if (!Array.isArray(config.output)) {
      throw new Error(`config should be an array`)
    }

    for (const output of config.output) {
      await bundle.write(output)
    }
  }
}

prepare()
