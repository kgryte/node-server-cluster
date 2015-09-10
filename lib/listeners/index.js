'use strict';

// LISTENERS //

var listeners = {};

listeners.fork = require( './fork.js' );
listeners.online = require( './online.js' );
listeners.listening = require( './listening.js' );
listeners.disconnect = require( './disconnect.js' );
listeners.exit = require( './exit.js' );


// EXPORTS //

module.exports = listeners;
