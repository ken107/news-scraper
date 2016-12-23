
var entities = require("entities");

exports.parse = function(xml) {
  var topic = require("./default.js").parse(xml);
  topic.articles.forEach(article => article.title = entities.decodeXML(article.title));
  return topic;
}
