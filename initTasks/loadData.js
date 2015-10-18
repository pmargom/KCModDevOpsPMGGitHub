"use strict";

// DEFINO COMO CARGAR LA INFO PARA INICIALIZAR LA BD

var fs = require('fs');

/**
 * @function loadData
 * @description Realiza la carga de los datos que serán usados para inicializar la base de datos. Los datos proceden
 * del fichero data.json.
 * @return {Promise}
 */
function loadData()
{
   return new Promise(function(resolve, reject){

      fs.readFile('./initTasks/data.json', function (err, data) {
         if (err) {
            return reject(err); //cb(err);
         }

         try {

            // parsearlo
            var dataJson = JSON.parse(data);

         } catch (e) {

            return reject(e); //cb(e);

         }

         // devolver las dependencias
         var datos = {
           "usuarios": dataJson.usuarios,
            "anuncios": dataJson.anuncios,
            "pushTokens": dataJson.pushTokens
         };

         return resolve(datos);

      });

   });
}

// exporto la función que cargará los datos desde el json
module.exports = loadData;