
var cheerio = require("cheerio");

exports.parse = function(xml) {
  var $ = cheerio.load(xml, {xmlMode: true});
  var channel = $("channel").first();
  return {
    title: channel.children("title").first().text(),
    articles: channel.children("item").get().map(elem => toArticle.call(elem, $))
  };
}

function toArticle($) {
  return {
    title: $(this).children("title").first().text(),
    link: $(this).children("link").first().text(),
    desc: $(this).children("description").first().text()
  };
}
