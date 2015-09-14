#!/usr/bin/env node

'use strict'

const args = require('./args')
const goyolo = require('../lib')

if (args instanceof Error) {
  console.error(args.message)
} else {
  const options = {
    weeks: args.weeks,
    origin: args.origin && args.origin.toUpperCase(),
    currency: args.currency,
    destination: args.destination && args.destination.toUpperCase(),
    max: args.max,
    ignore: args.ignore,
    term: args.term
  }
  goyolo(options, function (err, data) {
    if (err) {
      throw err
    }

    console.log(JSON.stringify(data, null, 2))
  })
}
