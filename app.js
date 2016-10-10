const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const session = require('express-session');
const favicon = require('serve-favicon');
const compression = require('compression');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const helmet = require('helmet');
const nocache = require('nocache');
const validator = require('express-validator');
const raven = require('raven');

// configuration parameters
const config = require('./config/config');

const passport = require('./services/passportService');
const logger = require('./services/logService');

// String used by Morgan loggers
const logString = ':id :remote-addr - :remote-user [:date[cfl]] ":method :url ' +
  'HTTP/:http-version" :status :res[content-length] :response-time ms';

/**
 * Assigns a UUID to every Request
 * @param req Request
 * @param res Response
 * @param next Next callback
 */
function genUniqueId(req, res, next) {
  // eslint-disable-next-line no-param-reassign
  req.id = uuid.v4();
  next();
}

// Establish secret for cookies
config.cookieSecret = uuid.v4();

// for HTTPS server
const sslOptions = {
  key: fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert),
  ca: [
    fs.readFileSync(`${config.ca}_1.cer`),
    fs.readFileSync(`${config.ca}_2.cer`),
    fs.readFileSync(`${config.ca}_3.cer`),
  ],
  requestCert: true,
  rejectUnauthorized: false,
};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Pretty print JSON responses
app.set('json', 4);

// Improve response rate by compressing data with Gzip
app.use(compression());
// Assign each request a UUID
app.use(genUniqueId);
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
// Log accesses to file
app.use(logger.log(logString, { stream: logger.accessLogStream }));
// Log errors to separate log
app.use(logger.log(logString, { skip: logger.errorSkip, stream: logger.errorLogStream }));
// Log to console
if (app.get('env') === 'development') {
  app.use(logger.log(logString));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
app.use(session({
  secret: config.cookieSecret,
  name: 'LTSHelpDesk.sid',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, httpOnly: true },
}));
app.use(passport._.initialize());
app.use(passport._.session());
app.use(express.static(path.join(__dirname, 'public')));

// secure app from several top Express/web security concerns
app.use(helmet());
app.use(helmet.hsts({
  maxAge: 7776000000, // 90 days in milliseconds
  includeSubDomains: true,
}));
app.use(nocache());
app.use(raven.middleware.express.requestHandler(config.errorCreds.url));
app.use(raven.middleware.express.errorHandler(config.errorCreds.url));

/**
 * REQUIRED: All app routes loaded here
 */
const routes = require('./routes/index');
const admin = require('./routes/admin');
const shifts = require('./routes/shifts');
const defaultTime = require('./routes/defaultTime');

/**
 * REQUIRED: All available routes added to server here
 */
app.use('/', routes);
app.use('/admin', admin);
app.use('/shifts', shifts);
app.use('/times/default', defaultTime);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    logger.write.error(err);
    res.end(`${res.sentry}\n`);
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  logger.write.error(err);
  res.end(`${res.sentry}\n`);
});

/**
 * Event listener for server "error" event.
 * @param error thrown error
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${config.httpsPort}`
    : `Port ${config.httpsPort}`;

  // handle specific listen errors with friendly messages
  if (error.code === 'EACCES') {
    logger.write.warn(`${bind} requires elevated privileges`);
    process.exit(1);
  } else if (error.code === 'EADDRINUSE') {
    logger.write.warn(`${bind} is already in use`);
    process.exit(1);
  } else {
    throw error;
  }
}

const server = https.createServer(sslOptions, app)
  .on('error', onError)
  .listen(config.httpsPort, () => {
    logger.write.console(`Server up, process ${process.pid}`);
    // Drop root privileges from binding to privileged HTTPS port
    try {
      process.setgid(config.gid);
      process.setuid(config.uid);
      logger.write.console(`Server privileges dropped, owner ${config.uid}`);
    } catch (err) {
      logger.write.error('Unable to drop privileges, exiting.');
      process.exit(1);
    }
  });

module.exports = server;
