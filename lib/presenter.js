'use strict'

const moment = require('moment')

const FORMAT = 'YYYY-MM-DD'

function getUrl (originId, destinationId, outboundDepartureDate, inboundDepartureDate) {
  return 'http://www.skyscanner.pt/transport/flights/' + originId + '/' + destinationId + '/' + moment(outboundDepartureDate).format(FORMAT) + '/' + moment(inboundDepartureDate).format(FORMAT) + '/'
}

module.exports = function presenter (result) {
  return {
    originId: result.originId,
    destinationId: result.destinationId,
    direct: result.direct,
    price: result.price,
    currencyId: result.currencyId,

    outboundAgentIds: result.outboundAgentIds,
    outboundCarrierIds: result.outboundCarrierIds,
    outboundFromStationId: result.outboundFromStationId,
    outboundToStationId: result.outboundToStationId,
    outboundDepartureDate: result.outboundDepartureDate,

    inboundAgentIds: result.inboundAgentIds,
    inboundCarrierIds: result.inboundCarrierIds,
    inboundFromStationId: result.inboundFromStationId,
    inboundToStationId: result.inboundToStationId,
    inboundDepartureDate: result.inboundDepartureDate,

    url: getUrl(result.originId, result.destinationId, result.outboundDepartureDate, result.inboundDepartureDate)
  }
}
