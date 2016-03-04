const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const compression = require('compression');
const bodyParser = require('body-parser');
const uuid = require('node-uuid');
const session = require('express-session');

const logger = require('./services/logService');

function assignId(req, res, next) {
  req.id = uuid.v4();
  next();
}

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Improve response rate by compressing data with Gzip
app.use(compression());
// Assign unique ID to all requests
app.use(assignId);
// uncomment after placing your favicon in /public/images
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Set up series of logs
// dev output logged to console if not running in production
if (app.get('env') === 'development') {
  app.use(logger.log('dev'));
}

// Log accesses to file
app.use(logger.log(':remote-addr user: :remote-user :date :method :url :status :response-time', {stream: logger.accessLogStream}));
// Log errors to separate log
app.use(logger.log('combined', {skip: logger.errorSkip, stream: logger.errorLogStream}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * REQUIRED: All app routes loaded here
 */
const routes = require('./routes/index');
const admin = require('./routes/admin');

/**
 * REQUIRED: All available routes added to server here
 */
app.use('/', routes);
app.use('/admin', admin);

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
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    logger.write.error(err);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  logger.write.error(err);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
