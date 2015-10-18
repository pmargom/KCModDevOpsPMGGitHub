"use strict";

var _ = require('underscore-node');
var mongoose = require('mongoose');

// DEFINCION DEL ESQUEMA

var anuncioSchema = mongoose.Schema({
   nombre: String,
   venta: Boolean,
   precio: Number,
   foto: String,
   tags: [String]
});

// METODOS ESTATICOS

// devolver la lista de anuncios
anuncioSchema.statics.lista = function(filters, options, cb) {

   var query = Anuncio.find(filters);

   if (options.start){
      query.skip(options.start);
   }

   if (options.limit){
      query.limit(options.limit);
   }

   if (options.sort){
      query.sort(options.sort);
   }

   query.exec(function(err, rows) {

      if (err) {
         return cb(err);
      }

      var result = {};

      if (options.includeTotal) {
         result.total = rows.length;
      }
      result.rows = rows;

      return cb(null, result);
   });

};

// devolver la lista de tags existentes
anuncioSchema.statics.tags = function(cb){

   Anuncio.distinct('tags', function(err, rows){

      if (err){
         return cb(err);
      }

      return cb(null, rows);

   })

};

// METODOS DE INSTANCIA




// EXPORTAMOS

var Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;