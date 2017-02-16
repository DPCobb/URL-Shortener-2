/**
 *
 * Daniel Cobb
 * 2-7-2017
 * Assignment 3: Logging Tool
 *
 */

// require debug tool, express, and body-parser
const log = require('tynydebug');
// Show debug warning
log.debugWarn();
const express = require('express');
const bodyParser = require('body-parser');
// instantiate express
const app = express();

// set up app to use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// set up the route prefixed with /api/v1
app.use('/api/v1/', require('./routes/app.js')(express, log));
// set up /go/ route
app.use('/go/', require('./routes/go.js')(express, log));
// set up direct route for redirect to link
app.use('/', require('./routes/link.js')(express, log));

// listen on port 3000
module.exports = app.listen(3000, () => {
  log.debug({
    type: 'success',
    msg: 'Listening to Server on Port 3000',
    location: 'server.js line 34',
  });
  log.msg('Hello World from app.listen');
  log.msg('Server Active, port 3000', 'app.js');
});
