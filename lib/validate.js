'use strict';

// MODULES //

var isPositiveInteger = require( 'validate.io-positive-integer' ),
	isObject = require( 'validate.io-object' );


// VALIDATE //

/**
* FUNCTION: validate( opts, options )
*	Validates function options.
*
* @param {Object} opts - destination object
* @param {Object} options - function options
* @param {Number} [options.size] - cluster size
* @param {Number} [options.timeout] - worker timeout
* @returns {Error|Null} error or null
*/
function validate( opts, options ) {
	if ( !isObject( options ) ) {
		return new TypeError( 'invalid input argument. Options argument must be an object. Value: `' + options + '`.' );
	}
	if ( options.hasOwnProperty( 'size' ) ) {
		opts.size = options.size;
		if ( !isPositiveInteger( opts.size ) ) {
			return new TypeError( 'invalid option. Cluster size must be a positive integer. Option: `' + opts.size + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'timeout' ) ) {
		opts.timeout = options.timeout;
		if ( !isPositiveInteger( opts.timeout ) ) {
			return new TypeError( 'invalid option. Worker timeout must be a positive integer. Option: `' + opts.timeout + '`.' );
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
