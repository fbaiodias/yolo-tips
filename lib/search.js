'use strict'

const merge = require('lodash.merge')
const curry = require('lodash.curry')
const flatten = require('lodash.flatten')
const humps = require('humps').camelizeKeys
const skyscanner = require('./skyscanner')
const presenter = require('./presenter')

function search (options, cb) {
  skyscanner.destinations(options.origin, options.destination, options)
    .then(function (data) {
      let n = {
        routes: [],
        quotes: []
      }

      if (data.Routes && data.Quotes) {
        n = {
          routes: data.Routes.map(humps),
          quotes: data.Quotes.map(humps)
        }
      }

      const iterator = curry(unwindQuotes)(n.quotes)
      return cb(null, flatten(n.routes.map(iterator)).map(presenter))
    }).catch(cb)
}

function unwindQuotes (quotes, route) {
  return quotes
    .filter((quote) => quote.routeId === route.routeId)
    .map((quote) => merge(route, quote))
}

module.exports = search
