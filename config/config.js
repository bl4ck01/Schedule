// Save project root directory
const path = require('path');
const rootDir = path.resolve(__dirname + '../');

module.exports = {
  baseAddress: process.env.PORT || 3000,
  redirectAddress: (process.env.PORT || 3000) + 1,
  httpsAddress: (process.env.PORT || 3000) + 2,
  workerCheckInterval: 5000,
  key: '../config/ssl/localhost.key',
  cert: '../config/ssl/localhost.crt',
  rootDir: rootDir
};
