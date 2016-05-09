const logger = require('../services/logService');
const params = require('../config/config');
const pg = require('pg');
const format = require('pg-format');
const sql = require('sql');

// Database connection setup
const conString = process.env.DATABASE_URL || 'postgres://' + params.dbUsername + '@' + params.dbHost + ':' + params.dbPort + '/' + params.dbName;

// SQL module configuration
sql.setDialect('postgres');

// define SQL tables
const assignedShift = sql.define({
  name: 'assigned_shift',
  columns: ['sid', 'covered_from', 'date', 'end_time', 'owner', 'start_time']
});

const defaultTime = sql.define({
  name: 'default_time',
  columns: ['date', 'day_of_week', 'end_time', 'start_time']
});

const employee = sql.define({
  name: 'employee',
  columns: ['uid', 'name', 'phone_num', 'role']
});

const event = sql.define({
  name: 'event',
  columns: ['sid', 'allday', 'day', 'eventconstraint', 'eventsource', 'rendering', 'title']
});

const tradeRequest = sql.define({
  name: 'trade_request',
  columns: ['tid', 'end_time', 'sid', 'start_time']
});

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

exports.format = format;
exports.assignedShift = assignedShift;
exports.defaultTime = defaultTime;
exports.event = event;
exports.tradeRequest = tradeRequest;
exports.employee = employee;