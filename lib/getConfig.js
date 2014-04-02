var parseArgs = require("minimist");

// default configuration
var config = {
    baseurl: "http://localhost:9200/",
    settingsDir: "settings/"
};

function addSlash(string) {
    if (!string) return null;
    return string.substr(-1, 1) === "/" ? string : string + "/";
}

module.exports = function () {

    var argv = parseArgs(process.argv.slice(2));

    config.baseurl = addSlash(argv._[0]) || config.baseurl;
    config.settingsDir = addSlash(argv._[1]) || config.settingsDir;
    
    config.user = argv.user || null;
    config.pass = argv.pass || null;

    return config;
    
};