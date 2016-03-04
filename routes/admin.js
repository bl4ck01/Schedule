const express = require('express');
const router = express.Router();

const passport = require('passport');

/* Admin home page */
router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) { //TODO: Modify if/else statement once authentication is configured
    res.render('admin_home', { user: req.user });
  } else {
    res.render('admin_home', { user: null });
  }
});

module.exports = router;
