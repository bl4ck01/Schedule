const express = require('express');

const logger = require('../services/logService');
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
    res.status(200).send(result);
  }
}

/**
 * GET routes
 */

router.get('/requests', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Remove ! from authentication check
    res.render('sub_requests', { user: req.user });
  } else {
    res.sendStatus(401);
  }
});

router.get('/get', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Remove ! from authentication check
    // Validate params
    req.checkQuery('date', 'Date is required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
      errors = { code: 400, message: errors };
      respond(req.id, errors, null, res);
    } else {
      const params = {
        id: req.id,
        date: req.query.date,
        owner: req.query.owner,
        startTime: req.query.beginTime,
        endTime: req.query.endTime,
      };

      assignedShift.get(params, (err, result) => respond(req.id, err, result.rows, res));
    }
  } else {
    res.sendStatus(401);
  }
});

router.get('/get/all', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Remove ! from authentication check
    assignedShift.all(req.id, (err, result) => respond(req.id, err, result.rows, res));
  } else {
    res.sendStatus(401);
  }
});

/**
 * POST routes
 */

router.post('/new', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Remove ! from authentication check
    // TODO: Validate params

    const daySet = new Set(req.body.days);
    const days = [];

    // Create individual dates for each day between fromDate and toDate
    const dayRange = date.getRange(req.body.fromDate, req.body.toDate);
    while (dayRange.hasNext()) {
      const unformattedDay = dayRange.next();
      const dayName = unformattedDay.format('ddd');
      // Day must be formatted in ISO 8601 format for Postgres date type
      if (daySet.has(dayName)) days.push(unformattedDay.format('YYYY-MM-DD'));
    }

    const params = { data: [] };
    days.forEach((day) => {
      const entry = {
        id: req.id,
        date: day,
        owner: req.body.owner,
        startTime: req.body.beginTime,
        endTime: req.body.endTime,
      };
      params.data.push(entry);
    });

    assignedShift.createMany(params, (err, result) => {
      respond(req.id, err, result.rows, res);
    });
  } else {
    res.sendStatus(401);
  }
});

router.post('/drop', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Remove ! from authentication check
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
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
