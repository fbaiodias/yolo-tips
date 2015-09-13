'use strict'

const skyscanner = require('./skyscanner')

function findAirport (opt, cb) {
  skyscanner({
    country: opt.country || 'PT',
    currency: opt.currency || 'EUR'
  }).autosuggest(opt.search)
    .then((data) => cb(null, data))
    .catch(cb)
}

module.exports = findAirport
