'use strict'

const async = require('async')
const flatten = require('lodash.flatten')
const range = require('lodash.range')
const sort = require('lodash.sortby')
const moment = require('moment')
const yolo = require('./search')

const FORMAT = 'YYYY-MM-DD'
const PAIRS = [
  { from: 5, to: 8 },
  { from: 5, to: 7 },
  { from: 6, to: 8 },
  { from: 6, to: 7 }
]

function search (options, cb) {
  var params = flatten(mapOptionsToWeeks())
  function mapOptionsToWeeks () {
    return range(options.weeks).map(function (w) {
      return PAIRS.map(function (p) {
        return {
          origin: options.origin,
          destination: options.destination,
          returnDate: moment().day(p.to).add(w, 'week').format(FORMAT),
          departureDate: moment().day(p.from).add(w, 'week').format(FORMAT),
          sortType: 'price_alphabetic'
        }
      })
    })
  }

  async.map(params, yolo, function (err, data) {
    if (err) {
      console.error(err)
      throw err
    }

    const merged = data.reduce((result, current) => result.concat(current), [])
    const valid = merged.filter((route) => route.price < options.max)

    return cb(null, sort(valid, 'price'))
  })
}

module.exports = search
