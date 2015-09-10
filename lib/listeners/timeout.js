'use strict';

/**
* FUNCTION: createListener( logger, worker )
*	Returns a timeout listener.
*
* @param {Logger} logger - logger
* @param {Object} worker - worker
* @returns {Function} timeout listener
*/
function createListener( logger, worker ) {
	/**
	* FUNCTION: listener()
	*	Callback invoked upon timeout.
	*
	* @returns {Void}
	*/
	return function listener() {
		logger.error( 'Worker %s timed out. Process id: %d.', worker.id, worker.process.pid );

		// TODO: include logic to kill and then fork

	}; // end FUNCTION listener()
} // end FUNCTION createListener()


// EXPORTS //

module.exports = createListener;
