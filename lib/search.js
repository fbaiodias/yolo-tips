var merge = require('lodash.merge')
var curry = require('lodash.curry')
var flatten = require('lodash.flatten')
var humps = require('humps').camelizeKeys
var skyscanner = require('./skyscanner')
var presenter = require('./presenter')

module.exports = yolo
function yolo (options, cb) {
  skyscanner.destinations(options.origin, options.destination, options)
    .then(function (data) {
      var n = {
        routes: data.Routes.map(humps),
        quotes: data.Quotes.map(humps)
      }
      var iterator = curry(unwindQuotes)(n.quotes)
      return cb(null, flatten(n.routes.map(iterator)).map(presenter))
    })
}

function unwindQuotes (quotes, route) {
  return quotes
    .filter(function (quote) {
      return quote.routeId === route.routeId
    })
    .map(function (quote) {
      return merge(route, quote)
    })
}
