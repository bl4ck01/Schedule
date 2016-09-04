const express = require('express');
const _ = require('lodash');
const async = require('async');

const logger = require('../services/logService');
const assignedShift = require('../controllers/assignedShift');
const date = require('../services/dateService');

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Resolves response with either error or result of request
 * @param err Any Error generated from the request
 * @param result Results of the request
 * @param res Response of the request
 */
function resolveResponse(err, result, res) {
  if (err) {
    logger.write.error(err);
    res.status(err.code).send(err.message);
  } else {
    res.status(200).send(result);
  }
}

/**
 * GET routes
 */

router.get('/requests', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('sub_requests', { user: req.user });
  } else {
    res.render('sub_requests');
  }
});

router.get('/get', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Remove ! from authentication check
    async.waterfall([
      (callback) => {
        // Validate params
        req.checkQuery('date', 'Date is required').notEmpty();

        let errors = req.validationErrors();
        if (errors) errors = { code: 400, message: errors };
        const params = {
          date: req.query.date,
          owner: req.query.owner,
          startTime: req.query.beginTime,
          endTime: req.query.endTime,
        };
        // If no errors exist, errors will be null
        callback(errors, params);
      },

      (params, callback) => {
        assignedShift.get(params, callback);
      },

    ], (err, result) => resolveResponse(err, result, res));
  } else {
    res.sendStatus(401);
  }
});

/**
 * POST routes
 */

router.post('/new', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Remove ! from authentication check
    async.waterfall([
      (callback) => {
        // Capture dayNames from form data
        const dayNames = [];
        _.forOwn(req.body, (val, key) => {
          if ((/(days)\[[0-6]\]/).test(key)) dayNames.push(val);
        });

        const daySet = new Set(dayNames);
        const days = [];

        const dayRange = date.getRange(req.body.fromDate, req.body.toDate);
        while (dayRange.hasNext()) {
          const unformattedDay = dayRange.next();
          const dayName = unformattedDay.format('ddd');

          // Day must be formatted in ISO 8601 format for Postgres date type
          if (daySet.has(dayName)) days.push(unformattedDay.format('YYYY-MM-DD'));
        }

        callback(null, days);
      },

      (days, callback) => {
        const params = { data: [] };
        days.forEach((day) => {
          const entry = {
            date: day,
            owner: req.body.owner,
            startTime: req.body.beginTime,
            endTime: req.body.endTime,
          };
          params.data.push(entry);
        });

        callback(null, params);
      },

    ], (err, result) => resolveResponse(err, result, res));
  }
});

router.post('/drop', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

/**
 * PUT/DELETE routes
 */

router.put('/update', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Remove ! from authentication check
    res.status(200).send(req.body);
  }
});

module.exports = router;
