const express = require('express');
const passport = require('passport');

const router = express.Router();

/* Admin home page */
router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) { // TODO: Modify if/else statement once authentication is configured
    res.render('admin_home', { user: req.user });
  } else {
    res.render('admin_home', { user: null });
  }
});

module.exports = router;
