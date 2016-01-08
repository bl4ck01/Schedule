const path = require('path');
const rootDir = path.join(__dirname, '../');
const fs = require('fs');

module.exports = {
  // Modify the address ports as needed for your environment.
  baseAddress: process.env.PORT || 3000,
  redirectAddress: (process.env.PORT || 3000) + 1,
  httpsAddress: (process.env.PORT || 3000) + 2,

  // This is how often the master process checks on the status of the worker threads. After 4 unresponsive checks, a
  // worker is restarted. Make this longer or shorter as necessary for your project.
  workerCheckInterval: 5000,
  // REQUIRED to exist for the server to start
  key: 'config/ssl/localhost.key',
  cert: 'config/ssl/localhost.crt',

  rootDir: rootDir,
  cookieSecret: fs.readFileSync(path.join(__dirname, 'cookieSecret.txt'))
};
