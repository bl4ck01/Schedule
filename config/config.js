const path = require('path');

const rootDir = path.join(__dirname, '../');
const dbConfig = require('./dbconfig');

module.exports = {
  // Modify the address ports as needed for your environment.
  httpsPort: 443,

  // REQUIRED
  key: 'config/ssl/localhost.key',
  cert: 'config/ssl/localhost.crt',

  rootDir,
  // cookieSecret will be automatically assigned a unique value upon server start
  cookieSecret: null,

  // Database configuration
  dbName: dbConfig.db,
  dbUsername: dbConfig.user,
  dbHost: dbConfig.host,
  dbPort: dbConfig.port,
  dbPass: process.env.DB_PASS || dbConfig.dbPass,
};
