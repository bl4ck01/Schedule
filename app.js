const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const uuid = require('node-uuid');

const logger = require('./services/logService');

const routes = require('./routes/index');
const users = require('./routes/users');

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
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Set up series of logs
// dev output logged to console if not running in production
if (app.get('env') === 'development') {
  app.use(logger('dev'));
}
// Log accesses to file
app.use(logger(':id :remote-addr :remote-user :date :method :url :status :response-time', {stream: logger.accessLogStream}));
// Log errors to separate log
app.use(logger('combined', {skip: logger.errorSkip, stream: logger.errorLogStream}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
