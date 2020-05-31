const generateIndex = require('../lib/generateIndex')

function prepare () {
  console.log('here')
  generateIndex(
    'lib',
    { outfile: 'index', type: 'cjs' }
  )
}

prepare()