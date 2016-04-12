const path = require('path');
const rootDir = path.join(__dirname, '../');
const fs = require('fs');

module.exports = {
  // Modify the address ports as needed for your environment.
  baseAddress: 3000,
  redirectAddress: 3001,
  httpsAddress: 3002,

  // This is how often the master process checks on the status of the worker threads. After 4 unresponsive checks, a
  // worker is restarted. Make this longer or shorter as necessary for your project.
  workerCheckInterval: 5000,
  // REQUIRED
  key: 'config/ssl/localhost.key',
  cert: 'config/ssl/localhost.crt',

  rootDir: rootDir,
  // cookieSecret will be automatically assigned a unique value upon server start
  cookieSecret: null,

  // Database configuration
  dbName: require('./dbconfig').db,
  dbUsername: require('./dbconfig').user,
  dbHost: 'localhost',
  dbPort: '5432'
};
