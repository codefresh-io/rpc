var Q = require('q');

var Client = function(serviceName, routes) {
	this.serviceName = serviceName;
	this.routes = routes;
};

/**
 * Creates an object that will allow to make calls to the service
 */
Client.prototype.createServiceRequestInterface = function(){
	return Q.reject(new Error('Need to implement'));	
};


Client.prototype.validateRequest = function (method, params, serviceId) {
	if (typeof method !== 'string' && !(method instanceof String)) {
		throw new Error("method is required and must be a string");
	}
	if (!Array.isArray(params)) {
		throw new Error("params param is required and must be an array");
	}
	if (serviceId && typeof serviceId !== 'string' && !(serviceId instanceof String)) {
		throw new Error("serviceId param is required and must be an object");
	}
};

module.exports = Client;