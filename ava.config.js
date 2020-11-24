import { rollup as configureable } from './src/configureable'

export default {
  files: ['tests/**/*.test.js'],
  verbose: true,
  babel: {
    compileAsTests: [
      'src/**/*',
    ],
    testOptions: configureable.toBabelConfig('node')
  }
}
