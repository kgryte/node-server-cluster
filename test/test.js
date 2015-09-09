/* global require, describe, it, beforeEach */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	logger = require( './fixtures/logger.js' ),
	serverCluster = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( '@kgryte/server-cluster', function tests() {

	var opts;

	beforeEach( function before() {
		opts = {};
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

});
