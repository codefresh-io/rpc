var util   = require('util');
var Q      = require('q');
var uuid   = require('uuid');
var Queue  = require('cf-queue');
var Client = require('./client');


var NatsClient = function (serviceName, routes, natsConfig) {
	var self = this;
	Client.call(this, serviceName, routes);

	if (!natsConfig.connection) {
		throw new Error("Nats client requires a valid nats connection object");
	}

	self.config = natsConfig;
};
util.inherits(NatsClient, Client);


NatsClient.prototype.createServiceRequestInterface = function () {
	return this.sendRequest.bind(this);
};

NatsClient.prototype.sendRequest = function (method, params, options) {
	var self = this;
	options = options || {};
	params = params || [];
	self.validateRequest(method, params, options);
	var channelName = self.serviceName;
	if (options.serviceId){
		channelName += ":" + options.serviceId;
	}
	else if (options.account){
		channelName += ":" + options.account;
	}
	
	var queue       = new Queue(channelName, self.config.connection); //TODO make sure the created queue will be removed by GC in some way (it mighty already be ok)
	return queue.request({method: method, params: params, id: uuid.v4()})
		.then(function (res) {
			return res.result;
		}, function (err) {
			var error = err.error;
			error.toString = function(){
				return error.message;
			}
			return Q.reject(err.error);
		});
};


module.exports = NatsClient;