import { readdirSync, readFileSync } from 'fs'
import { resolve, parse } from 'path'
import { parseFragment, serialize } from 'parse5'
import type { Test } from './Testable'

export type Icon = {
  componentName: string,
  contents: string,
  viewBox: string,
}

/**
 * Given directories filled with SVG icons, retrieves the icons' component names, contents, and viewBox.
 */
export default function getIcons ({ dirs, basePath, toSnakeCased = ({ name }) => name, set, test = () => true }: {
  dirs: string[],
  basePath: string,
  toSnakeCased: ({ name, dir }: { name: string, dir: string }) => string,
  set: string,
  test: Test
}) {
  const icons = dirs.reduce<Icon[]>((icons, dir) => {
    const files = readdirSync(`./${basePath}/${dir}`)
            .filter(file => file.endsWith('.svg'))
            .filter(file => test({ id: resolve('', basePath, dir, file) })),
          fileMetadata = files.map(file => ({
            snakeCased: toSnakeCased({ name: parse(file).name, dir }),
            contents: readFileSync(`./${basePath}/${dir}/${file}`, 'utf8'),
          })),
          fromDir = fileMetadata.map(({ snakeCased, contents }) => {
            const { childNodes: { 0: svg } } = parseFragment(contents)
            return {
              componentName: `${set}${toComponentName(snakeCased)}`,
              contents: serialize(svg),
              viewBox: (svg as any).attrs.find(({ name }) => name.toLowerCase() === 'viewbox')?.value,
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

function toComponentName (snakeCased: string): string {
  return toComponentCase(snakeCased)
}

function toComponentCase (snakeCased: string): string {
  return snakeCased
    .split('-')
    .map(word => capitalize(word))
    .join('')
}

function capitalize (word: string): string {
  if (!word) {
    return word
  }
  
  return `${word[0].toUpperCase()}${word.slice(1)}`
}
