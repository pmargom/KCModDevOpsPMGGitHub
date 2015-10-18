"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
// Carga de modelos necesarios
var Anuncio = mongoose.model('Anuncio');

// Auth con JWT
var jwtAuth = require('../../lib/jwtAuth');
router.use(jwtAuth());

router.get('/', function(req, res) {
   res.json({
      ok: true,
      message: req.__('ADMIN_ZONE_ACCESS_OK')
   });
});



module.exports = router;