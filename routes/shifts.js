const express = require('express');
const router = express.Router();
const shiftService = require('../services/assignedShiftService');
const logger = require('../services/logService');

const passport = require('passport');

router.get('/requests', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('sub_requests', { user: req.user });
  } else {
    res.render('sub_requests');
  }
});

router.post('/get', (req, res, next) => {
  if (!req.isAuthenticated()) { //TODO: Remove ! from authentication check
    const params = { date: req.body.date, owner: req.body.owner, startTime: req.body.beginTime, endTime: req.body.endTime };

    if (params.startTime != null && params.endTime != null) {
      shiftService.getByDateOwnerAndStartEndTimes(params, (err, result) => {
        if (err != null) {
          res.status(err.code).send(err.message);
        } else {
          res.send(result);
        }
      })
    } else if (params.startTime != null) {
      shiftService.getByDateOwnerAndStartTime(params, (err, result) => {
        if (err != null) {
          res.status(err.code).send(err.message);
        } else {
          res.send(result);
        }
      })
    } else if (params.endTime != null) {
      shiftService.getByDateOwnerAndEndTime(params, (err, result) => {
        if (err != null) {
          res.status(err.code).send(err.message);
        } else {
          res.send(result);
        }
      })
    } else {
      shiftService.getByDateAndOwner(params, (err, result) => {
        if (err != null) {
          res.status(err.code).send(err.message);
        } else {
          res.send(result);
        }
      })
    }
  } else {
    res.sendStatus(401);
  }
});

router.post('/drop', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;