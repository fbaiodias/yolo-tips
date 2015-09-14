'use strict'

const Skyscanner = require('skyscanner')

const skyscanner = (opt) => {
  opt = opt || {}
  return new Skyscanner({
    country: opt.country || 'PT',
    currency: opt.currency || 'EUR'
  })
}

module.exports = skyscanner
