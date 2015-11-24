// Save project root directory
const path = require('path');
const rootDir = path.join(__dirname, '../');
const fs = require('fs');

module.exports = {
  baseAddress: process.env.PORT || 3000,
  redirectAddress: (process.env.PORT || 3000) + 1,
  httpsAddress: (process.env.PORT || 3000) + 2,
  workerCheckInterval: 5000,
  key: '../config/ssl/localhost.key',
  cert: '../config/ssl/localhost.crt',
  rootDir: rootDir,
  cookieSecret: fs.readFileSync(path.join(__dirname, 'cookieSecret.txt'))
};
