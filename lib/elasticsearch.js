var request = require("request");
var async = require("async");

/**
 * If there is not an error from the request
 * module, but there is an error from
 * elasticsearch, return that as the error.
 * @param  {string} error Request error
 * @param  {object} body  Request body
 * @return {string}       Error to throw
 */
function parseErrors(error, body) {
	if (error) return error;
	return body.error || null;
}

var elasticsearch = function (config) {

  this.config = config;

	var defaults = { baseUrl: this.config.baseUrl };

	// add http auth (does not change per request)
  if (this.config.user && this.config.pass) {
		this.authType = "http";
  	defaults.auth = {
  		user: this.config.user,
  		pass: this.config.pass,
  		sendImmediately: false
  	};
  }

	// added on each request (changes with request)
	if (this.config.aws_accessKeyId && this.config.aws_secretAccessKey) {
		defaults.aws = {
      sign_version: 4,
			key: this.config.aws_accessKeyId,
			secret: this.config.aws_secretAccessKey
		};
		this.authType = "aws";
	}

	// add defaults
	this.baseRequest = request.defaults(defaults);

};

/**
 * Right now this only checks for errors throw by elasticsearch and
 * whether your instance requires authorization.
 */
elasticsearch.prototype.testConnection = function (callback) {

	var options = { method: "GET", url: "/", json: true };

	var self = this;
	this.baseRequest(options, function (error, response, body) {

		if (error) return callback(error);

		if (response.statusCode === 401) {
			return callback(new Error("Connection to your instance of elasticsearch requires authorization."));
		}

		if (self.authType == "aws" && body.message) {
			return callback(new Error(body.message));
		}

		callback(null);

	});

},

elasticsearch.prototype.deleteIndecies = function (indecies, callback) {

	async.each(indecies, this.deleteIndex.bind(this), function (error) {
    callback(error, null);
  });

};

elasticsearch.prototype.deleteIndex = function (index, callback) {

	var options = { method: "DELETE", url: index, json: true };

	this.baseRequest(options, function (error, response, body) {

		if (response.statusCode === 404) {
			// index doesn't exist to delete
			return callback(null, null);
		}

		// check for other errors
		error = parseErrors(error, body);
		callback(error, body);

	});

};

elasticsearch.prototype.putSettings = function (index, settings, callback) {

	var options = {
		method: "PUT",
		url: index,
		body: JSON.parse(settings),
		json: true
	};

	this.baseRequest(options, function (error, response, body) {
		error = parseErrors(error, body);
		callback(error, body);
	});

};

elasticsearch.prototype.putMapping = function (index, type, mapping, callback) {

	var options = {
		method: "PUT",
		url: index + "/" + type +  "/_mapping",
		body: JSON.parse(mapping),
    json: true
	};

	this.baseRequest(options, function (error, response, body) {

		error = parseErrors(error, body);
		callback(error, body);
	});

};

elasticsearch.prototype.putAliases = function (aliases, callback) {

	var options = {
		method: "POST",
		url: "_aliases",
		body: JSON.parse(aliases),
    json: true
	};

	this.baseRequest(options, function (error, response, body) {
		error = parseErrors(error, body);
		callback(error, body);
	});

};

module.exports = elasticsearch;
