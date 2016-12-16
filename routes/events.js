const express = require('express');

const logger = require('../services/logService');
const event = require('../controllers/event');

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Resolves response with either error or result of request
 * @param id Request ID
 * @param err Any Error generated from the request
 * @param result Results of the request
 * @param res Response of the request
 */
function respond(id, err, result, res) {
  if (err) {
    logger.write.error({ id, err });
    res.status(err.code).send({ id, msg: err.message });
  } else {
    res.status(200).send(result);
  }
}

/**
 * GET routes
 */

router.get('/get/all', (req, res) => {
  if (!req.isAuthenticated()) { // TODO: Remove ! from authentication check
    event.all(req.id, (err, result) => respond(req.id, err, result.rows, res));
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
