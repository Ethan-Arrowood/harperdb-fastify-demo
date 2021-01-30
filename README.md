# HarperDB & Fastify Demo

> This repo contains the demo application developed during the Build a REST API with Fastify and HarperDB livestream event. Watch the recording on YouTube [here](https://www.youtube.com/watch?v=zc5VM01_pxo).

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js v14](https://nodejs.org/en/)

## Running Locally

1. Clone and `cd` into this repo locally
2. Launch Docker and from your terminal run `docker-compose up` to launch HarperDB locally. 
> The docker-compose.yml file will mount HarperDB's file system to the local directory under `hdb_data`
3. Navigate to `http://localhost:9925` in your browser to access HarperDB Studio.
4. Create a schema titled `"dev"` and a table titled `"breeds"`.
5. Install the Node.js package dependencies with `npm install`
6. Upload the provided CSV data by running `node uploadCSV.js`
7. Launch the Fastify app with `npm run start`
> The npm script uses dotenv to load the HarperDB origin. If you modify this value in `docker-compose.yml` make sure to change it in `.env` as well.
8. Query the Fastify app at `http://localhost:3000` using tools such as Postman or Insomnia

## Application Details

The application demonstrates multiple aspects of building a REST API with Fastify and HarperDB. At its core, the application demonstrates Fastify's encapsulation and plugin pattern. Everything in a Fastify app can be a plugin. From the aptly named `hdbPlugin` to the individual routes. Though not demonstrated in this app, even schemas can be loaded in via a plugin and made available to other, encapsulated plugins.

As stated, the server itself is defined as a plugin in [src/server.js](./src/server.js). It loads all plugins and routes from the respective directories using the [fastify-autoload](https://github.com/fastify/fastify-autoload) plugin. The routes are passed a reference to the object defined by the custom HarperDB plugin from [src/plugins/hdb.js](./src/plugins/hdb.js) (more on this plugin later). Each file in the routes folder represents one or more routes encapsulated in their own plugin function. All of them have access to the HarperDB request client via the `options` argument. The routes are also all prefixed by `/api` via the autoload plugin. The [ping](./src/routes/ping.js) route plugin is fairly standard; it defines one route `/ping` that returns the plain-text string `pong\n`. The [auth](./src/routes/auth.js) route plugin defines two routes (`/get-token` and `/refresh-token`) and also adds an `/auth` prefix to them.

> The auth routes are **not** reflective of an actual authentication flow for a REST API. These were included in their current form in order to demonstrate the HarperDB JWT capabilities.

The [search](./src/routes/search.js) route plugin defines the route `/search-breeds`. Using the built-in Fastify schema validation, the route requires the user to pass a custom `x-hdb-authorization` header and a querystring entry `country=`. The header is the `access_token` returned by a request to `/api/auth/get-token`, and some example values for the querystring are: `?country=AUSTRALIA` and `?country=IRELAND`. This request will query the demo's `dev/breeds` table with a [search_by_value](https://docs.harperdb.io/#adfe7be6-31b6-4f58-9155-e880d4114855) operation. The result from HarperDB is directly piped back to the user through the API response stream.

The custom HarperDB plugin referenced throughout the application (defined in [src/plugins/hdb.js](./src/plugins/hdb.js)) is based on the Node.js HTTP library, [undici](https://github.com/nodejs/undici#undici). It instantiates an Undici Pool with the HarperDB instance. Using that pool, it defines a function `request` that has been copied below for the reader's convenience.

```js
const pool = new Undici.Pool(process.env.HDB_ORIGIN)
const request = ({ operation, headers, response }) => pool.stream({
	path: '/',
	method: 'POST',
	body: JSON.stringify(operation),
	headers: {
		'content-type': 'application/json',
		...headers
	},
	opaque: response
}, ({ opaque }) => opaque.raw)
```

A lot is happening in the custom `request` method. In short, it wraps a call to [`Undici.Pool.stream(opts, factory)`](https://github.com/nodejs/undici#clientstreamopts-factorydata-callbackerr-promisevoid). This method will pipe the response from the HTTP request defined by the `opts` object argument to a Node.js [Writable](https://nodejs.org/dist/latest-v14.x/docs/api/stream.html#stream_writable_streams) stream returned by the `factory` function argument. The `request` method defines one argument with three properties `operation`, `headers`, and `response`. The `operation` argument is a HarperDB JSON operation; it is stringified and assigned to the `body` of the subsequent Undici HTTP request. Similarly, the `headers` argument exists so that the user can pass along any necessary headers for the request to HarperDB. One such header is an `authorization` header. The `response` argument expects to be a Fastify [Reply](https://www.fastify.io/docs/latest/Reply) instance. This instance is passed to the `opaque` property of the Undici request so that is passed along to the `factory` function (and thus avoiding an unnecessary closure). The `factory` function is defined as an anonymous function that destructures the previously mentioned `opaque` property and then immediately returned the `opaque.raw` property. Working back up the chain, this property references the Fastify Reply's underlying Writable stream instance via [`reply.raw`](https://www.fastify.io/docs/latest/Reply/#raw).

> Generally, it is not a great idea to use the Fastify Response.raw property since it skips over all of the things Fastify does to a request response. Make sure to consider these tradeoffs before using this in your own application.

## Data Sources
- [dog_data.csv](https://www.kaggle.com/kingburrito666/largest-dog-breed-data-set?select=2017.csv)
- [breeds.csv](https://s3.amazonaws.com/complimentarydata/breeds.csv)
- [dog_names.csv](https://data.world/anchorage/a9a7-y93v)

## Contributing

Since this repo represents an application built during a live event I will **not** be maintaining it like a normal repository. If you'd like to send a PR fixing an out-of-date dependency or addressing a noticeable bug; feel free to do so. I've disabled issues to reduce notification noise, but left discussions on if folks would like to discuss any part of the demo application.