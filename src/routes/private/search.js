async function searchBreeds (server, options) {
	server.route({
		url: '/search-breeds',
		method: 'GET',
		handler: async (request, response) => {
			options.hdb.client.stream({
				path: '/',
				method: 'POST',
				body: JSON.stringify({
					"operation":"search_by_value",
					"schema":"dev",
					"table":"breeds",
					"search_attribute":"country",
					"search_value":request.query.country,
					"get_attributes":["*"]
				}),
				headers: [
					'content-type', 'application/json',
					'authorization', 'Basic SERCX0FETUlOOnBhc3N3b3Jk'
				],
				opaque: response
			}, ({ opaque }) => opaque.raw);
		}
	});
}

module.exports = searchBreeds;