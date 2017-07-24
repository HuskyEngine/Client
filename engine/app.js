const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const config       = require('../config.json');

const index = require('./routes/index');
const app   = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, '..', 'logo.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/scenes', express.static(path.join(__dirname, '..', 'scenes')));
app.use('/img', express.static(path.join(__dirname, '..', 'assets/images')));
app.use('/sprites', express.static(path.join(__dirname, '..', 'assets/sprites')));
app.use('/animations', express.static(path.join(__dirname, '..', 'assets/animations')));
app.use('/fonts', express.static(path.join(__dirname, '..', 'assets/fonts')));
app.use('/apple-touch-icon.png', express.static(path.join(__dirname, '..', 'reverselogo.png')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
