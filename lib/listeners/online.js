'use strict';

// CREATE LISTENER //

/**
* FUNCTION: createListener( logger )
*	Returns an event listener.
*
* @param {Logger} logger - logger
* @returns {Function} event listener
*/
function createListener( logger ) {
	/**
	* FUNCTION: listener( worker )
	*	Event listener invoked when a worker is running.
	*
	* @param {Object} worker - worker
	* @returns {Void}
	*/
	return function listener( worker ) {
		logger.info( 'Worker %s is running. Process id: %d.', worker.id, worker.process.pid );
	}; // end FUNCTION listener()
} // end FUNCTION createListener()


// EXPORTS //

module.exports = createListener;
