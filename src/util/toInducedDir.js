import { parse } from 'path'
import { existsSync } from 'fs'
import { clipable } from '@baleada/logic'

// Returns absolute path to dir
export default function toInducedDir (id) {
  switch (looksLike(id)) {
    case 'file':
      return fromFile(id)
    case 'dir':
      // If it looks like a dir and exists, it's a dir.

      // If it looks like a dir but doesn't exist, it's a
      // fuzzy path to a virtual file
      return existsSync(id) ? id : fromFile(id)
  }
}

// index.js looks like a file
// index looks like a dir but might be a file
function looksLike (id) {
  const { base, ext } = parse(id)
  return (base && ext) ? 'file' : 'dir'
}

function fromFile (id) {
  const { base } = parse(id),
        baseRE = new RegExp(`/${base}$`)
  return `${clipable(id).clip(baseRE)}`
}
