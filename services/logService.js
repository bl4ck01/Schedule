const morgan = require('morgan');
const winston = require('winston');
const path = require('path');
const fileStreamRotator = require('file-stream-rotator');
const fs = require('fs');

function date() {
  const d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate();

  // Ensure month and day have 2 digits (e.g. 01 instead of 1)
  if (month.toString().length < 2) {
    month = '0' + month;
  }
  if (day.toString().length < 2) {
    day = '0' + day;
  }

  return d.getFullYear() + '-' + month + '-' + day;
}

// configuration parameters
const params = require('../config/config');
const logDirectory = path.join(params.rootDir, 'log');
const workerFile = path.join(logDirectory, 'workers-' + date() + '.log');
const errorFile = path.join(logDirectory, 'err-' + date() + '.log');
const dateFormat = 'YYYY-MM-DD';

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// retrieve unique id of a request
morgan.token('id', function getId(req) {
  return req.id;
});

/**
 * Winston configuration
 */

winston.emitErrs = true; // unhandled exceptions should be logged, not ignored
winston.loggers.exitOnError = false; // unhandled exceptions do not shut down logging service

winston.loggers.add('workers', {
  transports: [
    new winston.transports.File({
      name: 'worker-log-file',
      label: 'worker status logger',
      level: 'info',
      filename: workerFile,
      handleExceptions: false,
      maxsize: 5242880, // 5 MB
      maxFiles: 10,
      json: true,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ]
});

winston.loggers.add('errors', {
  transports: [
    new winston.transports.File({
      name: 'error-log-file',
      label: 'error logger',
      level: 'warn',
      filename: errorFile,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      maxsize: 5242880, // 5 MB
      maxFiles: 10,
      json: true,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ]
});

/**
 * Morgan log functions
 *
 * Second two streams create daily rotating logs for files used by Winston - easy rotation with no extra library.
 * Exported to
 */

// create an automatic rotating write stream for server requests
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

/**
 * Winston log functions
 */

exports.write = {
  worker: (message) => {
    winston.loggers.get('workers').info(message);
  },
  error: (message) => {
    winston.loggers.get('error').error(message);
  },
  warn: (message) => {
    winston.loggers.get('error').warn(message);
  },
  console: (message) => {
    winston.loggers.get('errors').debug(message);
  }
};

exports.log = morgan;
