var colors = {
    black: '\033[030m',
    red: '\033[31m',
    green: '\033[32m',
    yellow: '\033[33m',
    blue: '\033[34m',
    purple: '\033[35m',
    cyan: '\033[36m',
    white: '\033[37m',
    none: '\033[0m'
};

module.exports.log = function (msg, color) {
    if (color) {
        msg = colors[color] + msg + colors.none;
    }
    console.log(msg);
},
module.exports.error = function (msg) {
    this.log(msg, "red");
},
module.exports.success = function (msg) {
    msg = "[✓] " + msg;
    this.log(msg, "green");
}