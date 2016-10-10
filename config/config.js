const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '../');
const dbConfig = require('./dbconfig');

module.exports = {
  // Modify the address ports as needed for your environment.
  httpsPort: 443,
  // To drop process privileges
  gid: process.env.APP_GID,
  uid: process.env.APP_UID,

  // REQUIRED
  key: 'config/ssl/helpdesk.unet.brandeis.edu.key',
  cert: 'config/ssl/helpdesk_unet_brandeis_edu_cert.cer',
  // Partial construction of CA - rest constructed in app.js
  ca: 'config/ssl/helpdesk_unet_brandeis_edu_interm',

  // Shibboleth requirements
  callbackUrl: 'https://helpdesk.unet.brandeis.edu/login/callback',
  entryPoint: 'https://shibboleth.brandeis.edu/idp/profile/SAML2/Redirect/SSO',
  issuer: 'https://helpdesk.unet.brandeis.edu/shibboleth',
  logoutCallbackUrl: 'https://helpdesk.unet.brandeis.edu/logout',

  rootDir,
  // cookieSecret will be automatically assigned a unique value upon server start
  cookieSecret: null,

  // Database configuration
  dbName: dbConfig.db || process.env.DBNAME,
  dbUsername: dbConfig.user || process.env.DBUSERNAME,
  dbHost: dbConfig.host || process.env.DBHOST,
  dbPort: dbConfig.port || process.env.DBPORT,
  dbPass: dbConfig.dbPass || process.env.DBPASS,

  // Remote error logging
  errorCreds: fs.readFileSync('./config/errorConfig.js'),
};
