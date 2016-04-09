const _          = require('lodash');
const transports = ["nats", "http"];

var requestInterfaces = {};

var create = function (serviceName, routes, config) {
	if (typeof serviceName !== 'string' && !(serviceName instanceof String)) {
		throw new Error("serviceName is required and must be a string");
	}
	if (!routes) {
		throw new Error("routes param is required and must be an object");
	}
	if (!config) {
		throw new Error("config param is required and must be an object");
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

	var transport = new (require('./transport/client/' + protocol + "Client"))(serviceName, routes, protocolConfig);
	var requestInterface = transport.createServiceRequestInterface();
	requestInterfaces[serviceName] = requestInterface;
	return requestInterface;
};

var get = function(serviceName){
	var requestInterface = requestInterfaces[serviceName];
	if (requestInterface){
		return requestInterface;
	}
	else {
		throw new Error("service: " + serviceName + " client does not exist");
	}
};

module.exports.create = create;
module.exports.get = get;

