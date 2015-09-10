/* global require, describe, it, beforeEach */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	listeners = require( './../lib/listeners' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'listeners', function tests() {

	it( 'should export an object', function test() {
		expect( listeners ).to.be.an( 'object' );
	});

	it( 'should contain listeners', function test() {
		var keys = Object.keys( listeners ),
			i;

		for ( i = 0; i < keys.length; i++ ) {
			assert.isFunction( listeners[ keys[ i ] ] );
		}
	});

});
