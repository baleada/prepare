import { rollup } from 'rollup'
import type { RollupOptions } from 'rollup'

export async function prepare (config: RollupOptions) {
  const bundle = await rollup(config)
  
  if (!Array.isArray(config.output)) {
    throw new Error(`@baleada/prepare: config should be an array`)
  }

  for (const output of config.output) {
    await bundle.write(output)
  }
}
