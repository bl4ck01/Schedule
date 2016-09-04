const sql = require('sql');

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
      sid: params.sid,
      covered_from: params.coveredFrom,
      date: params.date,
      end_time: params.endTime,
      owner: params.owner,
      start_time: params.startTime,
    }
  ).toQuery()
  );
  // Create Event query
  queries.push(event.table.insert(
    {
      sid: params.sid,
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
      sid: entity.sid,
      covered_from: entity.covered_from,
      date: entity.date,
      end_time: entity.endTime,
      owner: entity.owner,
      start_time: entity.startTime,
    });
    eventEntities.push({
      sid: entity.sid,
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
 * Retrieve shifts assigned to an owner on a date
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.getByDateAndOwner = (params, cb) => {
  const query = assignedShift.select(assignedShift.star())
    .from(assignedShift)
      .where(
        assignedShift.date.equals(params.date)
        .and(assignedShift.owner.equals(params.owner))
      ).toQuery();

  db.query(query.text, query.values, cb);
};

/**
 * Get shifts assigned to an owner on a date at certain times
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.getByDateOwnerAndStartEndTimes = (params, cb) => {
  const query = assignedShift.select(assignedShift.star())
    .from(assignedShift)
      .where(
        assignedShift.date.equals(params.date)
        .and(assignedShift.owner.equals(params.date))
        .and(assignedShift.start_time.equals(params.startTime))
        .and(assignedShift.end_time.equals(params.endTime))
      ).toQuery();

  db.query(query.text, query.values, cb);
};

/**
 * Get shifts assigned to an owner on a date starting at a particular time
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.getByDateOwnerAndStartTime = (params, cb) => {
  const query = assignedShift.select(assignedShift.star())
    .from(assignedShift)
      .where(
        assignedShift.date.equals(params.date)
        .and(assignedShift.owner.equals(params.owner))
        .and(assignedShift.start_time.equals(params.startTime))
      ).toQuery();

  db.query(query.text, query.values, cb);
};

/**
 * Get shifts assigned to an owner on a date ending at a particular time
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.getByDateOwnerAndEndTime = (params, cb) => {
  const query = assignedShift.select(assignedShift.star())
    .from(assignedShift)
      .where(
        assignedShift.date.equals(params.date)
        .and(assignedShift.owner.equals(params.owner))
        .and(assignedShift.end_time.equals(params.endTime))
      ).toQuery();

  db.query(query.text, query.values, cb);
};

exports.table = assignedShift;
