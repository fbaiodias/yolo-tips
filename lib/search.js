'use strict'

const merge = require('lodash.merge')
const first = require('lodash.first')
const flatten = require('lodash.flatten')
const humps = require('humps').camelizeKeys
const skyscanner = require('./skyscanner')
const presenter = require('./presenter')

module.exports = search
function search (options, cb) {
  const scanner = skyscanner({
    currency: options.currency || 'EUR',
    country: options.country || 'PT'
  })
    .destinations(options.origin, options.destination, options)
    .then(function (payload) {
      const data = humps(payload)
      if (data.routes) {
        return cb(null, flatten(data.routes.map(unwind))
          .map(populate).filter(removeInvalid).map(presenter))
      }
      return cb(null, [])
      function unwind (route) {
        return data.quotes
          .filter(function (quote) {
            return quote.routeId === route.routeId
          })
          .map(function (quote) {
            return merge(route, quote)
          })
      }
      function populate (route) {
        route.outboundFromStationId = first(data.places.filter(function (place) {
          return place.placeId === route.outboundFromStationId
        }))
        route.outboundToStationId = first(data.places.filter(function (place) {
          return place.placeId === route.outboundToStationId
        }))
        route.inboundToStationId = first(data.places.filter(function (place) {
          return place.placeId === route.inboundToStationId
        }))
        route.inboundFromStationId = first(data.places.filter(function (place) {
          return place.placeId === route.inboundFromStationId
        }))
        route.outboundAgentIds = first(route.outboundAgentIds.map(function (id) {
          return data.agents.filter(function (agent) {
            return agent.agentId === id
          })
        }))
        route.inboundAgentIds = first(route.inboundAgentIds.map(function (id) {
          return data.agents.filter(function (agent) {
            return agent.agentId === id
          })
        }))
        route.outboundCarrierIds = first(route.outboundCarrierIds.map(function (id) {
          return data.carriers.filter(function (carrier) {
            return carrier.carrierId === id
          })
        }))
        route.inboundCarrierIds = first(route.inboundCarrierIds.map(function (id) {
          return data.carriers.filter(function (carrier) {
            return carrier.carrierId === id
          })
        }))
        return route
      }
      function removeInvalid (route) {
        return route.outboundFromStationId !== void 0
      }
    }).catch(cb)
}
