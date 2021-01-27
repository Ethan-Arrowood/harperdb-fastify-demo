'use strict'

const fastify = require('fastify')
const createServer = require('./server')

async function run () {
  process.on('unhandledRejection', err => {
    console.error(err)
    process.exit(1)
  })

  const app = fastify()

  await app.register(createServer)

  await app.ready()

  console.log(app.printRoutes())

  await app.listen(3000)
}

run()
