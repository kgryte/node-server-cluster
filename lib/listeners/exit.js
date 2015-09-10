'use strict';

// MODULES //

var cluster = require( 'cluster' );


// CREATE LISTENER //

/**
* FUNCTION: createListener( logger, cache )
*	Returns an event listener.
*
* @param {Logger} logger - logger
* @param {Object} cache - cache containing worker timeout refs
* @returns {Function} event listener
*/
function createListener( logger, cache ) {
	/**
	* FUNCTION: listener( worker, code, signal )
	*	Event listener invoked when a worker dies.
	*
	* @param {Object} worker - worker
	* @param {Number} code - exit code
	* @param {String|Null} signal - exit signal
	* @returns {Void}
	*/
	return function listener( worker, code, signal ) {
		clearTimeout( cache[ worker.id ] );
		if ( signal ) {
			logger.info( 'Worker %s was killed (%s). Process id: %d.', worker.id, signal, worker.process.pid );
			return;
		}
		if ( code !== 0 ) {
			logger.error( 'Worker %s exited with error code: %d. Process id: %d.', worker.id, code, worker.process.pid );
		} else {
			logger.info( 'Worker %s exited successfully. Process id: %d.', worker.id, worker.process.pid );
		}
		if ( !worker.suicide ) {
			logger.info( 'Restarting worker %s.', worker.id );
			cluster.fork();
		}
	}; // end FUNCTION listener()
} // end FUNCTION createListener()


// EXPORTS //

module.exports = createListener;
