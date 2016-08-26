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
const contentLength = require('express-content-length-validator');
const hpp = require('hpp');

// configuration parameters
const params = require('./config/config');

const passport = require('./services/passportService');
const logger = require('./services/logService');

function genUniqueId(req, res, next) {
  // eslint-disable-next-line no-param-reassign
  req.id = uuid.v4();
  next();
}

// Establish secret for cookies
params.cookieSecret = uuid.v4();

// for HTTPS server
const sslOptions = {
  key: fs.readFileSync(params.key),
  cert: fs.readFileSync(params.cert),
  requestCert: true,
  rejectUnauthorized: false,
};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Improve response rate by compressing data with Gzip
app.use(compression());
app.use(genUniqueId);
// uncomment after placing your favicon in /public/images
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Set up series of logs
// dev output logged to console if not running in production
if (app.get('env') === 'development') {
  app.use(logger.log('dev'));
}

// Log accesses to file
// eslint-disable-next-line max-len
app.use(logger.log(':id :remote-addr - :remote-user [:date[cfl]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms',
  { stream: logger.accessLogStream }));
// Log errors to separate log
app.use(logger.log('combined', { skip: logger.errorSkip, stream: logger.errorLogStream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
app.use(session({
  secret: params.cookieSecret,
  name: 'LTSHelpDesk.sid',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, httpOnly: true },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// secure app from several top Express/web security concerns
app.use(helmet());
app.use(helmet.hsts({
  maxAge: 7776000000, // 90 days in milliseconds
  includeSubDomains: true,
}));
app.use(nocache());
// Prevent large payload attacks.
// Defaults to max size 999, status code 400, message 'Invalid payload; too big.'
app.use(contentLength.validateMax());
// protect against HTTP Parameter Pollution attacks
app.use(hpp());

/**
 * REQUIRED: All app routes loaded here
 */
const routes = require('./routes/index');
const admin = require('./routes/admin');
const shifts = require('./routes/shifts');

/**
 * REQUIRED: All available routes added to server here
 */
app.use('/', routes);
app.use('/admin', admin);
app.use('/shifts', shifts);

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
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  logger.write.error(err);
  res.render('error', {
    message: err.message,
    error: {},
  });
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
    ? `Pipe ${params.httpsPort}`
    : `Port ${params.httpsPort}`;

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
  .listen(params.httpsPort)
  .on('error', onError);

module.exports = server;
