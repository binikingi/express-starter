var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/checkbranch', (req,res) => {
  res.status(200).send('branch ok');
});
app.get('/check', (req,res) => {
    res.status(200).send('check health ok!');
});

app.get('/downloadmovie', (req,res) => {
    res.render('downloadmovie', {title: 'download movie to the server'});
});
app.post('/add_movie', (req,res) => {
  const name = req.body.title;
  const link = req.body.link;
  var pool  = mysql.createPool({
      host            : 'testdbinstance.cc2uma6sum94.us-east-2.rds.amazonaws.com',
      user            : 'root',
      password        : 'bini1234',
      database        : 'test'
  });
  pool.query("insert into download_queue(magnet) values(?)", [link], function(err, results, fields){
      if(err){
          res.send(err.message);
      }
      else
        res.send('ok');
  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
