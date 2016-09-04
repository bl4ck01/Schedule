const express = require('express');
const validator = require('validator');
const _ = require('lodash');

const shiftService = require('../controllers/assignedShift');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/requests', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('sub_requests', { user: req.user });
  } else {
    res.render('sub_requests');
  }
});

router.post('/new', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Remove ! from authentication check
    const days = [];
    // Capture days from form data
    _.forOwn(req.body, (val, key) => {
      if ((/(days)\[[0-6]\]/).test(key)) days.push(val);
    });
    res.status(200).send(req.body);
  }
});

router.get('/get', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Remove ! from authentication check
    const params = {
      date: req.query.date,
      owner: req.query.owner,
      startTime: req.query.beginTime,
      endTime: req.query.endTime,
    };

    if (!validator.isNull(params.owner)) {
      if (!validator.isNull(params.startTime) && !validator.isNull(params.endTime)) {
        shiftService.getByDateOwnerAndStartEndTimes(params, (err, result) => {
          if (err != null) {
            res.status(err.code).send(err.message);
          } else {
            res.send(result.rows);
          }
        });
      } else if (!validator.isNull(params.startTime)) {
        shiftService.getByDateOwnerAndStartTime(params, (err, result) => {
          if (err != null) {
            res.status(err.code).send(err.message);
          } else {
            res.send(result.rows);
          }
        });
      } else if (!validator.isNull(params.endTime)) {
        shiftService.getByDateOwnerAndEndTime(params, (err, result) => {
          if (err != null) {
            res.status(err.code).send(err.message);
          } else {
            res.send(result.rows);
          }
        });
      } else {
        shiftService.getByDateAndOwner(params, (err, result) => {
          if (err != null) {
            res.status(err.code).send(err.message);
          } else {
            res.send(result.rows);
          }
        });
      }
    }
  } else {
    res.sendStatus(401);
  }
});

router.post('/drop', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
