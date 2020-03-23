const fs = require('fs')

// filesPaths can be string or Array of strings
// If it's an array, options.outfile can't be guessed and is required
module.exports = function(filesPaths, options = {}) {
  options = {
    outfile: `${filesPaths}/index`,
    extensions: ['js'],
    ...options
  }

  const { outfile, extensions } = options,
        mode = Array.isArray(filesPaths) ? 'multiDirectory' : 'singleDirectory',
        extensionRegexp = new RegExp(`\\.(?:${extensions.join('|')})$`),
        files = getFiles(filesPaths, mode, extensionRegexp, outfile),
        exported = getExported(files)

  fs.writeFileSync(
    `./${outfile}.js`,
    exported
  )

  switch (mode) {
  case 'singleDirectory':
    console.log(`Indexed ${files.length} files in ${filesPaths}.`)
    break
  case 'multiDirectory':
    console.log(`Indexed ${files.length} files in multiple directories.`)
    break
  }
}

function getFiles (filesPaths, mode, extensionRegexp, outfile) {
  switch (mode) {
  case 'singleDirectory':
    const filesPath = filesPaths // it's a single path in this case, not an array
    return fromDir(filesPath, extensionRegexp, outfile)
  case 'multiDirectory':
    return filesPaths.reduce((files, filesPath) => [...files, ...fromDir(filesPath, extensionRegexp, outfile)], [])
  }
}

function fromDir (filesPath, extensionRegexp, outfile) {
  return fs
    .readdirSync(`./${filesPath}`)
    .filter(file => {
      return (
        file !== 'index.js' &&
        extensionRegexp.test(file) &&
        fs.lstatSync(`./${filesPath}/${file}`).isFile()
      )
    })
    .map(file => {
      const outfileDir = outfile.replace(/\/(?:\w|-)+$/, ''),
            outfileDirRegexp = new RegExp(`^${outfileDir}`),
            relativeFilesPath = filesPath.replace(outfileDirRegexp, ''),
            path = `.${relativeFilesPath}/${file}`

      return {
        path,
        name: file.split('.')[0],
      }
    })
}

function getExported (files) {
  return files.reduce((exported, file) => `${exported}export { default as ${file.name} } from '${file.path}'\n`, '')
}