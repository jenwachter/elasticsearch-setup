var request = require("request");

var config = {
	baseUrl: "http://localhost:9200/"
};

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
	return JSON.parse(body).error || null;
}

module.exports.setup = function (baseUrl) {
	
	if (baseUrl) {
		config.baseUrl = baseUrl.substr(-1, 1) === "/" ? baseUrl : baseUrl + "/";
	}

};

module.exports.deleteAll = function (callback) {
	
	request.del({ url: config.baseUrl + "_all" }, function (error, response, body) {
		var err = error = parseErrors(error, body);
		callback(error, body);
	});

};

module.exports.putSettings = function (index, settings, callback) {
	
	request.put({ url: config.baseUrl + index, body: settings }, function (error, response, body) {
		var err = error = parseErrors(error, body);
		callback(error, body);
	});

};

module.exports.putMapping = function (index, type, mapping, callback) {
	
	var url = config.baseUrl + index + "/" + type +  "/_mapping";

	request.put({ url: url, body: mapping }, function (error, response, body) {
		var err = error = parseErrors(error, body);
		callback(error, body);
	});

};

module.exports.putAliases = function (aliases, callback) {
	request.post({ url: config.baseUrl  + "_aliases", body: aliases }, function (error, response, body) {
		var err = error = parseErrors(error, body);
		callback(error, body);
	});
	
};