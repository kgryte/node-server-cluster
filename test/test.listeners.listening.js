/* global require, describe, it, beforeEach */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( '@kgryte/noop' ),
	logger = require( './fixtures/mock.logger.js' ),
	worker = require( './fixtures/worker.js' ),
	createListener = require( './../lib/listeners/listening.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'listening', function tests() {

	var cache = {},
		address;

	beforeEach( function before() {
		cache = {};
		address = {
			'address': '0.0.0.0',
			'port': 7331
		};
	});

	it( 'should export function', function test() {
		expect( createListener ).to.be.a( 'function' );
	});

	it( 'should return a function', function test() {
		var log = logger( noop );
		expect( createListener( log, cache ) ).to.be.a( 'function' );
	});

	it( 'should log whenever a worker starts listening', function test( done ) {
		var log = logger( clbk ),
			listener;

		listener = createListener( log, cache );
		listener( worker(), address );

		function clbk( level ) {
			assert.strictEqual( level, 'info' );
			done();
		}
	});

	it( 'should clear any timeouts associated with the worker', function test( done ) {
		var log = logger( noop ),
			listener;

		cache[ 1 ] = setTimeout( noop, 1e6 );
		listener = createListener( log, cache );
		listener( worker(), address );

		done();
	});

});
