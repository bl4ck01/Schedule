const db = require('./dbService');

/**
 * Create a new Assigned_Shift and Event records
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.createOne = (params, cb) => {
  const queries = [];
  // Create Assigned_Shift query
  queries.push({
    text: 'INSERT INTO Assigned_Shift (sid, covered_from, date, end_time, owner, start_time) ' +
          'VALUES ($1, $2, $3, $4, $5, $6)',
    values: [params.sid, params.coveredFrom, params.date, params.endTime, params.owner, params.startTime]
  });
  // Create Event query
  queries.push({
    text: 'INSERT INTO Event (sid, allday, eventconstraint, eventsource, rendering, title) ' +
          'VALUES ($1, $2, $3, $4, $5, $6)',
    values: [params.sid, params.allday, params.eventconstraint, params.eventsource, params.rendering, params.title]
  });

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
  var shiftEntities = '';
  var eventEntities = '';
  params.data.forEach((entity) => {
    // Create string of Assigned_Shift query values
    shiftEntities = shiftEntities.concat('(' + entity.sid, + ', ' + entity.covered_from + ', ' + entity.date + ', '
      + entity.endTime + ', ' + entity.owner + ', ' + entity.startTime + '),');
    // Create string of Event query values
    eventEntities = eventEntities.concat('(' + entity.sid + ', ' + entity.allday + ', ' + entity.eventconstraint
      + ', ' + entity.eventsource + ', ' + entity.rendering + ', ' + entity.title + '),');
  });

  // Remove final comma from entities strings
  shiftEntities = shiftEntities.substring(0, shiftEntities.length);
  eventEntities = eventEntities.substring(0, eventEntities.length);

  // Prepare array of transacted queries
  const queries = [];
  queries.push({
    text: 'INSERT INTO Assigned_Shift (sid, covered_from, date, end_time, owner, start_time) VALUES ' + shiftEntities,
    values: null
  });

  queries.push({
    text: 'INSERT INTO Event (sid, allday, eventconstraint, eventsource, rendering, title)',
    values: null
  });
};

/**
 * Retrieve shifts assigned to an owner on a date
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.getByDateAndOwner = (params, cb) => {
  db.query('SELECT * FROM Assigned_Shift ' +
            'WHERE date = $1 AND owner = $2',
    [params.date, params.owner],
    cb);
};

/**
 * Get shifts assigned to an owner on a date at certain times
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.getByDateOwnerAndStartEndTimes = (params, cb) => {
  db.query('SELECT * FROM Assigned_Shift ' +
            'WHERE date = $1 AND owner = $2 AND ' +
            'start_time = $3 AND end_time = $4',
    [params.date, params.owner, params.startTime, params.endTime],
    cb);
};

/**
 * Get shifts assigned to an owner on a date starting at a particular time
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.getByDateOwnerAndStartTime = (params, cb) => {
  db.query('SELECT * FROM Assigned_Shift ' +
    'WHERE date = $1 AND owner = $2 AND start_time = $3',
    [params.date, params.owner, params.startTime],
    cb);
};

/**
 * Get shifts assigned to an owner on a date ending at a particular time
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.getByDateOwnerAndEndTime = (params, cb) => {
  db.query('SELECT * FROM Assigned_Shift ' +
    'WHERE date = $1 AND owner = $2 AND end_time = $3',
    [params.date, params.owner, params.endTime],
    cb);
};