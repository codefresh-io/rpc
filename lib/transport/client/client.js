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


Client.prototype.validateRequest = function (method, params, options) {
	if (typeof method !== 'string' && !(method instanceof String)) {
		throw new Error("method param is required and must be a string");
	}
	if (!Array.isArray(params)) {
		throw new Error("params param is required and must be an array");
	}
	
	var serviceId, account;
	try {
		serviceId = options.serviceId;
		account = options.account;
	}
	catch(e){
		throw new Error("options param must be an object");
	}

	if (serviceId && typeof serviceId !== 'string' && !(serviceId instanceof String)) {
		throw new Error("options serviceId param must be a string");
	}

	if (account && typeof account !== 'string' && !(account instanceof String)) {
		throw new Error("options account param must be a string");
	}
	
};

module.exports = Client;