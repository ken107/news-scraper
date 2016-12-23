
var config = require("../util/config.js");
var log = require("../util/log.js");
var cache = require("../cache/combined.js");
var pending = {};

exports.load = function(url) {
  if (pending[url]) return pending[url];
  return pending[url] = load(url)
    .then(result => {
      delete pending[url];
      return result;
    })
}

function load(url) {
  log.debug("topic", "load", url);

  var hash = require('crypto').createHash('md5').update(url).digest("hex");
  var key = "topic-" + hash;
  return cache.read(key)
    .then(entry => {
      if (new Date().getTime() > entry.lastModified + 15*60*1000) {
        log.debug("cache entry expired");
        throw new Error("NOT_FOUND");
      }
      return entry.data;
    })
    .catch(err => {
      if (err.message == "NOT_FOUND") return loadFeed(url).then(topic => {cache.write(key, topic); return topic;});
      else throw err;
    })
}

function loadFeed(url) {
  return Promise.resolve(url)
    .then(require("./http.js").load)
    .then(xml => require("../parser/feed.js").parse(xml, url));
}
