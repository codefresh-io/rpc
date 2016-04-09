var util   = require('util');
var Client = require('./client');

var HttpClient = function () {
	throw new Error("not implemented");
};

util.inherits(HttpClient, Client);



module.exports = HttpClient;