'use strict';

/**
* FUNCTION: worker()
*	Mocks a worker.
*
* @returns {Object} mock worker
*/
function worker() {
	return {
		'id': 1,
		'process': {
			'pid': 5678
		},
		'suicide': true
	};
} // end FUNCTION worker()


// EXPORTS //

module.exports = worker;
