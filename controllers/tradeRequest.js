const sql = require('sql');

sql.setDialect('postgres');

/**
 * SQL definition for public.trade_request
 */
const tradeRequest = sql.define({
  name: 'trade_request',
  columns: [
    { name: 'tid' },
    { name: 'sid' },
    { name: 'start_time' },
    { name: 'end_time' },
  ],
});

exports.table = tradeRequest;
