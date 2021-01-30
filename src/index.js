'use strict'

const fastify = require('fastify')
const createServer = require('./server')

async function run () {
  process.on('unhandledRejection', err => {
    console.error(err)
    process.exit(1)
  })

  if (!process.env.HDB_ORIGIN) {
    throw Error('Missing env variable HDB_ORIGIN')
  }

  const app = fastify()

  await app.register(createServer)

  await app.ready()

  console.log(app.printRoutes())

  await app.listen(3000)
}

run()
