import { configureable } from './src/configureable'
import { external } from './external'

const shared = new configureable.Rollup()
        .input([
          'src/configureable.ts',
          'src/getIcons.ts',
          'src/empty.ts',
          'src/Testable.ts',
          'src/withPuppeteer.ts',
          'src/withPlaywright.ts',
          'src/virtual-util.ts',
        ])
        .external(external)
        .typescript()
        .json()
        .resolve(),
      esm = shared
        .delete({ targets: 'lib/*', verbose: true })
        .esm({ file: 'lib/index.js', target: 'node' })
        .analyzer()
        .configure(),
      cjs = shared
        .cjs({ file: 'lib/index.cjs' })
        .configure(),
      dts = new configureable.Rollup()
        .input([
          'types/configureable.d.ts',
          'types/getIcons.d.ts',
          'types/empty.d.ts',
          'types/Testable.d.ts',
          'types/withPuppeteer.d.ts',
          'types/withPlaywright.d.ts',
          'types/virtual.d-util.ts',
        ])
        .external(external)
        .output({ file: 'lib/index.d.ts', format: 'esm' })
        .dts()
        .configure()

export default [
  esm,
  cjs,
  dts,
]
