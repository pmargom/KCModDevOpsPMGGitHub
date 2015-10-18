"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var PushToken = mongoose.model('PushToken');
var Usuario = mongoose.model('Usuario');

/**
 * @api {post} /apiv1/pushtoken PushTokens Usuario
 * @apiGroup pushtokens
 *
 * @apiDescription Método encargado de almacenar el token para notificaciones push de un usuario.
 *
 * @apiHeader {String} Accept-Language Representa el lenguaje para tratamiento errores. (es:español en:ingles). Si no se espcifica, "es" por defecto.
 *
 * @apiHeaderExample {json} Ejemplo-Header:
 * "Accept-Language":"es"
 *
 * @apiParam {String} usuario email del usuario
 * @apiParam {String} plataforma indica el dispositivo del usuario al que se enviarán las notificaciones push
 * @apiParam {tokenpush} token push que servirá para identificar el dispositivo del usuario
 *
 * @apiSuccessExample {json} OK(200) Response:
 {
   "ok": true,
   "usuario": {
     "__v": 0,
     "plataforma": "ios",
     "token": "kakajakkkjlaljkskjlabskdbajks",
     "usuario": "user1@test.com",
     "_id": "56114a02d3eed9312dd9380c"
   }
 }
 * @apiError ok false
 * @apiError error  Mensaje de error
 * @apiErrorExample {json} Error(4xx)-Response:
 * {
  "ok": false,
  "error": "Error al guardar los datos."
}
 */
router.post('/', function(req, res){

   // recogemos los valores globales de la cabecera
   let language = req.headers.language || 'en_us'; // si no se ha especificado un idioma, usamos inglés por defecto

   // recogemos los datos
   let plataforma = req.body.plataforma;
   let tokenpush = req.body.tokenpush;
   let usuario = req.body.usuario;

   // validamos los datos
   if ((typeof plataforma === 'undefined') || (typeof tokenpush === 'undefined') || (typeof usuario === 'undefined')) {

      return res.json({
         ok: false,
         error: req.__('ERROR_VALIDATION')
      });

   }

   // una vez validados los datos, creamos el nuevo objeto
   var nuevo = {
      plataforma: plataforma,
      token: tokenpush,
      usuario: usuario
   }

   // preparo el el objeto con la información del nuevo elemento
   var pushToken = new PushToken(nuevo);

   // comprobamos que el usuario no existe previamente
   Usuario.existe({email: usuario}, function (err, result) {

      if (err) { // se produjo un error al comprobar si ya existe un usuario registrado con el mismo email

         console.log(err);
         return res.json({
            ok: false,
            error: req.__('ERROR_CHECKING_PRIMARY_KEY')
         });

      }

      if (!result) { // si no existe un usuario registrado con ese email, no guardar el token push

         console.log(err);
         return res.json({
            ok: false,
            error: req.__('ERROR_USER_NOT_FOUND')
         });

      }

      // si existe usuario registrado con los datos proporcionados, entonces podemos continuar

      pushToken.save(function (err, creado) {

         if (err) {

            console.log(err);
            return res.json({
               ok: false,
               error: req.__('ERROR_DURING_SAVING')
            });

         }

         // devolver una confirmación
         res.json({
            ok: true,
            usuario: creado
         });

      });

   });

});

module.exports = router;