var Skyscanner = require('skyscanner');
var PushBullet = require('pushbullet');

var config = require('config');

var s = new Skyscanner({
  country: 'PT',
  currency: 'EUR'
});
var pusher = new PushBullet(config.pushbullet.token);

// pusher.devices(function(err, response) {
//   // response is the JSON response from the API
//   console.log({err: err, response: response.devices}, 'devices');
// });

// pusher.me(function(err, response) {
//   // response is the JSON response from the API
//   console.log({err: err, response: response}, 'me');
// });

// pusher.note('xicombd@gmail.com', 'Hello world!', '#yoloFlight says hi!', function(err, response) {
//   // response is the JSON response from the API
//   console.log({err: err, response: response}, 'note');
// });

var destinationsOpts = {
  departureDate: 'anytime',
  returnDate: 'anytime',
  sortType: 'price_alphabetic'
};

s.destinations('LIS', 'ANYWHERE', destinationsOpts).then(function(data) {
  var cheapRoutes = [];
  var cheapPlaces = [];
  var filteredData = {};

  var mappedData = {
    routes: {},
    places: {},
    quotes: {}
  }

  filteredData.quotes = data.Quotes.filter(function(q) {
    var isCheap = q.Price < 50;
    if(isCheap) {
      cheapRoutes.push(q.RouteId);
    }
    return isCheap;
  });

  filteredData.routes = data.Routes.filter(function(r) {
    var isCheap = cheapRoutes.indexOf(r.RouteId) != -1;
    if(isCheap) {
      cheapPlaces.push(r.DestinationId);
      mappedData.routes[r.RouteId] = r;
    }
    return isCheap;
  });

  filteredData.places = data.Places.filter(function(p) {
    var isCheap = cheapPlaces.indexOf(p.PlaceId) != -1;
    if(isCheap) {
      mappedData.places[p.PlaceId] = p;
    }
    return isCheap;
  });

  for(var i=0; i<filteredData.quotes.length; i++) {
    var quote = filteredData.quotes[i];
    // var route = mappedData.routes[quote.RouteId];
    var route = filteredData.routes.filter(function(r) {
      return r.RouteId == quote.RouteId;
    })[0];

    route.destination = mappedData.places[route.DestinationId];

    route.quotes = route.quotes || [];
    route.quotes.push(quote);
  }


  // console.log('destinations', {
  //   routes: data.Routes,
  //   quotes: data.Quotes,
  //   // places: data.Places,
  //   // carriers: data.Carriers,
  //   // agents: data.Agents,
  // })

  console.log('cheap destinations', JSON.stringify(filteredData.routes, null, 2))
});;

s.calendar('DFWA', 'LHR').then(function(data) {
  // console.log('calendar', data)
});


s.autosuggest('lisboa').then(function(data) {
  // console.log('autosuggest', data)
});