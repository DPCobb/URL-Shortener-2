/**
 *
 * Daniel Cobb
 * 2-7-2017
 * Assignment 3: Logging Tool
 *
 */
const log = require('../modules/debug.js');

module.exports = (url) => {
  // require lastUrl model
  log.msg('URL being shortened...');
  // setup the url prefix for shortened url
  const prefix = 'tyny.io/';
  // retrieve the url data
  let urlHash = url.body.url;
  // require the crypto module
  const crypto = require('crypto');
  // create the hash to build alphanumeric string
  const hash = crypto.createHmac('sha256', urlHash).digest('hex');
  // shorten hash length to 7, creates > 8 billion possible urls
  urlHash = hash.substr(0, 7);
  log.msg('Created Short URL: ' + urlHash);
  // create the shortened url to return
  const shortUrl = prefix + urlHash;
  // create data to send to lastUrl model
  const data = {
    url: url.body.url,
    tynyUrl: shortUrl,
    shortUrl: urlHash,
    key: url.body.key,
  };
  log.debug({
    type: 'success',
    msg: 'Created a Short URL',
    location: 'shortener.js line 8',
    data: {
      data,
    },
  });

  return (data);
};
