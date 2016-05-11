const logger = require('../services/logService');
const errors = require('../services/errorService');
const params = require('../config/config');
const pg = require('pg');

// Database connection setup
const conString = process.env.DATABASE_URL || 'postgres://' + params.dbUsername + ':' + params.dbPass + '@' + params.dbHost + ':' + params.dbPort + '/' + params.dbName;

pg.defaults.user = params.dbUsername;
pg.defaults.database = params.dbName;
pg.defaults.host = params.dbHost;
pg.defaults.port = params.dbPort;
pg.defaults.ssl = true;

/**
 * Rollback function to recover from failed transaction
 * @param client connection to database
 * @param done gracefully returns client to connection pool after rollback
 */
const rollback = (client, done) => {
  client.query('ROLLBACK', function(err) {
    //if there was a problem rolling back the query
    //something is seriously messed up.  Return the error
    //to the done function to close & remove this client from
    //the pool.  If you leave a client in the pool with an unaborted
    //transaction weird, hard to diagnose problems might happen.
    return done(err);
  });
};

/**
 * Initializes a connection pool and runs a query
 * @param text SQL query
 * @param values Optional paramaterized values to use in query
 * @param cb Optional callback function
 */
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

/**
 * Initializes a connection pool and runs a transacted set of queries
 * @param queries array of hashed query objects
 * @param cb Optional callback function
 */
exports.transaction = (queries, cb) => {
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
    // begin transaction
    client.query('BEGIN', (err) => {
      if (err) {
        return rollback(client, done);
      }
      process.nextTick(() => {
        var i = queries.length;
        queries.forEach((q) => {
          client.query(q.text, q.values, (err) => {
            if (err) {
              return rollback(client, done);
            }
            i--;
          })
        });
        const intervalID = setInterval(() => {
          if ( i <= 0) {
            // transaction is complete
            client.query('COMMIT', done);
          } // else, queries are still running, keep waiting
        }, 100);

        // Stop the interval from continuing to run
        clearInterval(intervalID);
      })
    });
  })
};