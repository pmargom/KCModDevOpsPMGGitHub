"use strict";

var mongoose = require('mongoose');


// DEFINICION DEL ESQUEMA

var usuarioSchema = mongoose.Schema({
   nombre: String,
   email: {type: String, index: true},
   clave: String
});

// METODOS ESTATICOS

// devolver la lista de usuarios
usuarioSchema.statics.lista = function(criterios, cb){

   let query = Usuario.find(criterios);

   query.exec(function(err, rows){

      if (err){
         return cb(err);
      }

      return cb(null, rows)

   });

};

// saber si un usuario existe. Aunque se podrá consultar por varios criterios
// la búsqueda se reliza por el email: no pueden existir dos usurios con el mismo email
usuarioSchema.statics.existe = function(criterios, cb){

   let query = Usuario.find(criterios);

   query.exec(function(err, rows){

      if (err){
         return cb(err);
      }

      return cb(null, rows.length > 0);

   });

};


// METODOS DE INSTANCIA

// EXPORTAMOS

var Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;