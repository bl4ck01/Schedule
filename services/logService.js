const logger = require('morgan');
const fileStreamRotator = require('file-stream-rotator');
const fs = require('fs');

// configuration parameters
const params = require('../config/config');
const logDirectory = params.rootDir + 'log';
const dateFormat = 'YYYY-MM-DD';

// retrieve unique id of a request
logger.token('id', function getId(req) {
  return req.id;
});

// ensure log directory exists
fs.existsSync(logDirectory || fs.mkdirSync(logDirectory));

// create a rotating write stream for server requests
exports.accessLogStream = fileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  date_format: dateFormat,
  verbose: false
});

// create a rotating write stream for worker generation and death
exports.threadLogStream = fileStreamRotator.getStream({
  filename: logDirectory + '/workers-%DATE%.log',
  frequency: 'daily',
  date_format: dateFormat,
  verbose: false
});

// create a rotating write stream for server errors
exports.errorLogStream = fileStreamRotator.getStream({
  filename: logDirectory + '/err-%DATE%.log',
  frequency: 'daily',
  date_format: dateFormat,
  verbose: false
});

exports.errorSkip = (req, res) => {
  return res.statusCode < 400;
};

exports.logger = logger;
