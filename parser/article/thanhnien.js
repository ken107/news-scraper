
var cheerio = require("cheerio");

exports.parse = function(html) {
  var $ = cheerio.load(html);
  var paragraphs = $("#abody > div").get();
  var texts = paragraphs.map(elem => $(elem).text().trim()).filter(text => text);
  return texts;
}
