'use strict'

const fs = require('fs')
const { Client } = require('undici')
const client = new Client('http://localhost:9925')

const data = fs.readFileSync('./data/breeds.csv', { encoding: 'utf8' })

client.request({
  path: '/',
  method: 'POST',
  body: JSON.stringify({
    operation: 'csv_data_load',
    action: 'insert',
    schema: 'dev',
    table: 'breeds',
    data
  }),
  headers: [
    'content-type', 'application/json',
    'authorization', 'Basic SERCX0FETUlOOnBhc3N3b3Jk'
  ]
}, (err, { body }) => {
  if (err) throw err

  body.setEncoding('utf8')
  body.on('data', console.log)

  client.close()
})
