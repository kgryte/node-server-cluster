'use strict';

// MODULES //

var bunyan = require( 'bunyan' );


// LOGGER //

var logger = bunyan.createLogger({
	'name': 'test',
	'streams': [
		{
			'name': 'main',
			'level': 'fatal',
			'stream': process.stdout
		}
	]
});


// EXPORTS //

module.exports = logger;
