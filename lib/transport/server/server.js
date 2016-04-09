var Q = require('q');

var Server = function(serviceName, serviceId, routes) {
	this.serviceName = serviceName;
	this.serviceId = serviceId;
	this.routes = routes;
};

/**
 * Creates routes for a micro service which will be shared with all micro services instances
 */
Server.prototype.createServiceRoutes = function(){
	return Q.reject(new Error('Need to implement'));
};

/**
 * Creates routes unique for a specific instance of a micro service
 */
Server.prototype.createSpecificServiceRoutes = function(){
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