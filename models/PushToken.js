"use strict";

var mongoose = require('mongoose');

// DEFINICION DEL ESQUEMA

var pushTokenSchema = mongoose.Schema({
   plataforma: {type: String, enum: ['ios', 'android']},
   token: String,
   usuario: String
});

// METODOS ESTATICOS

// METODOS DE INSTANCIA

// EXPORTAMOS

var PushToken = mongoose.model('PushToken', pushTokenSchema);

module.exports = PushToken;