import { readdirSync, lstatSync, rmdirSync, unlinkSync } from 'fs'
import { resolve } from 'path'

export default function empty ({ dir }: { dir: string }) {
  const dirPath = resolve(dir)
  readdirSync(dirPath)
    .forEach(item => remove({ path: `${dirPath}/${item}` }))

  console.log(`Emptied ${dir} directory`)
}

function remove ({ path }: { path: string }) {
  if (lstatSync(path).isFile()) {
    unlinkSync(path)
  } else {
    readdirSync(path)
      .forEach(item => remove({ path: `${path}/${item}` }))

    rmdirSync(`${path}`)
  }
}
