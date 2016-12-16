const sql = require('sql');

const db = require('./../services/dbService');

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

exports.createOne = (params, cb) => {
  const query = event.insert({
    sid: params.uid,
    name: params.name,
    phoneNum: params.phone,
    role: params.role,
  }).toQuery();

  db.query(params.id, query.text, query.values, cb);
};

/**
 * Retrieves every Shift from the database
 * @param id Request ID
 * @param cb Callback function
 */
exports.all = (id, cb) => {
  const query = event.where([]).toQuery();
  db.query(id, query.text, query.values, cb);
};

exports.table = event;
