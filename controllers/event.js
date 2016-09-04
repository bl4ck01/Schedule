const sql = require('sql');

sql.setDialect('postgres');

/**
 * SQL definition for public.event
 */
const event = sql.define({
  name: 'event',
  columns: [
    { name: 'sid' },
    { name: 'title' },
    { name: 'allday' },
    { name: 'rendering' },
    { name: 'eventconstraint' },
    { name: 'eventsource' },
  ],
});

exports.table = event;
