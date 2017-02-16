/**
 *
 * Daniel Cobb
 * 2-7-2017
 * Assignment 3: Logging Tool
 *
 */

// require shortener - creates alphanumeric string
const short = require('../modules/shortener.js');
// require lastUrl model
const url = require('../models/url.js');
// export the router
module.exports = (express, log) => {
  class dataHandle {
    constructor(data) {
      this.id = data;
    }
  }
  class updatePost {
    constructor(id, body) {
      this.id = id;
      this.body = body;
    }
  }
    // call router method
  const router = express.Router();

    // get /api/v1/urls returns all urls created
  router.get('/urls', (req, res) => {
    // get all urls
    url.findAll((data) => {
      // return the json info for the last url
      res.status(200).json(data);
      log.debug({
        type: 'success',
        msg: "Returned all URL's",
        location: 'app.js line 19 GET:/urls',
        data: {
          data,
        },
      });
    }, (err) => {
      res.status(500).json(err);
      const body = req.body;
      log.debug({
        type: 'error',
        msg: 'Could not update short URL by ID',
        location: 'app.js line 19 GET:/urls',
        data: err,
        request: {
          body,
        },
      });
    });
  });
  // get url by id
  router.get('/urls/:id', (req, res) => {
    const id = new dataHandle(req.params.id);
    // get one url back by ud
    url.findOne(id, (data) => {
      // return the json info for the requested url
      res.status(200).json(data);
      log.debug({
        type: 'success',
        msg: 'Returned URL based on ID',
        location: 'app.js line 48 GET:/urls/:id',
        data: {
          data,
        },
        request: {
          id,
        },
      });
    }, (err) => {
      res.status(500).json(err);
      const body = req.body;
      log.debug({
        type: 'error',
        msg: 'Could not update short URL by ID',
        location: 'app.js line 48 GET:/urls/:id',
        data: err,
        request: {
          body,
        },
      });
    });
  });
    // get url by user key
  router.get('/urls/user/:id', (req, res) => {
    const id = new dataHandle(req.params.id);
    // get one url back by user key
    url.findOneUser(id, (data) => {
      // return the json info for the requested key
      res.status(200).json(data);
      log.debug({
        type: 'success',
        msg: "Returned URL's based on User Key",
        location: 'app.js line 81 GET:/urls/user/:id',
        data: {
          data,
        },
        request: {
          id,
        },
      });
    }, (err) => {
      res.status(500).json(err);
      log.debug({
        type: 'error',
        msg: 'Could not update short URL by ID',
        location: 'app.js line 81 GET:/urls/user/:id',
        data: err,
        request: {
          id,
        },
      });
    });
  });
  router.delete('/urls/:id', (req, res) => {
    const id = new dataHandle(req.params.id);
        // get one url back by ud
    url.destroy(id, (data) => {
      // return the json info for the requested url
      res.status(200).json(data);
      log.debug({
        type: 'success',
        msg: 'Deleted URL based on ID',
        location: 'app.js line 113 DELETE:/urls/:id',
        data: {
          data,
        },
        request: {
          id,
        },
      });
    }, (err) => {
      res.status(500).json(err);
      const body = req.body;
      log.debug({
        type: 'error',
        msg: 'Could not update short URL by ID',
        location: 'app.js line 113 DELETE:/urls/:id',
        data: err,
        request: {
          body,
        },
      });
    });
  });
  // post /api/v1/urls creates a new shortened link
  router.post('/urls', (req, res) => {
    // get the shortened url
    const shortUrl = short(req);
    // add to db
    url.create(shortUrl, (data) => {
      res.status(200).json(data);
      const body = req.body;
      log.debug({
        type: 'success',
        msg: 'Created short URL',
        location: 'app.js line 146 POST:/urls',
        data: {
          data,
        },
        request: {
          body,
        },
      });
    }, (err) => {
      res.status(500).json(err);
      const body = req.body;
      log.debug({
        type: 'error',
        msg: 'Could not update short URL by ID',
        location: 'app.js line 146 POST:/urls',
        data: err,
        request: {
          body,
        },
      });
    });
  });

    // update url by ID
  router.post('/urls/:id', (req, res) => {
    // get the id
    const update = new updatePost(req.params.id, req.body);
    // update and display info or error
    url.update(update, (err) => {
      res.status(500).json(err);
      log.debug({
        type: 'error',
        msg: 'Could not update short URL by ID',
        location: 'app.js line 180 POST:/urls/:id',
        data: err,
        request: {
          update,
        },
      });
    }, (data) => {
      res.status(200).json(data);
      const body = req.body;
      log.debug({
        type: 'success',
        msg: 'Updated short URL by ID',
        location: 'app.js line 180 POST:/urls/:id',
        data: {
          data,
        },
        request: {
          body,
        },
      });
    });
  });

  router.post('/create', (req, res) => {
    // get variables from req
    const user = req.body.email;
    const pass = req.body.pass;
    const key = user + pass;
    // set up hash
    const crypto = require('crypto');
    // create the hash to build alphanumeric string for user key
    const keyHash = crypto.createHmac('sha256', key).digest('hex');
    // shorten hash
    const shortKeyHash = keyHash.substr(0, 10);
    // set data
    const data = {
      email: user,
      pass: pass,
      key: shortKeyHash,
    };
      // add to db
    url.createUser(data, () => {
      res.status(200).json(data);
      const body = req.body;
      log.debug({
        type: 'success',
        msg: 'Created new User Key',
        location: 'app.js line 213 POST:/create',
        data: {
          data,
        },
        request: {
          body,
        },
      });
    }, (err) => {
      res.status(500).json(err);
      const body = req.body;
      log.debug({
        type: 'error',
        msg: 'Could not update short URL by ID',
        location: 'app.js line 213 POST:/create',
        data: err,
        request: {
          body,
        },
      });
    });
  });
  // return the router
  return router;
};
