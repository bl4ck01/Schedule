const sql = require('sql');
const validator = require('validator');
const _ = require('lodash');

const db = require('../services/dbService');

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
  // lets you reference snake-case columns in camel-case, automatically handles conversion
  snakeToCamel: true,
});

exports.createMany = (params, cb) => {
  // Create multiple-row insert query
  const entities = [];
  // Ensure only the schema keys are passed onto the query
  params.data.forEach((entity) => {
    entities.push({
      date: entity.date,
      dayOfWeek: entity.dow,
      startTime: entity.startTime,
      endTime: entity.endTime,
    });
  });

  const query = defaultTime.insert(entities).onConflict({
    columns: ['date'],
    update: ['start_time', 'end_time'],
  }).returning('date').toQuery();

  db.query(params.id, query.text, query.values, cb);
};

exports.updateTimes = (params, cb) => {
  const startDay = params.startDay;
  const query = defaultTime.update({
    startTime: params.startTime,
    endTime: params.endTime,
  }).where(defaultTime.date >= startDay).toQuery();

  db.query(params.id, query.text, query.values, cb);
};

exports.get = (params, cb) => {
  const existMap = {
    date: false,
    dayOfWeek: false,
    startTime: false,
    endTime: false,
  };

  // Dynamically create query from column keys existing in params
  _.forOwn(existMap, (exists, key) => {
    if (params[key] && !validator.isNull(params[key])) existMap[key] = true;
  });
  let query = defaultTime.where([]);
  _.forOwn(existMap, (exists, key) => {
    if (exists) query = query.and(defaultTime[key].equals(params[key]));
  });
  query = query.toQuery();

  db.query(params.id, query.text, query.values, cb);
};

/**
 * Delete a Default Time record
 * @param params hash of key values
 * @param cb optional callback function
 */
exports.removeOne = (params, cb) => {
  const query = defaultTime.delete().where(
    defaultTime.date.equals(params.date))
    .returning().toQuery();

  db.query(params.id, query.text, query.values, cb);
};

/**
 * Delete multiple Default Time records
 * @param params hash of key values; key dates must be an array of ISO 8601 date strings
 * @param cb optional callback function
 */
exports.removeMultiple = (params, cb) => {
  const query = defaultTime.delete().where(
    defaultTime.date.in(params.dates))
    .returning().toQuery();

  db.query(params.id, query.text, query.values, cb);
};

/**
 * Deletes EVERY Default Time record
 * @param id Request ID
 * @param cb optional callback function
 */
exports.removeAll = (id, cb) => {
  const query = defaultTime.delete().toQuery();

  db.query(id, query.text, query.values, cb);
};

exports.table = defaultTime;
