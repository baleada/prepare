import { statSync } from 'fs'
import toIds from './toIds.js'

export default function toFileIds (dir) {
  return toIds(dir).filter(item => statSync(item).isFile())
}
