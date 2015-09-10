/* global require, describe, it, beforeEach, after */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	os = require( 'os' ),
	cluster = require( 'cluster' ),
	noop = require( '@kgryte/noop' ),
	logger = require( './fixtures/logger.js' ),
	worker = require( './fixtures/worker.js' ),
	serverCluster = require( './../lib' );


// MOCKS //

var fork = cluster.fork,
	on = cluster.on;

cluster.fork = noop;
cluster.on = noop;


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( '@kgryte/server-cluster', function tests() {

	var addr,
		opts;

	beforeEach( function before() {
		opts = {};
		addr = {
			'address': '0.0.0.0',
			'port': 7331
		};
	});

	after( function afterAll() {
		cluster.fork = fork;
		cluster.on = on;
	});

	it( 'should export a function', function test() {
		expect( serverCluster ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided enough arguments', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			serverCluster();
		}
	});

	it( 'should throw an error if provided an invalid option', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			serverCluster({
				'size': Math.PI
			}, logger );
		}
	});

	it( 'should return a function', function test() {
		expect( serverCluster( opts, logger ) ).to.be.a( 'function' );
		expect( serverCluster( logger ) ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided a callback which is not a function', function test() {
		var values,
			create,
			i;

		values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			{}
		];

		create = serverCluster( opts, logger );

		for ( i = 0; i < values.length; i++ ) {
			expect( badValue( values[ i ] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function badValue() {
				create( value );
			};
		}
	});

	it( 'should listen to emitted events', function test( done ) {
		var create,
			evts,
			fcn;

		evts = [
			'listening',
			'fork',
			'online',
			'disconnect',
			'exit'
		];
		create = serverCluster( opts, logger );

		fcn = cluster.on;
		cluster.on = foo;

		create( noop );

		function foo( evt, clbk ) {
			var idx = evts.indexOf( evt );
			if ( idx > -1 ) {
				assert.isFunction( clbk );
				evts.splice( idx, 1 );
				if ( evts.length === 0 ) {
					cluster.on = fcn;
					done();
				}
			}
		}
	});

	it( 'should invoke a provided callback once all workers are ready to receive requests', function test( done ) {
		var create,
			clbks,
			fcn;

		opts.size = 2;
		create = serverCluster( opts, logger );

		fcn = cluster.on;
		cluster.on = foo;

		clbks = [];

		create( onReady );

		setTimeout( onTimeout, 250 );

		function foo( evt, clbk ) {
			if ( evt === 'listening' ) {
				clbks.push( clbk );
			}
		}

		function onTimeout() {
			var i, j;

			for ( i = 0; i < opts.size; i++ ) {
				for ( j = 0; j < clbks.length; j++ ) {
					clbks[ j ]( worker(), addr );
				}
			}
		}

		function onReady() {
			assert.ok( true );
			cluster.on = fcn;
			done();
		}
	});

	it( 'should, by default, spawn the same number of workers as cpus', function test( done ) {
		var cnt = 0,
			create,
			size,
			fcn;

		size = os.cpus().length;
		create = serverCluster( opts, logger );

		fcn = cluster.fork;
		cluster.fork = foo;

		create( noop );

		function foo() {
			if ( ++cnt === size ) {
				assert.ok( true );
				cluster.fork = fcn;
				done();
			}
		}
	});

	it( 'should allow spawning an arbitrary number of workers', function test( done ) {
		var cnt = 0,
			create,
			fcn;

		opts.size = 10;
		create = serverCluster( opts, logger );

		fcn = cluster.fork;
		cluster.fork = foo;

		create( noop );

		function foo() {
			if ( ++cnt === opts.size ) {
				assert.ok( true );
				cluster.fork = fcn;
				done();
			}
		}
	});

	it( 'should allow specifying a worker timeout', function test( done ) {
		var create;

		opts.timeout = 100;
		create = serverCluster( opts, logger );

		// FIXME: this is a vanity test, which covers a code path but does not address behavior. However, not sure how to test the desired functionality without requiring an intimate understanding of the underlying implementation; e.g., logs at `error` level, invokes a submodule with a particular argument signature, or attempts to restart a worker.

		done();
	});

});
