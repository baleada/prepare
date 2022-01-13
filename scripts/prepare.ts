import configs from '../rollup.config'
import { prepare } from '../src/prepare'

async function prepareAll () {
  for (const config of configs) {
    await prepare(config)
  }
}

prepareAll()
