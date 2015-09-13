'use strict'

const skyscanner = require('./skyscanner')

function findAirport (str, cb) {
  skyscanner({ country: 'PT', currency: 'EUR' }).autosuggest(str)
    .then((data) => cb(null, data))
    .catch(cb)
}

module.exports = findAirport
