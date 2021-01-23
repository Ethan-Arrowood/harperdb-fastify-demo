const { Pool } = require('undici');
const fp = require('fastify-plugin');

async function hdbClientPlugin (server) {
	const pool = new Pool('http://localhost:9925');
	server.decorate('hdb', {
		client: pool,
		request: ({operation, headers, response}) => pool.stream({
			path: '/',
			method: 'POST',
			body: JSON.stringify(operation),
			headers: {
				'content-type': 'application/json',
				...headers
			},
			opaque: response
		}, ({ opaque }) => opaque.raw)
	})

	server.addHook('onClose', async server => {
		await server.hdbClient.close();
	});
}

module.exports = fp(hdbClientPlugin)