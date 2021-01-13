const autoload = require('fastify-autoload');
const path = require('path');

async function loadPublicRoutes (server, options) {
	server.register(autoload, {
		dir: path.join(__dirname, 'public'),
		dirNameRoutePrefix: false,
		options: {
			prefix: '/api'
		}
	});
}

async function loadPrivateRoutes (server, options) {
	server.addHook('preValidation', async function (request, reply) {
		console.log('preval hook for private routes only')
	});
	server.register(autoload, {
		dir: path.join(__dirname, 'private'),
		dirNameRoutePrefix: false,
		options: {
			prefix: '/api',
			hdbClient: options.hdbClient
		}
	});
}

async function loadRoutes (server, options) {
	server.register(loadPublicRoutes, options);
	server.register(loadPrivateRoutes, options);
}

module.exports = loadRoutes