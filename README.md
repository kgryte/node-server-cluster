Server Cluster
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Server [cluster](https://nodejs.org/api/cluster.html).


## Installation

``` bash
$ npm install @kgryte/server-cluster
```


## Usage

``` javascript
var serverCluster = require( '@kgryte/server-cluster' );
```

#### serverCluster( [ options,] logger )

Returns a `function` to create a server [cluster](https://nodejs.org/api/cluster.html).

``` javascript
var bunyan = require( 'bunyan' );

// Create a logger...
var logger = bunyan.createLogger({
	'name': 'logger',
	'streams': [
		{
			'name': 'main',
			'level': 'info',
			'stream': process.stdout
		}
	]
});

// Specify cluster options...
var opts = {
	'size': 8,
	'timeout': 2500 // [ms]
};

// Create a function for creating a server cluster...
var create = serverCluster( opts, logger );
```

The `function` accepts the following `options`:

*	__size__: cluster size. Default: `num_cpus`.
*	__timeout__: maximum allowed time for a new worker to be ready to receive HTTP requests before being considered unhealthy. Default: `5000` [ms].


#### create( done )

Creates a server [cluster](https://nodejs.org/api/cluster.html).

``` javascript
function done() {
	console.log( 'Success!' );
	process.exit( 0 );
}

create( done );
```


## Notes

*	This module does __not__, by itself, create `server` instances. Instead, the module expects to be used in conjunction with code which handles server creation. See the [examples](#examples) below.
*	For server creation modules, see
	-	[http-server](https://github.com/kgryte/node-http-server)
	-	[https-server](https://github.com/kgryte/node-https-server)


## Examples

``` javascript
var cluster = require( 'cluster' ),
	bunyan = require( 'bunyan' ),
	express = require( 'express' ),
	httpServer = require( '@kgryte/http-server' ),
	serverCluster = require( '@kgryte/server-cluster' );


// LOGGER //

// Create a logger...
var logger = bunyan.createLogger({
	'name': 'logger',
	'streams': [
		{
			'name': 'main',
			'level': 'info',
			'stream': process.stdout
		}
	]
});


// CLUSTER //

var createCluster;

/**
* FUNCTION: onCluster()
*	Callback invoked once all workers are running and a cluster is ready to receive HTTP requests.
*
* @returns {Void}
*/
function onCluster() {
	console.log( 'Cluster is successfully running!' );
}

// If the current process is a 'master' process, create a server cluster...
if ( cluster.isMaster ) {
	// Create a function for creating a server cluster...
	createCluster = serverCluster( logger );

	// Create the cluster...
	return createCluster( onCluster );
}


// SERVER/WORKER //

// Specify server options...
var opts = {
	'port': 7331
};

// Create an express app:
var app = express();

// Create a function for creating an HTTP server...
var createServer = httpServer( opts, logger, app );

/**
* FUNCTION: done( error, server )
*	Callback invoked once a server is ready to receive HTTP requests.
*
* @param {Error|Null} error - error object
* @param {Server} server - server instance
* @returns {Void}
*/
function done( error, server ) {
	if ( error ) {
		throw error;
	}
	console.log( server.address() );

	// Close the server and exit:
	setTimeout( onTimeout, 2500 );
}

/**
* FUNCTION: onTimeout()
*	Callback invoked after a specified interval. Kills the current worker process.
*
* @returns {Void}
*/
function onTimeout() {
	logger.info( 'Killing worker %s. Process id: %d.', cluster.worker.id, cluster.worker.process.pid );
	cluster.worker.kill();
}

// Create a server:
createServer( done );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/@kgryte/server-cluster.svg
[npm-url]: https://npmjs.org/package/@kgryte/server-cluster

[travis-image]: http://img.shields.io/travis/kgryte/node-server-cluster/master.svg
[travis-url]: https://travis-ci.org/kgryte/node-server-cluster

[codecov-image]: https://img.shields.io/codecov/c/github/kgryte/node-server-cluster/master.svg
[codecov-url]: https://codecov.io/github/kgryte/node-server-cluster?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/node-server-cluster.svg
[dependencies-url]: https://david-dm.org/kgryte/node-server-cluster

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/node-server-cluster.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/node-server-cluster

[github-issues-image]: http://img.shields.io/github/issues/kgryte/node-server-cluster.svg
[github-issues-url]: https://github.com/kgryte/node-server-cluster/issues
