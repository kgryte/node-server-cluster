/* global require, describe, it, beforeEach, after */
'use strict';

var mpath = './../lib/listeners/exit.js';


// MODULES //

var chai = require( 'chai' ),
	cluster = require( 'cluster' ),
	noop = require( '@kgryte/noop' ),
	logger = require( './fixtures/mock.logger.js' ),
	worker = require( './fixtures/worker.js' ),
	createListener = require( mpath );


// MOCKS //

var fcn = cluster.fork;
cluster.fork = noop;


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'exit', function tests() {

	var cache = {};

	beforeEach( function before() {
		cache = {};
	});

	after( function afterAll() {
		cluster.fork = fcn;
	});

	it( 'should export function', function test() {
		expect( createListener ).to.be.a( 'function' );
	});

	it( 'should return a function', function test() {
		var log = logger( noop );
		expect( createListener( log, cache ) ).to.be.a( 'function' );
	});

	it( 'should clear any timeouts associated with the worker', function test( done ) {
		var log = logger( noop ),
			listener;

		cache[ 1 ] = setTimeout( noop, 1e6 );
		listener = createListener( log, cache );
		listener( worker(), 0, 'SIGTERM' );

		done();
	});

	it( 'should log when a worker receives an external kill signal', function test( done ) {
		var log = logger( clbk ),
			listener;

		listener = createListener( log, cache );
		listener( worker(), 1, 'SIGTERM' );

		function clbk( level ) {
			assert.strictEqual( level, 'info' );
			done();
		}
	});

	it( 'should log when a worker exits with an error code', function test( done ) {
		var log = logger( clbk ),
			listener;

		listener = createListener( log, cache );
		listener( worker(), 1, null );

		function clbk( level ) {
			assert.strictEqual( level, 'error' );
			done();
		}
	});

	it( 'should log when a worker exits successfully', function test( done ) {
		var log = logger( clbk ),
			listener;

		listener = createListener( log, cache );
		listener( worker(), 0, null );

		function clbk( level ) {
			assert.strictEqual( level, 'info' );
			done();
		}
	});

	it( 'should attempt to restart the worker if the worker did not commit suicide', function test( done ) {
		var log = logger( noop ),
			listener,
			fcn,
			w;

		w = worker();
		w.suicide = false;

		fcn = cluster.fork;
		cluster.fork = fork;

		listener = createListener( log, cache );
		listener( w, 0, null );

		function fork() {
			assert.ok( true );
			cluster.fork = fcn;
			done();
		}
	});

});
