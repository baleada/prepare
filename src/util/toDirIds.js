import { statSync } from 'fs'
import toIds from './toIds.js'

export default function toDirIds (dir) {
  return toIds(dir).filter(item => statSync(item).isDirectory())
}
