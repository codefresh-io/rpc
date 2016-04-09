const _          = require('lodash');
const transports = ["nats", "http"];

var serverInstances = {};

var create = function (serviceName, serviceId, routes, config) {
	if (typeof serviceName !== 'string' && !(serviceName instanceof String)) {
		throw new Error("serviceName is required and must be a string");
	}
	if (typeof serviceId !== 'string' && !(serviceId instanceof String)) {
		throw new Error("serviceId is required and must be a string");
	}
	if (!routes) {
		throw new Error("routes param is required and must be an object");
	}
	if (!config) {
		throw new Error("config param is required and must be an object");
	}
	if (serverInstances[serviceName]){
		throw new Error("service: " + serviceName + " server was already created");
	}


	var protocol = _.get(config, "transport.protocol", null);
	if (!protocol) {
		throw new Error("transport must contain protocol field");
	}
	if (transports.indexOf(protocol) === -1) {
		throw new Error("transport protocol:" + protocol.toString() + " is not supported");
	}

	var protocolConfig = _.get(config, "transport.config", null);
	if (!protocolConfig) {
		throw new Error("transport config was not provided");
	}

	var transport = new (require('./transport/server/' + protocol + "Server"))(serviceName, serviceId, routes, protocolConfig);
	transport.createServiceRoutes();
	transport.createSpecificServiceRoutes();
	var serverInstance = {
		pause: transport.pause.bind(transport),
		unpause: transport.unpause.bind(transport)
	};
	serverInstances[serviceName] = serverInstance;
	return serverInstance;
	//TODO return some object that we can pause/stop on
};

var get = function(serviceName){
	var serverInstance = serverInstances[serviceName];
	if (serverInstance){
		return serverInstance;
	}
	else {
		throw new Error("service: " + serviceName + " server does not exist");
	}
};

module.exports.create = create;
module.exports.get = get;


