"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

// Carga de modelos necesarios
var Anuncio = mongoose.model('Anuncio');

// MÉTODOS QUE REQUIEREN AUTHENTICACIÓN

// Auth con JWT
var jwtAuth = require('../../lib/jwtAuth');
router.use(jwtAuth());

/**
 * @api {get} /apiv1/anuncios Lista de anuncios
 * @apiGroup anuncios
 * @apiDescription Método encargado de mostrar el listado de anuncios con varios filtros opcionales. Al ser un método
 * auténticado, deberá recibir el token de un usaurio autenticado.
 *
 * @apiHeader {String} Accept-Language Representa el lenguaje para tratamiento errores. (es:español en:ingles). Si no se espcifica, "es" por defecto.
 *
 * @apiHeaderExample {json} Ejemplo-Header:
 * "Accept-Language":"es"
 *
 * @apiParam {String} token (obligatorio) token generado una vez el usuario está autenticado
 * @apiParam {String} tag (opcional) tag por el que se quiere filtrar.
 * @apiParam {Boolean} venta (opcional) true | false indicando se al artículo está a la venta o no.
 * @apiParam {String} nombre (opcional) filtra artículos cuyo nombre empiecen por el valor especificado.
 * @apiParam {Boolean} includeTotal (opcional) true | false indicando si queremos mostrar el nº total de registros devueltos.
 * @apiParam {String} precio (opcional) indica el rango de precios con el formato <precio1-precio2>. Ejemplos:
 *
 * precio=10-50 artículos con precio entre 10 y 50
 *
 * precio=10-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;articulos con precio mayor o igual que 10
 *
 * precio=-50&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;artículos con precio menor o igual que 50
 *
 * @apiParam {Number} start (opcional) indica el nº de página de los resultados a mostrar
 * @apiParam {Number} limit (opcional) indica el nº de resultados a mostrar
 *
 * @apiSuccessExample {json} OK(200) Response:
 * {
  "ok": true,
  "data": {
    "total": 2,
    "rows": [
      {
        "_id": "560e8625000fa62c23942593",
        "nombre": "Articulo5",
        "venta": false,
        "precio": 8,
        "foto": "http://dummyimage.com/150x200/0b219e/fff.png&text=No+image",
        "__v": 0,
        "tags": [
          "work",
          "lifestyle"
        ]
      },
      {
        "_id": "560e8625000fa62c23942596",
        "nombre": "Articulo5",
        "venta": false,
        "precio": 8,
        "foto": "http://dummyimage.com/150x200/0b219e/fff.png&text=No+image",
        "__v": 0,
        "tags": [
          "work",
          "lifestyle"
        ]
      }
    ]
  }
}
 * @apiError ok false
 * @apiError error  Mensaje de error
 * @apiErrorExample {json} Error-Response:
 * {
 * "ok": false,
 * "error": "Error during retrieving data"
 * }
 *
 */
router.get('/', function(req, res) {

   let filters = {};

   if (req.query.tag) {
      filters.tags = req.query.tag;
   }

   if (req.query.venta) {
      filters.venta = req.query.venta;
   }

   if (req.query.nombre) {
      filters.nombre = {$regex: new RegExp('^' + req.query.nombre, "i")};
   }

   if (req.query.precio) {
      let precios = req.query.precio.split('-');
      if (precios.length === 2) { // por ejemplo: 10-50, precio entre 10 y 50

         filters.precio = {'$gte': precios[0], '$lte': precios[1]};

      } else if (precios.length === 1 && req.query.precio[0] === '-') { // por ejemplo -50, precio hasta 50
         filters.precio = {'$lte': precios[1]};
      } else if (precios.length === 1 && req.query.precio[req.query.precio.length - 1] === '-') { // por ejemplo 10-, precio a partir de 10
         filters.precio = {'$gte': precios[1]};
      }
   }

// opciones de la consulta (paginación, ordenación, etc)

   let options = {};

   if (req.query.start) {
      options.start = req.query.start;
   }

   if (req.query.limit) {
      options.limit = req.query.limit;
   }

   if (req.query.includeTotal) {
      options.includeTotal = req.query.includeTotal;
   }

   if (req.query.sort) {
      options.sort = req.query.sort;
   }

   Anuncio.lista(filters, options, function (err, result) {

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

   })

});

// exportamos el módulo
module.exports = router;