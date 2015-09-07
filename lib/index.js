var async = require('async')
var flatten = require('lodash.flatten')
var range = require('lodash.range')
var sort = require('lodash.sortby')
var moment = require('moment')
var yolo = require('./search')

var FORMAT = 'YYYY-MM-DD'
var PAIRS = [
  { from: 5, to: 8 },
  { from: 5, to: 7 },
  { from: 6, to: 8 },
  { from: 6, to: 7 }
]

module.exports = search
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
      throw err
    }
    var merged = data.reduce(function (result, current) {
      return result.concat(current)
    }, [])
    var valid = merged.filter(function (route) {
      return route.price < options.max
    })

    console.log('data', JSON.stringify(sort, null, 2))
    return cb(null, sort(valid, 'price'))
  })
}
