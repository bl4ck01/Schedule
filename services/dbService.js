const pg = require('pg');

const logger = require('../services/logService');
const errors = require('../services/errorService');
const params = require('../config/config');

// Database connection setup
const conString = process.env.DATABASE_URL ||
  `postgres://${params.dbUsername}:${params.dbPass}@${params.dbHost}:${params.dbPort}/${params.dbName}`;

const dbConfig = {
  user: params.dbUsername,
  database: params.dbName,
  password: params.dbPass,
  host: params.dbHost,
  port: params.dbPort,
  max: 30, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

const pool = new pg.Pool(dbConfig);

/**
 * Rollback function to recover from failed transaction
 * @param client connection to database
 * @param done gracefully returns client to connection pool after rollback
 */
  // if there was a problem rolling back the query
  // something is seriously messed up.  Return the error
  // to the done function to close & remove this client from
  // the pool.  If you leave a client in the pool with an unaborted
  // transaction weird, hard to diagnose problems might happen.
const rollback = (client, done) => client.query('ROLLBACK', done);


/**
 * Initializes a connection pool and runs a query
 * @param text SQL query
 * @param values Optional paramaterized values to use in query
 * @param cb Optional callback function
 */
exports.query = (text, values, cb) => {
  pool.connect(conString, (err, client, done) => {
    if (err) {
      logger.write.error('error fetching client from pool');
      logger.write.error(err);
      if (client) {
        done(client);
      }
      cb(Error('error fetching client from pool'));
      return;
    }

    client.query(text, values, (queryErr, result) => {
      let error;
      if (queryErr) {
        error = { message: errors.errCode(queryErr.code), code: 404 };
        logger.write.error(error.message);
      }
      done();
      cb(error, result);
    });
  });

  pool.on('error', (err) => {
    logger.write.error(err.message, err.stack);
  });
};

/**
 * Initializes a connection pool and runs a transacted set of queries
 * @param queries array of hashed query objects
 * @param cb Optional callback function
 */
exports.transaction = (queries, cb) => {
  pool.connect(conString, (err, client, done) => {
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
    /* eslint-disable consistent-return */
    client.query('BEGIN', (beginQueryErr) => {
      if (beginQueryErr) {
        return rollback(client, done);
      }
      process.nextTick(() => {
        let i = queries.length;
        queries.forEach((q) => {
          client.query(q.text, q.values, (queryErr) => {
            if (queryErr) {
              return rollback(client, done);
            }
            i--;
          });
        });
        const intervalID = setInterval(() => {
          if (i <= 0) {
            // transaction is complete
            client.query('COMMIT', done);
          } // else, queries are still running, keep waiting
        }, 100);

        // Stop the interval from continuing to run
        clearInterval(intervalID);
      });
    });
    /* eslint-enable consistent-return */
  });

  pool.on('error', (err) => {
    logger.write.error(err.message, err.stack);
  });
};
