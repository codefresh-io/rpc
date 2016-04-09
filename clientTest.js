var RpcClient = require('./index').Client;
var Q         = require('q');

var nats       = require('./node_modules/cf-queue/lib/nats');
var connection = nats.connect({
	url: ['nats://192.168.99.100:4222'],
	reconnect: true,
	verbose: true,
	maxReconnectAttempts: 60 * 60 * 24, // try to reconnect for 24 hours !!!!
	reconnectTimeWait: 1000
});


setTimeout(function () {
	var config = {
		transport: {
			protocol: "nats",
			config: {
				workers: 50,
				connection: connection
			}
		}
	};

	RpcClient.create("micro1", {}, config);
	var client = RpcClient.get("micro1");

	client("method1", [1, 2])
		.then(function (res) {
			console.log(JSON.stringify(res));
		}, function (err) {
			console.error(JSON.stringify(err));
		});

}, 1);




