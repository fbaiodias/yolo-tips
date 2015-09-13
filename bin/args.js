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
    type: 'string'
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
  },
  s: {
    description: 'seach airport id',
    alias: 'search',
    type: 'string'
  },
  i: {
    description: 'ignore destination',
    multiple: true,
    alias: 'ignore',
    type: 'string'
  }
}

module.exports = bossy.parse(definition)
