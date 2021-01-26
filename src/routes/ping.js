'use strict'

async function ping (server, options) {
  server.route({
    url: '/ping',
    method: 'GET',
    handler: async () => {
      return 'pong\n'
    }
  })
}

module.exports = ping
