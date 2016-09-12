const express = require('express');

const logger = require('../services/logService');
const defaultTime = require('../controllers/defaultTime');
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
function resolveResponse(id, err, result, res) {
  if (err) {
    logger.write.error({ id, err });
    res.status(err.code).send({ id, msg: err.message });
  } else {
    res.status(200).send(result);
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

router.post('/create', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: remove ! from authentication check
    // Validate params
    req.checkBody('startTime', 'start time is required').notEmpty();
    req.checkBody('endTime', 'end time is required').notEmpty();
    req.checkBody('range', 'range is required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
      errors = { code: 400, message: errors };
      resolveResponse(errors, null, res);
    } else {
      // Get all days from today to range
      const days = getDateRange(date.date(), req.body.range);

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

      defaultTime.createMany(params, (err, result) => {
        result.rows.forEach((entity) => {
          // eslint-disable-next-line no-param-reassign
          entity.date = date.formatDate(entity.date);
        });
        resolveResponse(req.id, err, result.rows, res);
      });
    }
  } else {
    res.sendStatus(401);
  }
});

router.post('/update', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: remove ! from authentication check
    // Validate params
    let errors;
    if (req.checkBody('startTime', 'start time is required').notEmpty()
      || req.checkBody('endTime', 'end time is required').notEmpty()) {
      errors = { code: 400, message: req.validationErrors() };
      resolveResponse(errors, null, res);
    }

    const params = {
      id: req.id,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      startDay: date.date(),
    };

    defaultTime.updateTimes(params, (err, result) => {
      resolveResponse(req.id, err, result.rows, res);
    });
  } else {
    res.sendStatus(401);
  }
});

/**
 * PUT/DELETE routes
 */

module.exports = router;
