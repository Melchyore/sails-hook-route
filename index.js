let _ = require('@sailshq/lodash')
let detectVerb = require('./lib/detect-verb')

module.exports = sails => {
  return {
    configure () {
      let routes = sails.config.routes
      let router = sails.router
      router.namedRoutes = {}

      _.forIn(routes, (options, route) => {
        if (_.isObject(options) && _.has(options, 'name')) {
          let name = options.name
          let url = detectVerb(route.toLowerCase()).path

          if (!_.has(router.namedRoutes, name)) {
            router.namedRoutes[options.name] = url
          }
        }
      })
    },

    initialize (done) {
      sails.route = (routeName, ...parametersValues) => {
        let route = sails.router.namedRoutes[routeName]

        if (!route) {
          throw new Error('No named route : ' + routeName + '\n Maybe you missed the name property?')
        }

        let parameters = route.match(new RegExp(/:[a-zA-Z_]+/, 'g'))

        if (parameters) {
          let parametersLength = parameters.length
          let valuesLength = parametersValues.length

          if (parametersLength !== valuesLength) {
            console.warn('Length of named parameters (' + parametersLength + ') is not the same as the length of values ' + valuesLength + ' ')
          }

          for (let i = 0; i < parametersLength; ++i) {
            route = route.replace(parameters[i], parametersValues[i])
          }
        }

        return route
      }

      sails.on('router:before', () => {
        sails.router.bind('all /*', (req, res, next) => {
          res.locals.route = sails.route

          return next()
        })
      })

      return done()
    }
  }
}
