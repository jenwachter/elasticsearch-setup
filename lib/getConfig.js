var parseArgs = require("minimist");

/**
 * Default configuration
 * @type {Object}
 */
var config = {
    baseUrl: "http://localhost:9200/",
    settingsDir: "settings/"
};

/**
 * Adds a slash to the end of a string
 * if one is not already pressent
 * @param {string} string String with trailing slash
 */
function addSlash(string) {
    if (!string) return null;
    return string.substr(-1, 1) === "/" ? string : string + "/";
}

/**
 * Parse the arguments passed to essetup to get values
 * for the baseUrl, settings directory, username and password.
 * @return {object}
 */
module.exports = function () {

    var argv = parseArgs(process.argv.slice(2));

    config.baseUrl = addSlash(argv._[0]) || config.baseUrl;
    config.settingsDir = addSlash(argv._[1]) || config.settingsDir;

    config.user = argv.user || null;
    config.pass = argv.pass || null;

    config.aws_accessKeyId = argv.aws_accessKeyId || null;
    config.aws_secretAccessKey = argv.aws_secretAccessKey || null;
    config.aws_region = argv.aws_region || "us-east-1";

    return config;

};
