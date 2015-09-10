'use strict';

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
	* FUNCTION: listener( worker, addr )
	*	Event listener invoked when a worker emits a `listening` event.
	*
	* @private
	* @param {Object} worker - worker
	* @param {Object} addr - worker address
	* @returns {Void}
	*/
	return function listener( worker, addr ) {
		logger.info( 'Worker %s is listening on %s:%d. Process id: %d.', worker.id, addr.address, addr.port, worker.process.pid );

		clearTimeout( cache[ worker.id ] );
	} // end FUNCTION listener()
} // end FUNCTION createListener()


// EXPORTS //

module.exports = createListener;
