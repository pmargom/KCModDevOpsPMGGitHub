"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

// Carga de modelos necesarios
var Anuncio = mongoose.model('Anuncio');

/**
 * @api {get} /apiv1/tags Listado de tags
 * @apiGroup tags
 * @apiDescription Método encargado de mostrar el listado de tags actualmente almancenados en los anuncios.
 *
 * @apiHeader {String} Accept-Language Representa el lenguaje para tratamiento errores. (es:español en:ingles). Si no se espcifica, "es" por defecto.
 *
 * @apiHeaderExample {json} Ejemplo-Header:
 *  "Accept-Language":"en"
 *
 * @apiSuccessExample {json} OK(200) Response:
 * {
 * "ok": true,
 * "data": [
 *   "work",
 *   "lifestyle",
 *   "motor",
 *   "mobile",
 *   ""
 * ]
 *}
 * @apiError ok false
 * @apiError error  Mensaje de error
 * @apiErrorExample {json} Error-Response:
 * {
 * "ok": false,
 * "error": "Error during retrieving data"
 * }
 *
 */
router.get('/', function(req, res){

   Anuncio.tags(function(err, result){

      if (err) {

         console.log(err);
         return res.json({
            ok: false,
            error: req.__('ERROR_RETRIEVING_DATA')
         });

      }

      return res.json({
         ok: true,
         data: result
      });

   });

});

// exportamos el módulo
module.exports = router;