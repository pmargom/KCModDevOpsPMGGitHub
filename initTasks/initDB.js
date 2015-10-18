'use strict';

// Models
require('../models/Anuncio.js');
require('../models/Usuario.js');
require('../models/PushToken.js')

var mongoose = require('mongoose');
var db = mongoose.connection;
var readLine = require('readline');
var async = require('async');
var sha = require('sha256');

// Proceso el fichero json con los datos para inicializar la BD
var loadData = require('./loadData');
var datosIniciales = {};

db.once('open', function() {

   //console.log(process.env);

   console.log('initiDB: open')
   var rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout
   });

   rl.question('Desea inicializar la base de datos? (no) ', function(answer) {
      rl.close();
      if (answer.toLowerCase() === 'yes') {
         console.log('initDB: ejecutando scripts');

         loadData()
            .then(function(data){
               //console.log('Datos cargados', data);
               datosIniciales = data;
               runInstallScript();
         })
         .catch(function(err) {
            console.log('Error al procesar el fichero de datos: ', err);
            return process.exit(1);
         });

      } else {
         console.log('DB install aborted!');
         return process.exit(0);
      }

   });

});

function runInstallScript() {

   async.series(
      [
         initAnuncios,
         initUsuarios,
         initPushTokens
      ],
      (err, results) => {

         if (err)
         {
            console.error('Error al inicializar la base de datos: ', err);
            return process.exit(1);
         }
         console.log('initDB: runInstallScript: Inicialización de base de datos terminada con éxito.')
         return process.exit(0);

      });

}

function initAnuncios(cb) {

   //console.log(datosIniciales);
   if (datosIniciales.anuncios === undefined){
      console.log('no hay anuncios');
      return;
   }

   var Anuncio = mongoose.model('Anuncio');

   var objAnuncio = {};
   // elimino todos
   Anuncio.remove({}, () => {

      // una vez eliminado los registros antiguos, cargamos los nuevos
      datosIniciales.anuncios.forEach(function(item){
         objAnuncio = new Anuncio({
            nombre: item.nombre,
            venta: item.venta,
            precio: item.precio,
            foto: item.foto,
            tags: item.tags
         });

         objAnuncio.save(function(err, creado){

            if (err) {
               console.log(err);
               return next(err);
            }
         });
      });
      console.log('Anuncios inicializados.');
      return cb(null);
   });

}

function initUsuarios(cb) {

   if (datosIniciales.usuarios === undefined){
      console.log('no hay usuarios');
      return;
   }

   var Usuario = mongoose.model('Usuario');

   var objUsuario = {};

   // elimino todos
   Usuario.remove({}, () => {

      // una vez eliminado los registros antiguos, cargamos los nuevos
      datosIniciales.usuarios.forEach(function(item) {
         objUsuario = new Usuario({
            nombre: item.nombre,
            email: item.email,
            clave: sha(item.clave)
         });

         objUsuario.save(function (err, creado) {
            //console.log(creado);
            if (err) {
               console.log(err);
               return next(err);
            }

         });
      });
      console.log('Usuarios inicializados.');
      return cb(null);
   });

}

function initPushTokens(cb) {

   if (datosIniciales.pushTokens === undefined){
      console.log('no hay pushTokens');
      return;
   }

   var PushToken = mongoose.model('PushToken');

   var objPushToken = {};

   // elimino todos
   PushToken.remove({}, () => {

      // una vez eliminado los registros antiguos, cargamos los nuevos
      datosIniciales.pushTokens.forEach(function(item) {

         objPushToken = new PushToken({
            plataforma: item.plataforma,
            token: item.token,
            usuario: item.usuario
         });

         objPushToken.save(function (err, creado) {

            if (err) {
               console.log(err);
               return next(err);
            }

         });
      });
      console.log('PushTokens inicializados.');
      return cb(null);
   });

}

// CONECTAMOS

mongoose.connect('mongodb://localhost:27017/local');
