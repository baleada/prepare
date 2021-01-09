import { parse, resolve } from 'path'
import { clipable } from '@baleada/logic'

export default function toFileIdMetadata ({ id, indexDir }) {
  const basePath = resolve(''),
        { name, ext } = parse(id),
        fileRE = new RegExp(`${name}${ext}$`),
        relativePathFromProjectRoot = clipable(id)
          .clip(basePath)
          .clip(fileRE)
          .toString(),
        relativePathFromIndex = '.' + clipable(id)
          .clip(indexDir)
          .clip(fileRE)
          .toString(),
        relativePathFromSystemRoot = clipable(id)
          .clip(fileRE)
          .toString()

    return {
      name,
      extension: clipable(ext).clip(/^\./).toString(),
      relativePaths: {
        fromProjectRoot: relativePathFromProjectRoot,
        fromIndex: relativePathFromIndex,
        fromSystemRoot: relativePathFromSystemRoot,
      }
    }
}
