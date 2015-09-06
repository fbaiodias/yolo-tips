var args = require('./args')
var goyolo = require('../lib')

if (args instanceof Error) {
  console.error(args.message)
  return
}

console.log(args)
goyolo()
  
