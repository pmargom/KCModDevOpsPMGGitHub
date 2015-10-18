var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var i18n = require('i18n');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// configuramos la gestión de idiomas para la app
i18n.configure({

  // lista de idiomas soportados
  locales: ['en', 'es'],

  // el idioma por defecto
  defaultLocale: 'es',

  // definimos la cookie para parsear los locales
  cookie: 'nodepopcookie',

  // directorio con los ficheros de idiomas
  directory: __dirname+'/locales'

});

// you'll need cookies
app.use(cookieParser());

// init i18n module for this loop
app.use(i18n.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mongo
require('./lib/database');

// Models
require('./models/Anuncio.js');
require('./models/Usuario.js');
require('./models/PushToken.js')

// Views
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// API Version 1

app.use('/apiv1/tags', require('./routes/apiv1/tags'));
app.use('/apiv1/pushtoken', require('./routes/apiv1/pushtokens'));
app.use('/apiv1/', require('./routes/apiv1/usuarios'));
app.use('/apiv1/authenticate', require('./routes/apiv1/usuarios'));
app.use('/apiv1/register', require('./routes/apiv1/usuarios'));
app.use('/apiv1/admin', require('./routes/apiv1/admin'));
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;

  // si lo que no existe es una ruta dentro del API
  if (req.originalUrl.indexOf('/apiv1/') !== -1){
    return res.json({
      status: err.status,
      message: err.message
    });
  }

  // si lo que no existe es una página
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
