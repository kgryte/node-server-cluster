'use strict';

var cluster = require( 'cluster' ),
	bunyan = require( 'bunyan' ),
	express = require( 'express' ),
	httpServer = require( '@kgryte/http-server' ),
	serverCluster = require( './../lib' );


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
