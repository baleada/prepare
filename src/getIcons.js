import { readdirSync, readFileSync } from 'fs'
import { parse } from 'path'
import { parseFragment, serialize } from 'parse5'

export default function getIcons ({ dirs, basePath, toSnakeCased = ({ name }) => name, set }) {
  const icons = dirs.reduce((icons, dir) => {
    const files = readdirSync(`./${basePath}/${dir}`),
          fileMetadata = files.map(file => ({
            snakeCased: toSnakeCased({ name: parse(file).name, dir }),
            contents: readFileSync(`./${basePath}/${dir}/${file}`, 'utf8'),
          })),
          fromDir = fileMetadata.map(({ snakeCased, contents }) => {
            const { childNodes: { 0: svg } } = parseFragment(contents)
            return {
              componentName: `${set}${toComponentName(snakeCased)}`,
              contents: serialize(svg),
              viewBox: svg.attrs.find(({ name }) => name.toLowerCase() === 'viewbox')?.value,
            }
          })
    
    return [
      ...icons,
      ...fromDir,
    ]
  }, [])

  console.log(`Got ${icons.length} icons`)

  return icons
}

function toComponentName (snakeCased) {
  return toComponentCase(snakeCased)
}

function toComponentCase (snakeCased) {
  return snakeCased
    .split('-')
    .map(word => capitalize(word))
    .join('')
}

function capitalize (word) {
  if (!word) {
    return word
  }
  
  return `${word[0].toUpperCase()}${word.slice(1)}`
}
