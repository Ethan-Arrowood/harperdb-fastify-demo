'use strict'

const { authHeaderSchema, searchBreedQuerySchema } = require('../schemas')

async function searchBreeds (server, options) {
  server.route({
    url: '/search-breeds',
    method: 'GET',
    schema: {
      query: searchBreedQuerySchema,
      headers: authHeaderSchema
    },
    handler: async (request, response) => {
      options.hdb.request({
        operation: {
          operation: 'search_by_value',
          schema: 'dev',
          table: 'breeds',
          search_attribute: 'country',
          search_value: request.query.country,
          get_attributes: ['*']
        },
        headers: {
          authorization: `Bearer ${request.headers['x-hdb-authorization']}`
        },
        response
      })
    }
  })
}

module.exports = searchBreeds
