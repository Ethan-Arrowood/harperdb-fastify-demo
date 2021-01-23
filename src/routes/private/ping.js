async function ping (server, options) {
	server.route({
		url: '/ping-private',
		method: 'GET',
		handler: async () => {
			return 'pong-private\n'
		}
	});
}

module.exports = ping;