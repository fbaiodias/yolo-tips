var args = require('./args')
var goyolo = require('../lib')

if (args instanceof Error) {
  console.error(args.message)
} else {
  var options = {
    weeks: args.weeks,
    origin: args.origin.toUpperCase(),
    destination: args.destination.toUpperCase()
  }
  goyolo(options, function (err, data) {
    if (err) {
      throw err
    }
    console.log(JSON.stringify(data, null, 2))
  })
}
