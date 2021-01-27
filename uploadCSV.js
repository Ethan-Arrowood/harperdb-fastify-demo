'use strict'

const fs = require('fs')
const { Client } = require('undici')

const client = new Client('http://localhost:9925')

const CSVS = {
  breeds: './data/breeds.csv',
  dogs: './data/dog_data.csv',
  names: './data/dogNames.csv'
}

const data = fs.readFileSync(CSVS.breeds, { encoding: 'utf8' })

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
