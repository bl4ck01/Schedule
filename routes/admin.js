const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

/* Admin home page */
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Modify if/else statement once authentication is configured
    res.render('admin_home', { user: req.user });
  } else {
    res.status(401).send('Not logged in');
  }
});

module.exports = router;
