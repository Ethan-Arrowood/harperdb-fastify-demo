const authorizedHeaderSchema = {
	type: 'object',
	properties: {
		'x-hdb-authorization': { type: 'string' }
	},
	required: ['x-hdb-authorization']
}

module.exports = {
	authorizedHeaderSchema
}