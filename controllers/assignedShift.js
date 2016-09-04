const sql = require('sql');
const _ = require('lodash');
const validator = require('validator');

const db = require('./../services/dbService');
const event = require('./event');

sql.setDialect('postgres');

/**
 * SQL definition for public.assigned_shift
 */
const assignedShift = sql.define({
  name: 'assigned_shift',
  columns: [
    { name: 'sid' },
    { name: 'date' },
    { name: 'start_time' },
    { name: 'end_time' },
    { name: 'owner' },
    { name: 'covered_from' },
  ],
  // lets you reference snake-case columns in camel-case, automatically handles conversion
  snakeToCamel: true,
});

/**
 * Create a new Assigned_Shift and Event records
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.createOne = (params, cb) => {
  const queries = [];
  // Create Assigned_Shift query
  queries.push(assignedShift.insert(
    {
      coveredFrom: params.coveredFrom || null,
      date: params.date,
      endTime: params.endTime,
      owner: params.owner,
      startTime: params.startTime,
    }
  ).toQuery()
  );
  // Create Event query
  queries.push(event.table.insert(
    {
      allday: params.allday,
      eventconstraint: params.eventconstraint,
      eventsource: params.eventsource,
      rendering: params.rendering,
      title: params.title,
    }
  ).toQuery()
  );

  // Run transaction of above queries
  db.transaction(queries, cb);
};

/**
 * Create multiple new Assigned_Shift and Event records
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.createMany = (params, cb) => {
  // Create multiple-row insert query
  const shiftEntities = [];
  const eventEntities = [];
  params.data.forEach((entity) => {
    shiftEntities.push({
      coveredFrom: entity.coveredFrom,
      date: entity.date,
      endTime: entity.endTime,
      owner: entity.owner,
      startTime: entity.startTime,
    });

    eventEntities.push({
      allday: entity.allday,
      eventconstraint: entity.eventconstraint,
      eventsource: entity.eventsource,
      rendering: entity.rendering,
      title: entity.title,
    });
  });

  // Prepare array of transacted queries
  const queries = [];
  queries.push(assignedShift.insert(shiftEntities).toQuery());
  queries.push(event.table.insert(eventEntities).toQuery());

  // Run transaction of above queries
  db.transaction(queries, cb);
};

/**
 * Retrieves assigned shifts
 * @param params Columns to select by
 * @param cb Callback function
 */
exports.get = (params, cb) => {
  const existMap = {
    sid: false,
    coveredFrom: false,
    date: false,
    endTime: false,
    owner: false,
    startTime: false,
  };

  // Dynamically create query from column keys existing in params
  _.forOwn(existMap, (exists, key) => {
    if (params[key] && !validator.isNull(params[key])) existMap[key] = true;
  });
  let query = assignedShift.where([]);
  _.forOwn(existMap, (exists, key) => {
    if (exists) query = query.and(assignedShift[key].equals(params[key]));
  });
  query = query.toQuery();

  db.query(query.text, query.values, cb);
};

exports.table = assignedShift;
