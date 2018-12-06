
var cheerio = require("cheerio");

exports.parse = function(xml) {
  var $ = cheerio.load(xml, {xmlMode: true});
  return {
    articles: $("channel").first().children("item").get().map(elem => toArticle.call(elem, $))
  };
}

function toArticle($) {
  var title = $(this).children("title").first().text();
  var titleEnd = title.lastIndexOf(" - ");
  var link = $(this).children("link").first().text();
  var descHtml = $(this).children("description").first().text();
  var desc = parseDesc(descHtml);
  return {
    source: title.slice(titleEnd + 3),
    title: title.slice(0, titleEnd),
    link: link,
    relatedArticles: desc.relatedArticles
  };
}

function parseDesc(html) {
  var $ = cheerio.load(html);
  return {
    relatedArticles: $("li").get().slice(1,-1).map(elem => toRelatedArticle.call(elem, $))
  };
}

function toRelatedArticle($) {
  var link = $(this).children("a").first();
  return {
    title: link.text(),
    link: link.attr("href"),
    source: $(this).children("font").first().text()
  };
}
