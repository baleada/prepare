import { readdirSync, statSync } from 'fs'

export default function toIds (dir) {
  return readdirSync(dir)
    .reduce((ids, item) => {
      return [
        ...ids,
        `${dir}/${item}`,
        ...(isFile({ dir, item }) ? [] : toIds(`${dir}/${item}`))
      ]
    }, [])
}

function isFile ({ dir, item }) {
  return statSync(`${dir}/${item}`).isFile()
}
