/* global require, describe, it, beforeEach */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( '@kgryte/noop' ),
	logger = require( './fixtures/mock.logger.js' ),
	worker = require( './fixtures/worker.js' ),
	createListener = require( './../lib/listeners/timeout.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'timeout', function tests() {

	it( 'should export function', function test() {
		expect( createListener ).to.be.a( 'function' );
	});

	it( 'should return a function', function test() {
		var log = logger( noop );
		expect( createListener( log, worker() ) ).to.be.a( 'function' );
	});

	it( 'should log whenever a worker times out', function test( done ) {
		var log = logger( clbk ),
			listener;

		listener = createListener( log, worker() );
		listener();

		function clbk( level ) {
			assert.strictEqual( level, 'error' );
			done();
		}
	});

	it( 'should kill a worker' );

	it( 'should restart a worker' );

});
