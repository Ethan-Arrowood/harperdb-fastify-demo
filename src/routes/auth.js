'use strict'

async function auth (server, options) {
  server.route({
    url: '/get-token',
    method: 'GET',
    handler: async (request, response) => {
      options.hdb.request({
        operation: {
          operation: 'create_authentication_tokens',
          username: request.query.username,
          password: request.query.password
        },
        response
      })
    }
  })
  server.route({
    url: '/refresh-token',
    method: 'GET',
    handler: async (request, response) => {
      options.hdb.request({
        operation: {
          operation: 'refresh_operation_token'
        },
        response
      })
    }
  })
}

module.exports = auth
module.exports.autoPrefix = '/auth'
