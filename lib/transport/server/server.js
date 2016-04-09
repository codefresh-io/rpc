var Q = require('q');

var Server = function(serviceName, serviceId, account, routes) {
	this.serviceName = serviceName;
	this.serviceId = serviceId;
	this.account = account;
	this.routes = routes;
};

/**
 * Creates routes for a micro service
 */
Server.prototype.createServiceRoutes = function(){
	return Q.reject(new Error('Need to implement'));
};

/**
 * Will remove all routes subscribers of this micro service instance
 */
Server.prototype.pause = function(){
	return Q.reject(new Error('Need to implement'));
};

/**
 * Will make sure all routes subscribers of this micro service instance are listening
 */
Server.prototype.unpause = function(){
	return Q.reject(new Error('Need to implement'));
};


module.exports = Server;