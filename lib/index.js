'use strict';

// MODULES //

var os = require( 'os' ),
	cluster = require( 'cluster' ),
	isFunction = require( 'validate.io-function' ),
	evts = require( './listeners' ),
	validate = require( './validate.js' );


// VARIABLES //

var NUMCPUS = os.cpus().length,
	TIMEOUT = 5000;


// SERVER CLUSTER //

/**
* FUNCTION: serverCluster( [ options,] logger )
*	Returns a function which creates a server cluster.
*
* @param {Object} [options] - server options
* @param {Number} [options.size] - cluster size
* @param {Number} [options.timeout=5000] - worker timeout (in milliseconds)
* @param {Logger} logger - logger
* @returns {Function} function which creates a server cluster
*/
function serverCluster( options, logger ) {
	var disconnect,
		listening,
		timeouts,
		timeout,
		online,
		fork,
		exit,
		size,
		opts,
		log,
		err;

	if ( arguments.length < 1 ) {
		throw new Error( 'insufficient input arguments. Must provide a logger.' );
	}
	opts = {};
	if ( arguments.length > 1 ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
		log = logger;
	} else {
		log = options;
	}
	if ( opts.size === void 0 ) {
		size = NUMCPUS;
	} else {
		size = opts.size;
	}
	if ( opts.timeout === void 0 ) {
		timeout = TIMEOUT;
	} else {
		timeout = opts.timeout;
	}
	// Initialize a cache for worker timeouts:
	timeouts = {};

	// Create listeners...
	fork = evts.fork( log, timeouts, timeout );
	online = evts.online( log );
	listening = evts.listening( log, timeouts );
	disconnect = evts.disconnect( log );
	exit = evts.exit( log, timeouts );

	/**
	* FUNCTION: create( done )
	*	Creates a server cluster.
	*
	* @param {Function} done - callback to invoke after creating a server cluster
	* @returns {Void}
	*/
	return function create( done ) {
		var cnt = 0,
			worker,
			i;

		if ( !isFunction( done ) ) {
			throw new TypeError( 'invalid input argument. Callback must be a function. Value: `' + done + '`.' );
		}
		log.info( 'Creating a cluster with %d workers.', size );

		for ( i = 0; i < size; i++ ) {
			log.info( 'Spawning worker process %d.', (i+1) );
			worker = cluster.fork();
		}

		cluster.on( 'listening', onReady );
		cluster.on( 'fork', fork );
		cluster.on( 'online', online );
		cluster.on( 'listening', listening );
		cluster.on( 'disconnect', disconnect );
		cluster.on( 'exit', exit );

		/**
		* FUNCTION: onReady()
		*	Event listener invoked when a worker is ready to receive HTTP requests.
		*
		* @private
		* @returns {Void}
		*/
		function onReady() {
			if ( ++cnt === size ) {
				done();
			}
		} // end FUNCTION onReady()
	}; // end FUNCTION create()
} // end FUNCTION serverCluster()


// EXPORTS //

module.exports = serverCluster;
