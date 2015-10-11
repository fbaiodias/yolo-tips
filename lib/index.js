'use strict'

const async = require('async')
const contains = require('lodash.contains')
const flatten = require('lodash.flatten')
const range = require('lodash.range')
const sort = require('lodash.sortby')
const moment = require('moment')
const search = require('./search')
const findAirport = require('./find-airport')

const FORMAT = 'YYYY-MM-DD'
const PAIRS = [
  { from: 5, to: 8 },
  { from: 5, to: 7 },
  { from: 6, to: 8 },
  { from: 6, to: 7 }
]

function goyolo (options, cb) {
  if (options.search) {
    return findAirport(options, cb)
  }

  function weekToParams(w) {
    return PAIRS.map(function (p) {
      var searchDate = options.searchDate || new Date()
      return {
        origin: options.origin,
        destination: options.destination,
        currency: options.currency,
        country: options.country,
        returnDate: moment(searchDate).day(p.to).add(w, 'week').format(FORMAT),
        departureDate: moment(searchDate).day(p.from).add(w, 'week').format(FORMAT),
        sortType: 'price_alphabetic'
      }
    })
  }

  var params
  if (typeof options.specificNumberOfWeeksFromNow === 'number') {
    params = weekToParams(options.specificNumberOfWeeksFromNow)
  } else {
    params = flatten(range(options.weeks || 1).map(weekToParams))
  }

  async.map(params, options.searchFunction || search, function (err, data) {
    if (err) {
      return cb(err)
    }

    const merged = data.reduce((result, current) => result.concat(current), [])
    const valid = merged.filter(removeIgnored).filter(removePrice)
    return cb(null, sort(valid, 'price'))

    function removeIgnored (route) {
      var id = route.outboundToStationId && route.outboundToStationId.placeId
      return !contains(options.ignore, id)
    }

    function removePrice (route) {
      return route.price < options.max
    }
  })
}

module.exports = goyolo
