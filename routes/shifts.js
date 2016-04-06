const express = require('express');
const router = express.Router();

const passport = require('passport');

router.post('/drop', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.sendStatus(200);
  } else {
    res.sendStatus(200);
  }
});

module.exports = router;