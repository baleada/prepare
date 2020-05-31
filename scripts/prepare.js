const generateIndex = require('../lib/generateIndex')

function prepare () {
  generateIndex(
    'lib',
    { outfile: 'index', type: 'cjs' }
  )
}

prepare()