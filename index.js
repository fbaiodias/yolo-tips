var Skyscanner = require('skyscanner')
var moment = require('moment')
var async = require('async')

var MAX_PRICE = 60
var WEEKS = 10

var s = new Skyscanner({
  country: 'PT',
  currency: 'EUR'
})

async.times(WEEKS, function (n, next) {
  var opts = []

  opts.push({
    departureDate: moment().day(5).add(n, 'week').format('YYYY-MM-DD'), // Friday
    returnDate: moment().day(8).add(n, 'week').format('YYYY-MM-DD'), // Monday
    sortType: 'price_alphabetic'
  })

  opts.push({
    departureDate: moment().day(5).add(n, 'week').format('YYYY-MM-DD'), // Friday
    returnDate: moment().day(7).add(n, 'week').format('YYYY-MM-DD'), // Sunday
    sortType: 'price_alphabetic'
  })

  opts.push({
    departureDate: moment().day(6).add(n, 'week').format('YYYY-MM-DD'), // Saturday
    returnDate: moment().day(8).add(n, 'week').format('YYYY-MM-DD'), // Monday
    sortType: 'price_alphabetic'
  })

  opts.push({
    departureDate: moment().day(6).add(n, 'week').format('YYYY-MM-DD'), // Saturday
    returnDate: moment().day(7).add(n, 'week').format('YYYY-MM-DD'), // Sunday
    sortType: 'price_alphabetic'
  })

  async.each(opts, function (destinationsOpts, cb) {
    // console.log('GETTING QUOTES', destinationsOpts)

    getQuotes(destinationsOpts, cb)
  }, next)
})

function getQuotes (opts, cb) {
  s.destinations('LIS', 'EVERYWHERE', opts).then(function (data) {
    var cheapRoutes = []
    var cheapPlaces = []
    var filteredData = {}

    var mappedData = {
      routes: {},
      places: {},
      quotes: {}
    }

    filteredData.quotes = data.Quotes.filter(function (q) {
      var isCheap = q.Price < MAX_PRICE && q.Outbound_ToStationId !== 'OPO'
      if (isCheap) {
        cheapRoutes.push(q.RouteId)
      }
      return isCheap
    })

    filteredData.routes = data.Routes.filter(function (r) {
      var isCheap = cheapRoutes.indexOf(r.RouteId) !== -1
      if (isCheap) {
        cheapPlaces.push(r.DestinationId)
        mappedData.routes[r.RouteId] = r
      }
      return isCheap
    })

    filteredData.places = data.Places.filter(function (p) {
      var isCheap = cheapPlaces.indexOf(p.PlaceId) !== -1
      if (isCheap) {
        mappedData.places[p.PlaceId] = p
      }
      return isCheap
    })

    for (var i = 0; i < filteredData.quotes.length; i++) {
      var quote = filteredData.quotes[i]
      // var route = mappedData.routes[quote.RouteId]
      var route = filteredData.routes.filter(function (r) {
        return r.RouteId === quote.RouteId
      })[0]

      route.destination = mappedData.places[route.DestinationId]

      route.quotes = route.quotes || []
      route.quotes.push(quote)
    }

    // console.log('destinations', {
    //   routes: data.Routes,
    //   quotes: data.Quotes,
    //   // places: data.Places,
    //   // carriers: data.Carriers,
    //   // agents: data.Agents,
    // })

    var stuffThatMatters = filteredData.routes.map(function (r) {
      return {
        price: r.quotes[0].Price,
        destination: r.destination,
        departure: moment(r.quotes[0].Outbound_DepartureDate).format('dddd, MMMM Do YYYY'),
        return: moment(r.quotes[0].Inbound_DepartureDate).format('dddd, MMMM Do YYYY'),
        // quotes: r.quotes,
        url: 'http://www.skyscanner.pt/transport/flights/' + r.OriginId + '/' + r.DestinationId + '/' + opts.departureDate + '/' + opts.returnDate + '/'
      }
    })

    if (stuffThatMatters.length > 0) {
      console.log(JSON.stringify(stuffThatMatters, null, 2))
    }

    cb(null, filteredData.routes)
  }).error(function (err) {
    console.log('error', err)
  })
}

// s.calendar('DFWA', 'LHR').then(function(data) {
//   // console.log('calendar', data)
// })

// s.autosuggest('lisboa').then(function(data) {
//   // console.log('autosuggest', data)
// })
