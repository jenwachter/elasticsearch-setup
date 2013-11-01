// modules
var async = require("async");
var fs = require("fs");
var logger = require("./lib/logger.js");
var elasticsearch = require("./lib/elasticsearch.js");

// default configuration
var config = {
	settingsDir: "settings/"
};

(function extractArgs() {

	var args = process.argv
	args.splice(0, 2);

	if (!args) return;

	// baseUrl
	elasticsearch.setup(args[0]);
	
	// settingsDir
	if (args[1]) {
		config.settingsDir = args[1].substr(-1, 1) === "/" ? args[1] : args[1] + "/";
	}

})();



async.waterfall([

	function deleteAll(callback) {
		elasticsearch.deleteAll(function (error, body) {
			callback(error, body);
		});
	},
	
	function findIndicies(data, callback) {
		fs.readdir(config.settingsDir, function (error, data) {

			var indicies = [];

			data.forEach(function (element) {
				
				var stats = fs.statSync(config.settingsDir + element);
				if (stats && stats.isDirectory()) {
					indicies.push(element);
				}

			});

			callback(error, indicies);

		});
	},

	function createIndicies(data, callback) {
		async.each(data, createIndex, function (error) {
			callback(error, null);
		});
	},

	function createAliases(data, callback) {
		var file = config.settingsDir + "aliases.json";

		fs.exists(file, function (exists) {

			if (exists) {
				fs.readFile(file, "utf8", function (error, aliases) {
					elasticsearch.putAliases(aliases, function (error, body) {
						callback(error, body);
					});
				});

			} else {
				callback(null, null);
			}

		});
	}

], function (error) {
	if (error) throw error;
});


function createIndex(index, callback) {
	
	async.waterfall([

		function settings(callback) {
			var file = config.settingsDir + index + "/settings.json";

			fs.exists(file, function (exists) {

				if (exists) {

					fs.readFile(file, "utf8", function (error, settings) {
						elasticsearch.putSettings(index, settings, function (error, body) {
							callback(error, body);
						});
					});

				} else {
					logger.log("No settings found for " + index + " index.", "cyan");
					callback(null, null);
				}

			});
		},

		function mappings(data, callback) {
			var dir = config.settingsDir + index + "/mappings";

			async.waterfall([

				function mappingsDirExists(callback) {
					
					fs.exists(dir, function (exists) {
						
						if (exists) {
							callback(null, exists);
						} else {
							logger.log("No mappings found for " + index + " index.", "cyan");
							callback(null, null);
						}

					});

				},

				function getMappings(data, callback) {
					fs.readdir(dir, function (error, mappings) {
						callback(error, mappings);
					});
				},

				function put(mappings, callback) {

					async.each(mappings, function (file, callback) {

						var type = file.replace(".json", "");
						var file = dir + "/" + file;

						fs.readFile(file, "utf8", function (error, mapping) {
							elasticsearch.putMapping(index, type, mapping, function (error, body) {
								callback(error, body);
							});
						});

					}, function (error) {
						callback(error);
					});
				}

			], function (error) {
				callback(error);
			});
		}

	], function (error) {
		callback(error);
	});

}