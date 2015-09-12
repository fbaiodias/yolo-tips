'use strict'

const Skyscanner = require('skyscanner')

const skyscanner = new Skyscanner({
  country: 'PT',
  currency: 'EUR'
})

module.exports = skyscanner
