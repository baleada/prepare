import { readdirSync, lstatSync, rmdirSync, unlinkSync } from 'fs'
import { resolve } from 'path'

export default function empty (dir) {
  const dirPath = resolve(dir)
  readdirSync(dirPath)
    .forEach(item => remove(`${dirPath}/${item}`))

  console.log(`Emptied ${dir} directory`)
}

function remove (path) {
  if (lstatSync(path).isFile()) {
    unlinkSync(path)
  } else {
    readdirSync(path)
      .forEach(item => remove(`${path}/${item}`))

    rmdirSync(`${path}`)
  }
}
