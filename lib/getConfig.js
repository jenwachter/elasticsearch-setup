var parseArgs = require("minimist");

/**
 * Default configuration
 * @type {Object}
 */
var config = {
    baseurl: "http://localhost:9200/",
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
 * for the baseurl, settings directory, username and password.
 * @return {object}
 */
module.exports = function () {

    var argv = parseArgs(process.argv.slice(2));

    config.baseurl = addSlash(argv._[0]) || config.baseurl;
    config.settingsDir = addSlash(argv._[1]) || config.settingsDir;

    config.user = argv.user || null;
    config.pass = argv.pass || null;

    return config;

};
