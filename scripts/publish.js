const publish = require('../lib/publish'),
      { 2: type } = process.argv,
      npm = require('npm')

// publish(type)


npm.load(function (e, n) {
  n.commands.version(["patch"], function (error) { 
      // 'error' here equals an error message as shown below
      console.log(error)
  })
})