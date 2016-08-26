const db = require('./dbService');

/**
 * Insert a new Employee record
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.createOne = (params, cb) => {
  db.query('INSERT INTO Employee (uid, name, phone, role) VALUES ($1, $2, $3, $4)',
      [params.uid, params.name, params.phone, params.role],
      cb);
};

/**
 * Insert multiple Employee records
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.createMultiple = (params, cb) => {
  // Create multiple-row insert query
  let entities = '';
  params.data.forEach((entity) => {
    // Create string of Employee query values
    entities = entities.concat(`(${entity.uid}, ${entity.name}, ${entity.phone}, ${entity.role}),`);
  });

  // Remove final comma from entities string
  entities = entities.substring(0, entities.length);

  db.query(`INSERT INTO Employee (uid, name, phone, role) VALUES ${entities}`,
    null,
    cb);
};

/**
 * Delete an Employee record
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.removeOne = (params, cb) => {
  db.query('DELETE FROM Employee WHERE uid = $1',
    params.uid,
    cb);
};

/**
 * Delete multiple Employee records
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.removeMultiple = (params, cb) => {
  const values = params.data.map((uid, index) => {
    return `$${(index + 1)}`;
  });

  db.query(`DELETE FROM Employee WHERE uid IN (${values.join(', ')})`,
    params.data,
    cb);
};

/**
 * Deletes EVERY Employee record
 * @param cb optional callback function
 */
exports.removeAll = (cb) => {
  db.query('DELETE FROM Employee',
    null,
    cb);
};
