'use strict'

const args = require('./args')
const goyolo = require('../lib')

if (args instanceof Error) {
  console.error(args.message)
} else {
  const options = {
    weeks: args.weeks,
    origin: args.origin && args.origin.toUpperCase(),
    destination: args.destination && args.destination.toUpperCase(),
    max: args.max,
    ignore: args.ignore,
    search: args.search
  }
  goyolo(options, function (err, data) {
    if (err) {
      throw err
    }

    console.log(JSON.stringify(data, null, 2))
  })
}
