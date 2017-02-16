/**
 *
 * Daniel Cobb
 * 2-7-2017
 * Assignment 3: Logging Tool
 *
 */

const fs = require('fs');
require('dotenv').config();

// Handles console.logs without an ESLint warning
class con {
  // method log writes the msg to stdout
  log(data) {
    // data is the message
    this.data = data;
    // write to console
    process.stdout.write(`${this.data}\n`);
  }
}
// Instantiate con class
const cons = new con();

// handles the log data for the debugger
class msgHandle {
  constructor(data) {
    // Get request/response data from passed in event
    this.type = data.type;
    this.verify = data.data;
    this.msg = data.msg;
    this.location = data.location;
    this.request = data.request;
  }
}

// Location of a console.log event, used to check if location is undefined
// in msg and saveMsg methods
class loc {
  constructor(data) {
    // location information
    this.loc = data;
  }
}

const consoleDebug = process.env.DEBUG_CONSOLE;
const debug = process.env.DEBUG;
const msgSave = process.env.DEBUG_MSG_LOG;

module.exports = {
    // Create a date for log files
  getDate() {
    // set date object
    const dateObj = new Date();
    // get date
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    // format date
    const date = year + '_' + month + '_' + day;
    // return date
    return date;
  },
  // get a time for log events
  getTime() {
      // set date obj
    const dateObj = new Date();
    // get time
    const h = dateObj.getHours();
    let m = dateObj.getMinutes();
    // if m is less than 9 add 0
    if (m < 10) {
      m = `${0}` + m;
    }
    // get seconds
    const s = dateObj.getSeconds();
    // format time
    const time = h + ':' + m + ':' + s;
    // return time
    return time;
  },
  // send warning that debugging is active
  debugWarn() {
      // if debug is true, send warning msg
    if (debug === 'true') {
      cons.log('**************************************** \n Debugging Mode is Active!\n\n****************************************\n');
    }
  },
  // debug takes json data, logs to console and to log file
  debug(dataIn) {
    const data = new msgHandle(dataIn);
    const date = this.getDate();
    const time = this.getTime();
    // if debug is true
    if (debug === 'true') {
        // set up variables
      let logData = '';
      let logReq = '';
      // set console colors
      const resetColor = '\x1b[0m';
      const successColor = '\x1b[32m';
      const errorColor = '\x1b[31m';
      const defaultColor = '\x1b[33m';
      // set up type title : error, success, warning
      let type = defaultColor + data.type.toUpperCase() + resetColor;
      // check to see if there is data, if data isn't null and if the type is not error
      if (data.verify && !data.verify.data && data.type !== 'error') {
          // if you get here the type changes to warning
        data.type = 'warning - request returned null';
      }
      // if type is success set the success title
      if (data.type === 'success') {
        type = successColor + data.type.toUpperCase() + resetColor;
      } else if (data.type === 'error') {
        // if error set error title
        type = errorColor + data.type.toUpperCase() + resetColor;
      } else {
        // set default
        type = defaultColor + data.type.toUpperCase() + resetColor;
      }
      // header for actual console display
      let logMsg = '\n**********\nEvent at ' + time + ' @ ' + data.location + '\n' + type + '\n' + data.msg;
      // logFile doesn't print color but will print after \x1b ex [32mSUCCESS[0m will print
      let logFile = '\n**********\nEvent at ' + time + ' @ ' + data.location + '\n' + data.type.toUpperCase() + '\n' + data.msg;
      // if not an error display returned data from json
      if (data.verify && data.type !== 'error') {
        logData = '\nReturned Data: \n-- ' + JSON.stringify(data.verify).split(',').join('\n    ').replace(/[{}"]/g, ' ');
      }
      // if it is an error return the error string
      if (data.type === 'error') {
        logData = '\nReturned Data: \n ' + data.verify;
      }
      // if request info is sent display the request info
      if (data.request) {
        logReq = '\nRequested Data: \n-- ' + JSON.stringify(data.request).split(',').join('\n    ').replace(/[{}"]/g, ' ');
      }
      // create the log console and log file
      logMsg += logData;
      logMsg += logReq;
      logFile += logData;
      logFile += logReq;

      // append the file to todays log and console.log the message
      fs.appendFile('./logs/debug_log_' + date + '.log', '\n' + logFile, (err) => {
        if (err) throw err;
        if (consoleDebug === 'true') {
          cons.log(logMsg);
        }
      });
    }
  },
  /* Msg acts like a standard console.log if debug is true and debug_console
  is true, and doesn't append to log file */
  msg(data, locIn) {
    // instatiate loc class
    const location = new loc(locIn);
    // check if location information was given
    if (location.loc === undefined) {
      // if no location data change loc to no info msg
      location.loc = 'No Location Info';
    }
    if (debug === 'true' && consoleDebug === 'true') {
      cons.log('\x1b[37mMSG:\x1b[0m ' + data + '\n-- @ ' + location.loc);
    }
    this.saveMsg(data, location.loc);
  },
  // saves msg method to a seperate log
  saveMsg(data, locIn) {
    const location = new loc(locIn);
    // get date and time
    const date = this.getDate();
    const time = this.getTime();
    // if no location information was sent
    if (location.loc === undefined) {
      location.loc = 'No Location Info';
    }
    // if both debug and msgSave are true
    if (debug === 'true' && msgSave === 'true') {
      // create the entry
      const msgLog = '-- MSG @ ' + time + ' (' + location.loc + '): ' + data + '\n';
      // append entry to todays log
      fs.appendFile('./logs/debug_MSG_' + date + '.log', msgLog, (err) => {
        if (err) throw err;
      });
    }
  },
};
