const logger = require('../services/logService');
const errors = require('../services/errorService');
const params = require('../config/config');
const pg = require('pg');
const format = require('pg-format');

// Database connection setup
const conString = process.env.DATABASE_URL || 'postgres://' + params.dbUsername + ':' + params.dbPass + '@' + params.dbHost + ':' + params.dbPort + '/' + params.dbName;

pg.defaults.user = params.dbUsername;
pg.defaults.database = params.dbName;
pg.defaults.host = params.dbHost;
pg.defaults.port = params.dbPort;
pg.defaults.ssl = true;

// Initializes a connection pool
exports.query = (text, values, cb) => {
  pg.connect(conString, (err, client, done) => {
    if (err) {
      logger.write.error('error fetching client from pool');
      logger.write.error(err);
      if (client) {
        done(client);
      }
      cb(Error('error fetching client from pool'));
      return;
    }

    client.query(text, values, (err, result) => {
      if (err) {
        err = { message: errors.errCode(err.code), code: 404 };
        logger.write.error(err.message);
      }
      done();
      cb(err, result);
    });
  });
};

exports.format = format;