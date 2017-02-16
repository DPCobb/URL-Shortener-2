/**
 *
 * Daniel Cobb
 * 2-10-2017
 * Assignment 5: Unit Test
 *
 */
const expect = require('chai').expect;
const request = require('supertest');
const log = require('../src/modules/debug.js');
const db = require('../src/models/db.js');

class testApp {
  // Set the needed data to run other tests from getAllUrls
  setData(data) {
    // store the values for the first result returned
    this.app = {
      url: data.url,
      id: data.id,
      tynyUrl: data.tynyUrl,
      shortUrl: data.shortUrl,
      key: data.key,
    };
    // test the other get requests and the redirects with this.app
    this.testGets(this.app);
    this.redirect(this.app);
  }

  // returns all urls
  getAllUrls() {
    // test the get for all urls
    describe('App Routes', () => {
      const server = require('../src/server.js');
      it('GET api/v1/urls returns all shortened urls', (done) => {
        request(server)
        .get('/api/v1/urls')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          const data = res.body;
          // debug the results
          log.debug({
            type: 'success',
            msg: 'TEST: Get all urls',
            location: '__app.js line 14',
            data: { data },
          });
          // send msg
          log.msg('Unit Test Complete for /urls', '__app.js');
          // set the data for other tests
          this.setData(data[0]);
          expect(data.length).to.be.above(0);
        })
        .expect(200, done);
      });
    });
  }

  // test the other get requests
  testGets(app) {
    // assign app
    this.app = app;
    // create the routes
    this.routes = ['/urls/' + this.app.id, '/urls/user/' + this.app.key];
    // enter forEach to loop through array
    this.routes.forEach((url) => {
      describe('App Routes', () => {
        const server = require('../src/server.js');
        it('GET api/v1' + url, (done) => {
          request(server)
          .get('/api/v1/' + url)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect((res) => {
            const data = res.body;
            log.debug({
              type: 'success',
              msg: 'TEST: ' + url,
              location: '__app.js',
              data: { data },
            });
            // complete msg
            log.msg('Unit Test Complete for ' + url, '__app.js');
          })
        .expect(200, done);
        });
      });
    });
  }

  // test creating a url
  createURL() {
    describe('App Routes', () => {
      const server = require('../src/server.js');
      it('POST api/v1/urls creates new url', (done) => {
        request(server)
        .post('/api/v1/urls')
        .send({ url: 'https://www.example.com',
          key: 'xxx' })
        .expect('Content-Type', /json/)
        .expect((res) => {
          const data = res.body;
          log.debug({
            type: 'success',
            msg: 'TEST: Create New URL',
            location: '__app.js',
            data: { data },
          });
          // set the id value
          this.id = res.body.id;
          log.msg('Unit Test Complete for creating new URL', '__app.js');
          // pass the id to update url
          this.updateURL(this.id);
        })
        .expect(200, done);
      });
    });
  }

  // update a url by id
  updateURL(id) {
    describe('App Routes', () => {
      const server = require('../src/server.js');
      it('POST api/v1/urls/id updates a url', (done) => {
        request(server)
        .post('/api/v1/urls/' + id)
        .send({ url: 'www.example.com',
          key: 'xxx' })
        .expect('Content-Type', /json/)
        .expect((res) => {
          const data = res.body;
          log.debug({
            type: 'success',
            msg: 'TEST: Create New URL',
            location: '__app.js',
            data: { data },
          });
          // set the value for id
          this.id = res.body.id;
          log.msg('Unit Test Complete for updated a URL', '__app.js');
          // pass the id to deleteURL
          this.deleteURL(this.id);
        })
        .expect(200, done);
      });
    });
  }

  // delete a url by given id
  deleteURL(id) {
    describe('App Routes', () => {
      const server = require('../src/server.js');
      it('DELETE api/v1/urls/id deletes new url', (done) => {
        request(server)
        .delete('/api/v1/urls/' + id)
        .expect((res) => {
          const data = res.body;
          log.debug({
            type: 'success',
            msg: 'TEST: Delete URL',
            location: '__app.js',
            data: { data },
          });
          this.id = res.body.id;
          log.msg('Unit Test Complete for deleting URL', '__app.js');
        })
        .expect(200, done);
      });
    });
  }

  // test the redirects
  redirect(app) {
    // assign app
    this.app = app;
    // create array of routes to test
    this.routes = ['/go/' + this.app.id, '/' + this.app.shortUrl, '/go/' + this.app.tynyUrl];
    // enter forEach to test reqirect routes
    this.routes.forEach((url) => {
      describe('App Routes', () => {
        const server = require('../src/server.js');
        it('GET ' + url, (done) => {
          request(server)
          .get(url)
          .expect((res) => {
            const data = res.body;
            log.debug({
              type: 'success',
              msg: 'TEST: ' + url,
              location: '__app.js',
              data: { data },
            });
            log.msg('Unit Test Complete for ' + url, '__app.js');
          })
        .expect(302, done);
        });
      });
    });
  }

  // test creating a new user
  createUser() {
    describe('App Routes', () => {
      const server = require('../src/server.js');
      it('POST api/v1/create creates new user', (done) => {
        request(server)
        .post('/api/v1/create')
        .send({ email: 'test@example.com',
          pass: 'xxx' })
        .expect('Content-Type', /json/)
        .expect((res) => {
          const data = res.body;
          log.debug({
            type: 'success',
            msg: 'TEST: Create New user',
            location: '__app.js',
            data: { data },
          });
          log.msg('Unit Test Complete for creating new user', '__app.js');
          // delete the test user
          this.deleteUser();
        })
        .expect(200, done);
      });
    });
  }

  // deletes a test user
  deleteUser() {
    db.user.destroy({
      where: {
        email: 'test@example.com',
      },
      include: [{
        all: true,
        nested: true,
      }],
    });
    log.debug({
      type: 'success',
      msg: 'TEST: Test user deleted.',
      location: '__app.js',
    });
    this.response = 1;
  }

  // launch the tests
  launchTest() {
    this.getAllUrls();
    this.createURL();
    this.createUser();
    this.getAllUrlsFail();
    this.postUrlsFail();
  }

}

// instantiate testApp
const run = new testApp();
// run the tests
run.launchTest();
