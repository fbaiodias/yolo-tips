var merge = require('lodash.merge')
var curry = require('lodash.curry')
var flatten = require('lodash.flatten')
var humps = require('humps').camelizeKeys
var skyscanner = require('./skyscanner')

module.exports = yolo
function yolo(options, cb) {
  skyscanner.destinations('LIS', 'EVERYWHERE', options).then(function (data) {
    var n = {
      routes: data.Routes.map(humps),
      quotes: data.Quotes.map(humps)
    }
    var iterator = curry(unwindQuotes)(n.quotes)
    return cb(null, flatten(n.routes.map(iterator)))
  });
}

function unwindQuotes(quotes, route) {
  return quotes
    .filter(function (quote) {
      return quote.routeId === route.routeId
    })
    .map(function (quote) {
      return merge(route, quote)
    })
}
