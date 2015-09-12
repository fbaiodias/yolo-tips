'use strict'

const skyscanner = require('./skyscanner')

function findAirport (str, cb) {
  skyscanner.autosuggest(str)
    .then((data) => cb(null, data))
    .catch(cb)
}

module.exports = findAirport
