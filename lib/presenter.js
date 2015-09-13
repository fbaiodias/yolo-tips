'use strict'

const moment = require('moment')

const FORMAT = 'YYYY-MM-DD'

function getUrl (originId, destinationId, outboundDepartureDate, inboundDepartureDate) {
  return 'http://www.skyscanner.pt/transport/flights/' + originId + '/' + destinationId + '/' + moment(outboundDepartureDate).format(FORMAT) + '/' + moment(inboundDepartureDate).format(FORMAT) + '/'
}

function placePresenter (place) {
  return {
    airport: place.name,
    airportCode: place.iataAirportCode,
    city: place.cityName,
    country: place.countryName
  }
}

module.exports = function presenter (result) {
  return {
    price: result.price,
    currencyId: result.currencyId,
    direct: result.direct,

    outbound: {
      departureDate: result.outboundDepartureDate,
      from: placePresenter(result.outboundFromStationId),
      to: placePresenter(result.outboundToStationId)
    },

    inbound: {
      departureDate: result.inboundDepartureDate,
      from: placePresenter(result.inboundFromStationId),
      to: placePresenter(result.inboundToStationId)
    },

    url: getUrl(result.outboundFromStationId.placeId, result.outboundToStationId.placeId, result.outboundDepartureDate, result.inboundDepartureDate)
  }
}
