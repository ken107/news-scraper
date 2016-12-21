
var helper = require("./helper.js");
var config = require("../../config.json");
var envir = process.env.envir || "prod";

module.exports = helper.extend({}, config.common, config[envir]);
