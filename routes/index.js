const express = require('express');

const passport = require('../services/passportService');

// eslint-disable-next-line new-cap
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/cal');
});

router.get('/cal', (req, res) => {
  if (req.isAuthenticated()) { // TODO: Modify if/else statement once authentication is configured
    res.render('calendar', { user: req.user });
  } else {
    res.render('calendar', { user: null });
  }
});

router.get('/clock/in', (req, res) => {
  res.render('clock-in');
});

router.get('/login', passport._.authenticate('saml'),
  (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      res.render('login');
    }
  }
);

router.post('/login/callback', (req, res) => {
  const body = new Buffer(req.body.SAMLResponse, 'base64');
  // eslint-disable-next-line no-param-reassign
  req.body.SAMLResponse = body;
  passport._.authenticate('saml', (req1, res1) => {
    res1.redirect('/');
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.render('login', { message: 'You have been logged out' });
});

router.get('/shibboleth', (req, res) => {
  res.status(200).send(passport.strategy
    .generateServiceProviderMetadata());
});

module.exports = router;
