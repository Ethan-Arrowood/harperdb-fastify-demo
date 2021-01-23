const fastify = require('fastify');
const autoload = require('fastify-autoload');
const path = require('path');

async function createServer (server) {
	server.register(autoload, {
		dir: path.join(__dirname, 'plugins')
	});

	server.register(autoload, parent => ({
		dir: path.join(__dirname, 'routes'),
		options: {
			prefix: 'api',
			hdb: parent.hdb
		}
	}))
}

async function run () {
	process.on('unhandledRejection', err => {
		console.error(err);
		process.exit(1);
	});

	const app = fastify();

	await app.register(createServer);

	await app.ready()

	console.log(app.printRoutes())

	await app.listen(3000);

	// setTimeout(() => {
	// 	app.close()
	// }, 2000);
}

run();


