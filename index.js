var skyscanner = require('./lib/skyscanner')
var clone = require('lodash.clone')
var yolo = require('./lib')
var pluck = require('lodash.pluck')
var sort = require('lodash.sortby')

var moment = require('moment')
var async = require('async')
var range = require('lodash.range')
var flatten = require('lodash.flatten')

var MAX_PRICE = 200
var WEEKS = 1
var FORMAT = 'YYYY-MM-DD'
var PAIRS = [
  { from: 5, to: 8 },
  { from: 5, to: 7 },
  { from: 6, to: 8 },
  { from: 6, to: 7 }
]

var options = flatten(mapOptionsToWeeks())

function mapOptionsToWeeks () {
  return range(WEEKS).map(function (w) {
    return PAIRS.map(function (p) {
      return {
        returnDate: moment().day(p.to).add(w, 'week').format(FORMAT),
        departureDate: moment().day(p.from).add(w, 'week').format(FORMAT),
        sortType: 'price_alphabetic'
      }
    })
  })
}

async.map(options, yolo, function (err, data) {
  if (err) {
    throw err
  }
  var merged = data.reduce(function (result, current) {
    return result.concat(current);
  }, [])
  var valid = merged.filter(function (route) {
      return route.price < MAX_PRICE
  })
  console.log('data', JSON.stringify(sort(valid, 'price'), null, 2));
})
