async function ping (server, options) {
	server.route({
		url: '/ping-private',
		method: 'GET',
		handler: async () => {
			return 'pong-private\n'
		}
	});

	console.log(`hdbClient should exist ${options.hasOwnProperty('hdbClient')}`)
}

module.exports = ping;