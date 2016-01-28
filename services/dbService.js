const logger = require('../services/logService');
const params = require('../config/config');
const pg = require('pg');

// Database connection setup
const conString = process.env.DATABASE_URL || 'postgres://' + params.dbUsername + '@localhost:5432/' + params.dbName;

pg.defaults.user = params.dbUsername;
pg.defaults.database = params.dbName;
pg.defaults.host = params.dbHost;
pg.defaults.port = params.dbPort;
pg.defaults.ssl = true;

// Initializes a connection pool
exports.query = (text, values, cb) => {
  pg.connect(conString, (err, client, done) => {
    if (err) {
      logger.write.error('error fetching client from pool', err);
      if (client) {
        done(client);
      }
      cb(Error('error fetching client from pool'));
      return;
    }

    client.query(text, values, (err, result) => {
      if (err) {
        logger.write(err);
      }
      done();
      cb(err, result);
    });
  });
};
