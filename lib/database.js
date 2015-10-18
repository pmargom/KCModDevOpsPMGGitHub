"use strict";

var mongoose = require('mongoose');

var db = mongoose.connection;

// handler de error de conexion
db.on('error', function(err) {
   console.log(err);
   process.exit(1);
});

// handler de conexión

db.once('open', function() {
   console.log('Database: conectado a mongodb');
});

// conectamos

mongoose.connect('mongodb://localhost:27017/local');
