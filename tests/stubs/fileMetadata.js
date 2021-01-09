import { resolve } from 'path'
const basePath = resolve('')

export const topLevel = {
  name: 'Baleada',
  extension: 'js',
  path: {
    relativeFromRoot: '',
    relativeFromDir: './',
    absolute: `${basePath}/`,
  },
}

export const nested = {
  name: 'Baleada',
  extension: 'js',
  path: {
    relativeFromRoot: '/nested/',
    relativeFromDir: './nested/',
    absolute: `${basePath}/nested/`,
  },
}
