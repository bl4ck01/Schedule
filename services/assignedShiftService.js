const db = require('./dbService');

exports.createOne = (params, cb) => {
  db.query('INSERT INTO Assigned_Shift (')
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