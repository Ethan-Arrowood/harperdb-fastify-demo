async function ping (server, options) {
	server.route({
		url: '/ping',
		method: 'GET',
		handler: async () => {
			return 'pong\n'
		}
	});

	console.log(`hdbClient should not exist ${!options.hasOwnProperty('hdbClient')}`)
}

module.exports = ping;