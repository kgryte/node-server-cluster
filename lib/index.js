'use strict';

// MODULES //

var os = require( 'os' ),
	cluster = require( 'cluster' ),
	isFunction = require( 'validate.io-function' ),
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
	var timeouts,
		timeout,
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

		cluster.on( 'fork', fork );
		cluster.on( 'online', online );
		cluster.on( 'listening', listening );
		cluster.on( 'listening', onWorker );
		cluster.on( 'disconnect', disconnect );
		cluster.on( 'exit', exit );

		/**
		* FUNCTION: onWorker()
		*	Event listener invoked when a worker is ready to receive HTTP requests.
		*
		* @private
		* @returns {Void}
		*/
		function onWorker() {
			if ( ++cnt === size ) {
				done();
			}
		} // end FUNCTION onWorker()
	}; // end FUNCTION create()

	/**
	* FUNCTION: fork( worker )
	*	Event listener invoked when a new worker is forked.
	*
	* @private
	* @param {Object} worker - worker
	* @returns {Void}
	*/
	function fork( worker ) {
		log.info( 'Worker %s spawned. Process id: %d.', worker.id, worker.process.pid );
		timeouts[ worker.id ] = setTimeout( onTimeout( worker ), timeout );
	} // end FUNCTION fork()

	/**
	* FUNCTION: onTimeout( worker )
	*	Returns a timeout listener.
	*
	* @private
	* @param {Object} worker - worker
	* @returns {Function} timeout listener
	*/
	function onTimeout( worker ) {
		/**
		* FUNCTION: onTimeout()
		*	Callback invoked upon timeout.
		*
		* @private
		* @returns {Void}
		*/
		return function onTimeout() {
			log.error( 'Worker %s timed out. Process id: %d.', worker.id, worker.process.pid );

			// TODO: include logic to kill and then fork

		}; // end FUNCTION onTimeout()
	} // end FUNCTION onTimeout()

	/**
	* FUNCTION: online( worker )
	*	Event listener invoked when a worker is running.
	*
	* @private
	* @param {Object} worker - worker
	* @returns {Void}
	*/
	function online( worker ) {
		log.info( 'Worker %s is running. Process id: %d.', worker.id, worker.process.pid );
	} // end FUNCTION online()

	/**
	* FUNCTION: listening( worker, addr )
	*	Event listener invoked when a worker emits a `listening` event.
	*
	* @private
	* @param {Object} worker - worker
	* @param {Object} addr - worker address
	* @returns {Void}
	*/
	function listening( worker, addr ) {
		log.info( 'Worker %s is listening on %s:%d. Process id: %d.', worker.id, addr.address, addr.port, worker.process.pid );
		clearTimeout( timeouts[ worker.id ] );
	} // end FUNCTION listening()

	/**
	* FUNCTION: disconnect( worker )
	*	Event listener invoked after a worker IPC channel has disconnected.
	*
	* @private
	* @param {Object} worker - worker
	* @returns {Void}
	*/
	function disconnect( worker ) {
		log.info( 'Worker %s disconnected. Process id: %d.', worker.id, worker.process.pid );
	} // end FUNCTION disconnect()

	/**
	* FUNCTION: exit( worker, code, signal )
	*	Event listener invoked when a worker dies.
	*
	* @private
	* @param {Object} worker - worker
	* @param {Number} code - exit code
	* @param {String} signal - exit signal
	* @returns {Void}
	*/
	function exit( worker, code, signal ) {
		clearTimeout( timeouts[ worker.id ] );
		if ( signal ) {
			log.info( 'Worker %s was killed (%s). Process id: %d.', worker.id, signal, worker.process.pid );
			return;
		}
		if ( code !== 0 ) {
			log.error( 'Worker %s exited with error code: %d. Process id: %d.', worker.id, code, worker.process.pid );
		} else {
			log.info( 'Worker %s exited successfully. Process id: %d.', worker.id, worker.process.pid );
		}
		if ( !worker.suicide ) {
			log.info( 'Restarting worker %s.', worker.id );
			cluster.fork();
		}
	} // end FUNCTION exit()
} // end FUNCTION serverCluster()


// EXPORTS //

module.exports = serverCluster;
