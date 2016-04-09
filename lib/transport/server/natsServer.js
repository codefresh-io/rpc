var util   = require('util');
var Q      = require('q');
var Queue  = require('cf-queue');
var Server = require('./server');


var NatsServer = function (serviceName, serviceId, account, routes, natsConfig) {
	var self = this;
	Server.call(this, serviceName, serviceId, account, routes);

	if (!natsConfig.connection) {
		throw new Error("Nats client requires a valid nats connection object");
	}

	self.config = natsConfig;
	self.queues = [];
};
util.inherits(NatsServer, Server);


NatsServer.prototype.addQueue = function(channelName){
	var self = this;
	var queue = new Queue(channelName, self.config.connection);
	queue.process(self.requestHandler.bind(self));
	self.queues.push(queue);
};

NatsServer.prototype.createServiceRoutes = function () {
	var self = this;
	self.addQueue(self.serviceName);
	if (self.account){
		self.addQueue(self.serviceName + ":" + self.account);
	}
	if (self.serviceId){
		self.addQueue(self.serviceName + ":" + self.serviceId);
	}
};

NatsServer.prototype.requestHandler = function (data, callback) {
	var self = this;
	var request = data.request;
	var method = request.method;
	var params = request.params;
	var id     = request.id;

	if (self.routes[method]){
		self.routes[method].func(...params)
			.then(function(res){
				var response = {
					result: res,
					error: null,
					id: id
				};
				callback(null, response);
			}, function(err){
				var statusCode = 400;
				if (err && err.constructor && err.constructor.name === "CFError") { // jshint ignore:line
					statusCode = err.getStatusCode() || 400;
				}
				var response = {
					result: null,
					error: {
						status: statusCode,
						message: err.toString()
					},
					id: id
				};
				callback(response);
			});
	}
	else {
		var error = {
			result: null,
			error: {
				status: 501,
				message: "Not Implemented"
			},
			id: id
		};
		callback(error);
	}

};


NatsServer.prototype.pause = function(){
	var self = this;
	self.serviceRoutesQueue.pause();
	self.specificServiceRoutesQueue.pause();
};

NatsServer.prototype.unpause = function(){
	var self = this;
	self.serviceRoutesQueue.pause();
	self.specificServiceRoutesQueue.pause();
};

module.exports = NatsServer;
