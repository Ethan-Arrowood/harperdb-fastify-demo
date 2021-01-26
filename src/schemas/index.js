'use strict'

const S = require('fluent-json-schema')

const idBase = 'http://harperdb-fastify-demo'

const authHeaderSchema = S.object()
  .id(`${idBase}/authHeader`)
  .title('Authorized Header Schema')
  .description('A schema for the custom header x-hdb-authorization')
  .prop(
    'x-hdb-authorization',
    S.string().required()
  )

const searchBreedQuerySchema = S.object()
  .id(`${idBase}/searchBreedQuery`)
  .title('searchBreed route query schema')
  .description('Schema detailing the /searchBreed query structure')
  .prop(
    'country',
    S.string().required()
  )

module.exports = {
  authHeaderSchema,
  searchBreedQuerySchema
}
