'use strict';

/**
* FUNCTION: Logger( clbk )
*	Creates a mock logger.
*
* @constructor
* @param {Function} clbk - callback to invoke whenever a logger method is called.
* @returns {Logger} mock logger
*/
function Logger( clbk ) {
	if ( !( this instanceof Logger ) ) {
		return new Logger( clbk );
	}
	this._clbk = clbk;
	return this;
} // end FUNCTION Logger()

/**
* METHOD: fatal()
*	Mocks the `fatal` method.
*
* @returns {Logger} logger instance
*/
Logger.prototype.fatal = function fatal( msg ) {
	this._clbk.call( null, 'fatal', msg );
	return this;
}; // end METHOD fatal()

/**
* METHOD: error()
*	Mocks the `error` method.
*
* @returns {Logger} logger instance
*/
Logger.prototype.error = function error( msg ) {
	this._clbk.call( null, 'error', msg );
	return this;
}; // end METHOD error()

/**
* METHOD: warn()
*	Mocks the `warn` method.
*
* @returns {Logger} logger instance
*/
Logger.prototype.warn = function warn( msg ) {
	this._clbk.call( null, 'warn', msg );
	return this;
}; // end METHOD warn()

/**
* METHOD: info()
*	Mocks the `info` method.
*
* @returns {Logger} logger instance
*/
Logger.prototype.info = function info( msg ) {
	this._clbk.call( null, 'info', msg );
	return this;
}; // end METHOD info()

/**
* METHOD: debug()
*	Mocks the `debug` method.
*
* @returns {Logger} logger instance
*/
Logger.prototype.debug = function debug( msg ) {
	this._clbk.call( null, 'debug', msg );
	return this;
}; // end METHOD debug()

/**
* METHOD: trace()
*	Mocks the `trace` method.
*
* @returns {Logger} logger instance
*/
Logger.prototype.trace = function trace( msg ) {
	this._clbk.call( null, 'trace', msg );
	return this;
}; // end METHOD trace()


// EXPORTS //

module.exports = Logger;
