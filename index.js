
var config = require("./util/config.js");
var cors = require("cors")({
  origin: config.origins
});
var AWS = require("aws-sdk");
AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: config.awsProfile });

exports.mount = function(app) {
  app.get("/news-scraper", cors, (req, res) => listSources().then(sources => res.send(sources)));
  app.get("/news-scraper/:sourceIndex", cors, (req, res) => getSource(req.params.sourceIndex).then(source => res.send(source)));
  app.get("/news-scraper/:sourceIndex/:topicIndex", cors, (req, res) => getTopic(req.params.sourceIndex, req.params.topicIndex).then(topic => res.send(topic)));
  app.get("/news-scraper/:sourceIndex/:topicIndex/:articleIndex", cors, (req, res) => getArticle(req.params.sourceIndex, req.params.topicIndex, req.params.articleIndex).then(article => res.send(article)));
}

function listSources() {
  return Promise.resolve(config.sources)
    .then(sources => sources.map(source => ({name: source.name, lang: source.lang})));
}

function getSource(sourceIndex) {
  return Promise.resolve(config.sources)
    .then(sources => sources[sourceIndex])
    .then(source => ({
      name: source.name,
      topics: source.topics.map(topic => ({name: topic.name}))
    }));
}

function getTopic(sourceIndex, topicIndex) {
  return Promise.resolve(config.sources)
    .then(sources => sources[sourceIndex].topics[topicIndex])
    .then(topicInfo => {
      return require("./loader/topic.js").load(topicInfo.link)
        .then(topic => ({
          name: topicInfo.name,
          articles: topic.articles.map(article => ({title: article.title, source: article.source}))
        }))
    })
    .catch(err => console.log(err.stack));
}

function getArticle(sourceIndex, topicIndex, articleIndex) {
  return Promise.resolve(config.sources)
    .then(sources => sources[sourceIndex].topics[topicIndex].link)
    .then(require("./loader/topic.js").load)
    .then(topic => topic.articles[articleIndex])
    .then(articleInfo => {
      return require("./loader/article.js").load(articleInfo.link)
        .then(texts => ({
          title: articleInfo.title,
          link: articleInfo.link,
          texts: texts
        }))
    })
    .catch(err => console.log(err.stack));
}
