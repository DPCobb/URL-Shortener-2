/**
 *
 * Daniel Cobb
 * 2-7-2017
 * Assignment 3: Logging Tool
 *
 */

const url = require('../models/url.js');
const log = require('../modules/debug.js');

class dataHandle {
  constructor(data) {
    this.id = data;
  }
}

module.exports = (express) => {
  // call router method
  const router = express.Router();
  // redirect based on id
  router.get('/:id', (req, res) => {
    // get the url param
    const id = new dataHandle(req.params.id);
    // get one url back by id
    url.findOne(id, (data) => {
      // set the target
      const target = data.url;
      // if the target url has http or https
      if (target.includes('http') || target.includes('https')) {
        // redirect to target
        res.redirect(target);
        log.debug({
          type: 'success',
          msg: 'Redirected User to external URL',
          location: 'go.js line 15 GET:/:id',
          request: {
            target,
          },
        });
      } else {
      // if not add http and redirect
        res.redirect('http://' + target);
        log.debug({
          type: 'success',
          msg: 'Redirected User to external URL',
          location: 'go.js line 15 GET:/:id',
          request: {
            target,
          },
        });
      }
    }, (err, target) => {
      log.debug({
        type: 'error',
        msg: 'Redirect User to external URL failed',
        location: 'go.js line 15 GET:/:id',
        data: {
          err,
        },
        request: {
          target,
        },
      });
    });
  });

  // redirect based on short url
  router.get('/:prefix/:url', (req, res) => {
    // get the url param
    const id = new dataHandle(req.params.url);
    // get one url back by short url value
    url.findOneUrl(id, (data) => {
      // set the redirect target
      const target = data.url;
      // if the url has http:// or https://
      if (target.includes('http') || target.includes('https')) {
        // redirect to target
        res.redirect(target);
        log.debug({
          type: 'success',
          msg: 'Redirected User to external URL',
          location: 'go.js line 65 GET:/:prefix/:url',
          request: {
            target,
          },
        });
      } else {
        // if not add http and redirect
        res.redirect('http://' + target);
        log.debug({
          type: 'success',
          msg: 'Redirected User to external URL',
          location: 'go.js line 65 GET:/:prefix/:url',
          request: {
            target,
          },
        });
      }
    }, (err, target) => {
      log.debug({
        type: 'error',
        msg: 'Redirect User to external URL failed',
        location: 'go.js line 15 GET:/:prefix/:url',
        data: {
          err,
        },
        request: {
          target,
        },
      });
    });
  });
  return router;
};
