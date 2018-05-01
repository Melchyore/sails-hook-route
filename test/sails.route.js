let should = require('chai').should()
let assert = require('chai').assert

let $Sails = require('sails').Sails

describe('sails.route()', () => {
  let sails;

  before(function (done) {
    sails = $Sails().lift({
      hooks: {
        route: require('../'),
        grunt: false
      },
      log: {
        level: 'error'
      },
      routes: {
        'GET /test/:id': {name: 'test', controller: 'test', action: 'foo'}
      },
      controllers: {
        moduleDefinitions: {
          test: {
            fn: function() {}
          }
        }
      }
    }, (err, _sails) => {
      if (err) return done(err)

      sails = _sails

      return done()
    })
  })

  after(done => {
    if (sails) return sails.lower(done)

    return done()
  })

  it('sails.router.namedRoutes should exist', () => {
    sails.router.should.have.property('namedRoutes')
  })

  it('sails.route should exist and be a function', () => {
    sails.should.have.property('route')
    assert.typeOf(sails.route, 'function')
  })

  it('sails.route() should return /test/2', () => {
    assert.equal(sails.route('test', 2), '/test/2')
  })

  it('sails.route() should fail', () => {
    assert.equal(sails.route('test', 1), '/test/2')
  })
})
