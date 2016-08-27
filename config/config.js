const path = require('path');

const rootDir = path.join(__dirname, '../');
const dbConfig = require('./dbconfig');

module.exports = {
  // Modify the address ports as needed for your environment.
  httpsPort: 443,

  // REQUIRED
  key: 'config/ssl/helpdesk.unet.brandeis.edu.key',
  cert: 'config/ssl/helpdesk_unet_brandeis_edu_cert.cer',
  // Partial construction of CA - rest constructed in app.js
  ca: 'config/ssl/helpdesk_unet_brandeis_edu_interm',

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
