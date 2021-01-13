const { Pool } = require('undici');
const fp = require('fastify-plugin');

async function hdbClientPlugin (server) {
	server.decorate('hdbClient', new Pool('http://localhost:9925'))

	server.addHook('onClose', async server => {
		await server.hdbClient.close();
	});
}

module.exports = fp(hdbClientPlugin)