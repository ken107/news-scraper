
var config = require("./util/config.js");

exports.listSources = function() {
  return Promise.resolve(config.sources)
    .then(sources => sources.map(source => ({name: source.name, lang: source.lang})));
}

exports.getSource = function(sourceIndex) {
  return Promise.resolve(config.sources)
    .then(sources => sources[sourceIndex])
    .then(source => ({
      name: source.name,
      topics: source.topics.map(topic => ({name: topic.name}))
    }));
}

exports.getTopic = function(sourceIndex, topicIndex) {
  return Promise.resolve(config.sources)
    .then(sources => sources[sourceIndex].topics[topicIndex])
    .then(topicInfo => {
      return require("./loader/topic.js").load(topicInfo.link)
        .then(topic => ({
          name: topicInfo.name,
          articles: topic.articles
        }))
    })
    .catch(err => console.log(err.stack));
}

exports.getArticle = function(sourceIndex, topicIndex, articleIndex) {
  return Promise.resolve(config.sources)
    .then(sources => sources[sourceIndex].topics[topicIndex].link)
    .then(require("./loader/topic.js").load)
    .then(topic => topic.articles[articleIndex])
    .then(articleInfo => {
      return require("./loader/article.js").load(articleInfo.link)
        .then(texts => Object.assign({texts}, articleInfo))
    })
    .catch(err => console.log(err.stack));
}

exports.getRelatedArticle = function(sourceIndex, topicIndex, articleIndex, relatedArticleIndex) {
  return Promise.resolve(config.sources)
    .then(sources => sources[sourceIndex].topics[topicIndex].link)
    .then(require("./loader/topic.js").load)
    .then(topic => topic.articles[articleIndex])
    .then(article => article.relatedArticles[relatedArticleIndex])
    .then(articleInfo => {
      return require("./loader/article.js").load(articleInfo.link)
        .then(texts => Object.assign({texts}, articleInfo))
    })
    .catch(err => console.log(err.stack));
}
