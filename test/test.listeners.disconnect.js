/* global require, describe, it, beforeEach */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( '@kgryte/noop' ),
	logger = require( './fixtures/mock.logger.js' ),
	worker = require( './fixtures/worker.js' ),
	createListener = require( './../lib/listeners/disconnect.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'disconnect', function tests() {

	it( 'should export function', function test() {
		expect( createListener ).to.be.a( 'function' );
	});

	it( 'should return a function', function test() {
		var log = logger( noop );
		expect( createListener( log ) ).to.be.a( 'function' );
	});

	it( 'should log whenever a worker disconnects', function test( done ) {
		var log = logger( clbk ),
			listener;

		listener = createListener( log );
		listener( worker() );

		function clbk( level ) {
			assert.strictEqual( level, 'info' );
			done();
		}
	});

});
