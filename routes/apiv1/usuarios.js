'use strict';

/**
 * API /usuarios resource.
 * @module routes/apiv1/usuarios
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('Usuario');
var sha = require('sha256');

var jwt = require('jsonwebtoken');
var config = require('../../localConfig');

/**
 * @api {post} /apiv1/authenticate Autentificación Usuario
 * @apiGroup usuarios
 *
 * @apiDescription Método encargado de autenticar a un usuario.
 *
 * @apiHeader {String} Accept-Language Representa el lenguaje para tratamiento errores. (es:español en:ingles). Si no se espcifica, "es" por defecto.
 *
 * @apiHeaderExample {json} Ejemplo-Header:
 * "Accept-Language":"es"
 *
 * @apiParam {String} user email del usuario
 * @apiParam {String} pass password del usuario
 *
 * @apiSuccessExample {json} OK(200) Response:
 {
   "ok": true,
   "message": "Su token fue generado con éxite.",
   "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NjBlODYyNTAwMGZhNjJjMjM5NDI1ZDEiLCJub21icmUiOiJ1c2VyMSIsImVtYWlsIjoidXNlcjFAdGVzdC5jb20iLCJjbGF2ZSI6IjE5MjExZDQ4N2NkNWMxOTA3ZjU4OTI0MzVlNWExYTM4Mjk2MGQ0ZTdiMzM1ZTY1Y2RjZTVhMmZhMDU5OGIxOWQiLCJfX3YiOjB9.7t1QEymPJ_0JCzCLkmODFCM2C-KtIfO7TjzXJaQekqI"
 }
 * @apiError success false
 * @apiError msg  Mensaje de error
 * @apiErrorExample {json} Error(4xx)-Response:
 * {
  "ok": false,
  "error": {
    "code": 401,
    "message": "Error de autenticación. Contraseña incorrecta."
  }
}
 */
router.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({

       email: req.body.user

    }, function(err, user) {
       if (err) {

          return res.status(500).json({
             ok: false,
             error: {
                code: 500,
                message: err.message
             }
          });

       }

       if (!user) {

          return res.json({
             ok: false,
             error: {
                code: 401,
                message: req.__('ERROR_AUTHENTICATION_FAILED_USER_NOT_FOUND')
             }
          });

       } else if (user) {

          // check if password matches
          if (user.clave != sha(req.body.pass)) {

             res.json({
                ok: false,
                error: {
                   code: 401,
                   message: req.__('ERROR_AUTHENTICATION_FAILED_WRONG_PASSWORD')
                }
             });

          } else {

             // if user is found and password is right
             // create a token
             var token = jwt.sign(user, config.jwt.secret, {
                expiresInMinutes: config.jwt.expiresInMinutes
             });

             // return the information including token as JSON
             res.json({
                ok: true,
                message: req.__('TOKEN_GENERATED'),
                token: token
             });

          }

       }

    });
});

/**
 * @api {post} /apiv1/register Regsitro de Usuario
 * @apiGroup usuarios
 *
 * @apiDescription Método encargado de registrar a un usuario.
 *
 * @apiHeader {String} Accept-Language Representa el lenguaje para tratamiento errores. (es:español en:ingles). Si no se espcifica, "es" por defecto.
 *
 * @apiHeaderExample {json} Ejemplo-Header:
 * "Accept-Language":"es"
 *
 * @apiParam {String} nombre nombre del nuevo usuario
 * @apiParam {String} email email del nuevo usuario
 * @apiParam {String} clave email del nuevo usuario
 *
 * @apiSuccessExample {json} OK(200) Response:
 {
   "ok": true,
   "usuario": {
     "__v": 0,
     "nombre": "pepe",
     "email": "pepe@test.com",
     "clave": "pepepass",
     "_id": "561148baa3a1a0352d1b7d23"
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
router.post('/register', function(req, res) {

   // recogemos los datos
   var nombre = req.body.nombre;
   var email = req.body.email;
   var clave = req.body.clave;

   // validamos los datos
   if ((typeof nombre === 'undefined') || (typeof email === 'undefined') || (typeof clave === 'undefined')) {
      return res.json({
         ok: false,
         error: req.__('ERROR_VALIDATION')
      });
   }

   // preparo el el objeto con la información del nuevo usuario
   var usuario = new User({
      nombre: nombre,
      email: email,
      clave: sha(clave)
   });

   // comprobamos que el usuario no existe previamente
   User.existe({email: email}, function (err, result) {

      if (err) { // se produjo un error al comprobar si ya existe un usuario registrado con el mismo email

         console.log(err);
         return res.json({
            ok: false,
            error: req.__('ERROR_CHECKING_PRIMARY_KEY')
         });

      }

      if (result) { // si al menos existe un usuario registrado con ese email, no podemo registrar

         console.log(err);
         return res.json({
            ok: false,
            error: req.__('ERROR_PRIMARY_KEY_VIOLATION')
         });

      }

      // no existen usuarios registrados con los datos proporcionados, entonces podemos continuar

      usuario.save(function (err, creado) {
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
