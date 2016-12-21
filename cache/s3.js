
var config = require("../util/config.js");
var log = require("../util/log.js");
var AWS = require("aws-sdk");
var s3 = new AWS.S3();

exports.write = function(key, data) {
  log.debug("s3", "write", key);
  return new Promise(function(fulfill, reject) {
    s3.putObject({
      Bucket: config.s3CacheBucket,
      Key: key,
      Body: JSON.stringify(data),
      CacheControl: "no-cache"
    },
    function(err) {
      if (err) reject(err);
      else fulfill();
    });
  });
};

exports.read = function(key) {
  log.debug("s3", "read", key);
  return new Promise(function(fulfill, reject) {
    s3.getObject({
      Bucket: config.s3CacheBucket,
      Key: key
    },
    function(err, entry) {
      if (err) {
        if (err.code == 'NoSuchKey') {
          log.debug("s3 cache miss");
          reject(new Error("NOT_FOUND"));
        }
        else reject(err);
      }
      else {
        log.debug("s3 cache hit");
        fulfill({
          data: JSON.parse(entry.Body.toString()),
          lastModified: Date.parse(entry.LastModified)
        });
      }
    });
  });
}
