const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/cal');
});

router.get('/cal', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('calendar', {user: req.user});
  } else {
    res.render('calendar', {user: null});
  }
});

router.get('/clock/in', (req, res, next) => {
  res.render('clock-in');
});

router.get('/login', passport.authenticate('saml'),
  (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      res.render('login');
    }
  }
);

router.get('/login/callback', (req, res, next) => {
  res.redirect('/');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.render('login', { message: 'You have been logged out' });
});

module.exports = router;
