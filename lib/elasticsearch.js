var request = require("request");

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



var elasticsearch = function (config) {
  this.config = config;

  if (this.config.user && this.config.pass) {
  	this.auth = {
  		user: this.config.user,
  		pass: this.config.pass,
  		sendImmediately: false
  	};
  }
};


elasticsearch.prototype.addAuth = function(requestObj) {
	if (this.auth) {
		requestObj.auth = this.auth;
	}
	return requestObj;
};

/**
 * Right now this only checks for errors throw by elasticsearch and
 * whether your instance requires authorization.
 */
elasticsearch.prototype.testConnection = function (callback) {

	var requestObj = this.addAuth({ url: this.config.baseurl });

	request.get(requestObj, function (error, response, body) {

		if (error) {
			callback(error);
		}

		if (response.statusCode === 401) {
			callback(new Error("Connection to your instance of elasticsearch requires authorization."));
		}

		callback(null);

	});

},

elasticsearch.prototype.deleteAll = function (callback) {

	var requestObj = this.addAuth({ url: this.config.baseurl + "_all" });
	
	request.del(requestObj, function (error, response, body) {
		var error = parseErrors(error, body);
		callback(error, body);
	});

};

elasticsearch.prototype.putSettings = function (index, settings, callback) {
	
	var requestObj = this.addAuth({ url: this.config.baseurl + index, body: settings });

	request.put(requestObj, function (error, response, body) {
		var error = parseErrors(error, body);
		callback(error, body);
	});

};

elasticsearch.prototype.putMapping = function (index, type, mapping, callback) {
	
	var requestObj = this.addAuth({ url: this.config.baseurl + index + "/" + type +  "/_mapping", body: mapping });

	request.put(requestObj, function (error, response, body) {
		var error = parseErrors(error, body);
		callback(error, body);
	});

};

elasticsearch.prototype.putAliases = function (aliases, callback) {

	var requestObj = this.addAuth({ url: this.config.baseurl  + "_aliases", body: aliases });
	
	request.post(requestObj, function (error, response, body) {
		var error = parseErrors(error, body);
		callback(error, body);
	});
	
};

module.exports = elasticsearch;