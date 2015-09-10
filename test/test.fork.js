/* global require, describe, it, beforeEach */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( '@kgryte/noop' ),
	logger = require( './fixtures/mock.logger.js' ),
	worker = require( './fixtures/worker.js' ),
	createListener = require( './../lib/listeners/fork.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'fork', function tests() {

	var timeout = 1e6,
		cache = {};

	beforeEach( function before() {
		cache = {};
	});

	it( 'should export function', function test() {
		expect( createListener ).to.be.a( 'function' );
	});

	it( 'should return a function', function test() {
		var log = logger( noop );
		expect( createListener( log, cache, timeout ) ).to.be.a( 'function' );
	});

	it( 'should log whenever a worker is spawned', function test( done ) {
		var log = logger( clbk ),
			listener;

		listener = createListener( log, cache, timeout );
		listener( worker() );

		function clbk( level ) {
			assert.strictEqual( level, 'info' );
			done();
		}
	});

	it( 'should set a timeout defining an interval in which a worker must initialize before being considered unhealthy', function test( done ) {
		var log = logger( noop ),
			listener;

		assert.strictEqual( Object.keys( cache ).length, 0 );

		listener = createListener( log, cache, timeout );
		listener( worker() );

		setTimeout( clbk, 500 );

		function clbk() {
			assert.strictEqual( Object.keys( cache ).length, 1 );
			clearTimeout( cache[ 1 ] );
			done();
		}
	});

});
