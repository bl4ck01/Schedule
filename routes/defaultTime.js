const express = require('express');
const async = require('async');

const logger = require('../services/logService');
const defaultTime = require('../controllers/defaultTime');
const assignedShift = require('../controllers/assignedShift');
const date = require('../services/dateService');

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Resolves response with either error or result of request
 * @param id Request ID
 * @param err Any Error generated from the request
 * @param result Results of the request
 * @param res Response of the request
 */
function respond(id, err, result, res) {
  if (err) {
    logger.write.error({ id, err });
    res.status(err.code).send({ id, msg: err.message });
  } else {
    res.redirect('/admin/');
  }
}

/**
 * Calculates the days from firstDay until a certain number of days, inclusive.
 * @param firstDay first day in range
 * @param num number of days after firstDay to retrieve
 * @returns {Array} Array of ISO 8601 date strings and DOW for each date
 */
function getDateRange(firstDay, num) {
  const endDate = date.endOfRange(firstDay, num);
  const dayRange = date.getRange(firstDay, endDate);
  const days = [];

  // Get individual dates for each day in range as well as day of week for each date
  while (dayRange.hasNext()) {
    const day = dayRange.next();
    days.push({ date: day.format('YYYY-MM-DD'), dow: day.format('d') });
  }

  return days;
}

/**
 * GET routes
 */

/**
 * POST routes
 */

router.post('/new', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: remove ! from authentication check
    // Validate params
    req.checkBody('startTime', 'start time is required').notEmpty();
    req.checkBody('endTime', 'end time is required').notEmpty();
    req.checkBody('range', 'range is required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
      errors = { code: 400, message: errors };
      respond(errors, null, res);
    } else {
      // Get all days from today to range
      const days = getDateRange(date.date(), req.body.range || 0);

      const params = { data: [] };
      days.forEach((day) => {
        const entry = {
          id: req.id,
          date: day.date,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          dow: day.dow,
        };

        params.data.push(entry);
      });

      async.waterfall([
        (callback) => {
          const dates = [];
          params.data.forEach(entry => dates.push(entry.date));
          defaultTime.removeMultiple({ id: req.id, dates }, (err, result) => {
            callback(err, result.rows);
          });
        },
        (deletedShifts, callback) => {
          defaultTime.createMany(params, (err, result) => {
            const items = [];
            result.rows.forEach((entity) => {
              const item = entity;
              item.date = date.formatDate(item.date);
              items.push(item);
            });
            callback(err, items, deletedShifts);
          });
        },
        (defaultTimes, deletedShifts, callback) => {
          const shiftParams = {};
          shiftParams.data = deletedShifts;
          assignedShift.createMany(shiftParams, (err) => {
            callback(err, defaultTimes);
          });
        },
      ], (err, result) => {
        respond(req.id, err, result, res);
      });
    }
  } else {
    res.sendStatus(401);
  }
});

/**
 * PUT/DELETE routes
 */

module.exports = router;
