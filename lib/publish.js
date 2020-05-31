const fs = require('fs'),
      npm = require('npm')

const versionRegExp = /"version": "(\d+)\.(\d+)\.(\d+)"/
module.exports = function (type = 'patch', access = 'public') {
  const pkg = fs.readFileSync('./package.json', 'utf8'),
        [_, major, minor, patch] = pkg.match(versionRegExp).map(capture => Number(capture))
  
  let newVersion
  switch (type) {
  case 'major':
    newVersion = `${major + 1}.${minor}.${patch}`
    break
  case 'minor':
    newVersion = `${major}.${minor + 1}.${patch}`
    break
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`
    break
  }

  const newPkg = pkg.replace(versionRegExp, () => `"version": "${newVersion}"`)

  fs.writeFileSync('./package.json', newPkg)

  console.log(`Publishing new ${type} version...`)

  exec(`npm publish --access=${access} --dry-run`)
}
