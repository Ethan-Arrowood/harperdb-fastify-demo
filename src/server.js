'use strict'

const autoload = require('fastify-autoload')
const path = require('path')

async function createServer (server) {
  server.register(autoload, {
    dir: path.join(__dirname, 'plugins')
  })

  server.register(autoload, parent => ({
    dir: path.join(__dirname, 'routes'),
    options: {
      prefix: 'api',
      hdb: parent.hdb
    }
  }))
}

module.exports = createServer
