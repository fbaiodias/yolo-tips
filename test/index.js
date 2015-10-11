'use strict'

var ok = require('assert')

var sinon = require('sinon')

var goyolo = require('..')

const searchDate = new Date(1970, 0, 1)

describe('goyolo', () => {
  var searchStub
  beforeEach(() => { searchStub = sinon.stub().callsArgWithAsync(1, [null, ['x']]) })
  it('goes yolo!', (done) => {
    goyolo({ origin: 'TESTTOWN', searchFunction: searchStub, searchDate: searchDate }, (err, results) => {
      ok(searchStub.called)
      ok.equal(searchStub.callIds.length, 4)
      var searches = searchStub.callIds.map((_, i) => searchStub.getCall(i).args[0])

      searches.forEach((opt) => {
        ok.equal(opt.origin, 'TESTTOWN')
      });

      var departureAndReturn = searches.map((opt) => opt.departureDate + ' -> ' + opt.returnDate)

      ok.deepEqual(departureAndReturn.sort(), [
        '1970-01-02 -> 1970-01-04',
        '1970-01-02 -> 1970-01-05',
        '1970-01-03 -> 1970-01-04',
        '1970-01-03 -> 1970-01-05',
      ])

      done()
    })
  })
  it('Can go yolo in a specific number of weeks for now', (done) => {
    goyolo({ origin: 'TESTTOWN', searchFunction: searchStub, searchDate: searchDate, specificNumberOfWeeksFromNow: 2 }, (err, results) => {
      ok.equal(searchStub.callIds.length, 4)
      var searches = searchStub.callIds.map((_, i) => searchStub.getCall(i).args[0])

      var departureAndReturn = searches.map((opt) => opt.departureDate + ' -> ' + opt.returnDate)

      ok.deepEqual(departureAndReturn.sort(), [
        '1970-01-16 -> 1970-01-18',
        '1970-01-16 -> 1970-01-19',
        '1970-01-17 -> 1970-01-18',
        '1970-01-17 -> 1970-01-19',
      ])

      done()
    })
  })
})

