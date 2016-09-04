const sql = require('sql');

sql.setDialect('postgres');

/**
 * SQL definition for public.default_time
 */
const defaultTime = sql.define({
  name: 'default_time',
  columns: [
    { name: 'date' },
    { name: 'day_of_week' },
    { name: 'start_time' },
    { name: 'end_time' },
  ],
});

exports.table = defaultTime;
