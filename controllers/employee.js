const sql = require('sql');

const db = require('./../services/dbService');

sql.setDialect('postgres');

/**
 * SQL definition for public.employee
 */
const employee = sql.define({
  name: 'employee',
  columns: [
    { name: 'uid' },
    { name: 'name' },
    { name: 'phone_num' },
    { name: 'role' },
  ],
  // lets you reference snake-case columns in camel-case, automatically handles conversion
  snakeToCamel: true,
});

/**
 * Insert a new Employee record
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.createOne = (params, cb) => {
  // Ensure only the schema keys are passed onto the query
  const query = employee.insert(
    {
      uid: params.uid,
      name: params.name,
      phoneNum: params.phone,
      role: params.role,
    }
  ).toQuery();

  db.query(params.id, query.text, query.values, cb);
};

/**
 * Insert multiple Employee records
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.createMultiple = (params, cb) => {
  // Create multiple-row insert query
  const entities = [];
  // Ensure only the schema keys are passed onto the query
  params.data.forEach((entity) => {
    entities.push({
      uid: entity.uid,
      name: entity.name,
      phoneNum: entity.phone,
      role: entity.role,
    });
  });

  const query = employee.insert(entities).toQuery();

  db.query(params.id, query.text, query.values, cb);
};

/**
 * Delete an Employee record
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.removeOne = (params, cb) => {
  const query = employee.delete().where(
    employee.uid.equals(params.uid)
  ).toQuery();

  db.query(params.id, query.text, query.values, cb);
};

/**
 * Delete multiple Employee records
 * @param params hash of key values; key data must be an array of employee UIDs
 * @param cb optional callback function
 */
exports.removeMultiple = (params, cb) => {
  const query = employee.delete().where(
    employee.uid.in(params.data)
  ).toQuery();

  db.query(params.id, query.text, query.values, cb);
};

/**
 * Deletes EVERY Employee record
 * @param id Request ID
 * @param cb optional callback function
 */
exports.removeAll = (id, cb) => {
  const query = employee.delete().toQuery();

  db.query(id, query.text, query.values, cb);
};

exports._ = employee;
