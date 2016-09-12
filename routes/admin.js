const express = require('express');

const defaultTime = require('../controllers/defaultTime');
const logger = require('../services/logService');
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
function resolveResponse(id, err, result, res) {
  if (err) {
    logger.write.error({ id, err });
    res.status(err.code).send({ id, msg: err.message });
  } else {
    res.status(200).send(result);
  }
}

/* Admin home page */
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Modify if/else statement once authentication is configured
    // TODO: Check for existence of default times
    defaultTime.get({
      date: date.date(),
    }, (err, result) => {
      if (err) {
        resolveResponse(req.id, err, null, res);
        // If default time exists for today
      } else if (result.rows.length > 0) {
        const day = result.rows[0];
        res.render('admin_home', {
          user: req.user,
          startTime: day.startTime,
          endTime: day.endTime,
        });
      } else {
        res.render('admin_home', { user: req.user });
      }
    });
  } else {
    res.status(401).send('Not logged in');
  }
});

module.exports = router;
