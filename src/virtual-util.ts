import { 
  readdirSync, 
  statSync,
  existsSync,
} from 'fs'
import { parse, resolve } from 'path'
import type { Icon } from './getIcons'

/**
 * Given a directory, retrieves the IDs of all items, including nested items, in the directory.
 */
export function toIds ({ dir }: { dir: string }): string[] {
  return readdirSync(dir)
    .reduce((ids, item) => {
      return [
        ...ids,
        `${dir}/${item}`,
        ...(isFile({ dir, item }) ? [] : toIds({ dir: `${dir}/${item}` }))
      ]
    }, [])
}

function isFile ({ dir, item }: { dir: string, item: string }): boolean {
  return statSync(`${dir}/${item}`).isFile()
}


/**
 * Given a directory, retrieves the ids of all files and nested files in the directory.
 */
export function toFileIds ({ dir }: { dir: string }): string[] {
  return toIds({ dir }).filter(item => statSync(item).isFile())
}


/**
 * Given a directory, retrieves the ids of all directories and nested directories in the directory.
 */
export function toDirIds ({ dir }: { dir: string }): string[] {
  return toIds({ dir }).filter(item => statSync(item).isDirectory())
}


/**
 * Retrieves metadata about a file
 */
export function toFileIdMetadata ({ id, indexDir }: { id: string, indexDir: string }): {
  name: string,
  extension: string,
  relativePaths: {
    fromProjectRoot: string,
    fromIndex: string,
    fromSystemRoot: string,
  }
} {
  const basePath = resolve(''),
        { name, ext } = parse(id),
        fileRE = new RegExp(`${name}${ext}$`),
        relativePathFromProjectRoot = id
          .replace(basePath, '')
          .replace(fileRE, ''),
        relativePathFromIndex = '.' + id
          .replace(indexDir, '')
          .replace(fileRE, ''),
        relativePathFromSystemRoot = id
          .replace(fileRE, '')

    return {
      name,
      extension: ext.replace(/^\./, ''),
      relativePaths: {
        fromProjectRoot: relativePathFromProjectRoot,
        fromIndex: relativePathFromIndex,
        fromSystemRoot: relativePathFromSystemRoot,
      }
    }
}


/**
 * Given a path or a fuzzy path to a file, returns the ID of the directory containing that file.
 */
export function toInducedDir ({ id }: { id: string }): string {
  switch (looksLike({ id })) {
    case 'file':
      return fromFile({ id })
    case 'dir':
      // If it looks like a dir and exists, it's a dir.

      // If it looks like a dir but doesn't exist, it's a
      // fuzzy path to a virtual file
      return existsSync(id) ? id : fromFile({ id })
  }
}

// index.js looks like a file
// index looks like a dir but might be a file
function looksLike ({ id }: { id: string }): 'file' | 'dir' {
  const { base, ext } = parse(id)
  return (base && ext) ? 'file' : 'dir'
}

function fromFile ({ id }: { id: string }): string {
  const { base } = parse(id),
        baseRE = new RegExp(`/${base}$`)
  return id.replace(baseRE, '')
}


/**
 * Given an array of icon metadata, creates an index file, exporting virtual icon components.
 */
export function toIconComponentIndex ({ icons }: { icons: Icon[] }): string {
  const imports = icons.reduce((imports, { componentName }) => `${imports}import ${componentName} from './components/${componentName}.vue'\n`, ''),
        exports = `export { ${icons.map(({ componentName }) => componentName).join(', ')} }`

  return `\
${imports}

${exports}
`
}


/**
 * Given icon metadata, generates the code for a virtual file exporting an icon component.
 */
export function toIconComponent ({ componentName, contents, viewBox }: Icon): string {
  return `\
<template>
  <svg
    role="img"
    viewBox="${viewBox}"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    ${contents}
  </svg>
</template>

<script>
export default {
  name: '${componentName}',
}
</script>
`
}


