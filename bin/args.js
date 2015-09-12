'use strict'

const bossy = require('bossy')

const definition = {
  c: {
    description: 'currency',
    alias: 'currency',
    type: 'string',
    default: 'eur'
  },
  w: {
    description: 'weeks',
    alias: 'weeks',
    type: 'number',
    default: 4
  },
  o: {
    description: 'origin',
    alias: 'origin',
    type: 'string',
    require: true
  },
  d: {
    description: 'destination',
    alias: 'destination',
    type: 'string',
    default: 'everywhere'
  },
  m: {
    description: 'max price',
    alias: 'max',
    type: 'number',
    default: 100
  }
}

module.exports = bossy.parse(definition)
