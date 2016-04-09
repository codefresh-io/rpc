var RpcServer = require('./index').Server;
var Q = require('q');

var nats = require('./node_modules/cf-queue/lib/nats');
var connection = nats.connect({
	url: ['nats://192.168.99.100:4222'],
	reconnect: true,
	verbose: true,
	maxReconnectAttempts: 60 * 60 * 24, // try to reconnect for 24 hours !!!!
	reconnectTimeWait: 1000
});


setTimeout(function(){
	var config = {
		transport: {
			protocol: "nats",
			config: {
				workers: 50,
				connection: connection
			}
		}
	};

	var server;

	var method1 = function(x, y){
		//server.pause();
		return Q.resolve(x + y);
	};

	var routes = {
		method1: {
			func: method1,
			returns: "promise"
		}
	};

	RpcServer.create("micro1", "1", "codefresh", routes, config);
	
	server = RpcServer.get("micro1");

}, 1);




