/**
 *
 * Daniel Cobb
 * 2-7-2017
 * Assignment 3: Logging Tool
 *
 */

// require sequelize
const Sequelize = require('sequelize');
// require dotenv to handle .env file
require('dotenv').config();
// instantiate sequelize with values from .env file
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    // set up db info
  host: process.env.DB_HOST,
  dialect: process.env.DB_SCHEMA,
  port: process.env.DB_PORT,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  logging: false,
});

// define the urls table
const createUrl = sequelize.define('url', {
    // url is original url
  url: {
    type: Sequelize.STRING,
  },
  // id is auto increment int
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // tyny url is shortened url
  tynyUrl: {
    type: Sequelize.STRING,
  },
  shortUrl: {
    type: Sequelize.STRING,
  },
  key: {
    type: Sequelize.STRING,
  },
});
// define the users table
const user = sequelize.define('user', {
    // user email
  email: {
    type: Sequelize.STRING,
  },
  // id is auto increment int
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // user pass
  pass: {
    type: Sequelize.STRING,
  },
  // user key
  key: {
    type: Sequelize.STRING,
  },
});


// create the tables
sequelize.sync();

// export sequelize, url, and user
exports.sequelize = sequelize;
exports.url = createUrl;
exports.user = user;
