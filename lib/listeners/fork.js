'use strict';

// MODULES //

var onTimeout = require( './timeout.js' );


// CREATE LISTENER //

/**
* FUNCTION: createListener( logger, cache, timeout )
*	Returns an event listener.
*
* @param {Logger} logger - logger
* @param {Object} cache - cache in which to store worker timeout refs
* @param {Number} timeout - worker timeout
* @returns {Function} event listener
*/
function createListener( logger, cache, timeout ) {
	/**
	* FUNCTION: listener( worker )
	*	Event listener invoked when a new worker is forked.
	*
	* @param {Object} worker - worker
	* @returns {Void}
	*/
	return function listener( worker ) {
		var clbk;

		logger.info( 'Worker %s spawned. Process id: %d.', worker.id, worker.process.pid );

		clbk = onTimeout( logger, worker );

		cache[ worker.id ] = setTimeout( clbk, timeout );
	}; // end FUNCTION listener()
} // end FUNCTION createListener()


// EXPORTS //

module.exports = createListener;
