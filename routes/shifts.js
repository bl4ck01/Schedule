const express = require('express');
const router = express.Router();
const shiftService = require('../services/assignedShiftService');

const passport = require('passport');

router.get('/requests', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('sub_requests', { user: req.user });
  } else {
    res.render('sub_requests');
  }
});

router.post('/get', (req, res, next) => {
  if (res.isAuthenticated()) {
    
  }
});

router.post('/drop', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.sendStatus(200);
  } else {
    res.sendStatus(200);
  }
});

module.exports = router;