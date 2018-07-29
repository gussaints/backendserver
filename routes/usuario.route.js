var express = require('express');
var router = express.Router();
var Usuario = require('../models/usuario.model');

router.get('/', (req, res, next) => {
    console.log('usuarios route');
    Usuario.find({}, 'nombre email img role')
        .exec((err0, usuarios) => {
            if (err0) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios !',
                    errors: err0
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Get de usuarios !',
                    usuarios: usuarios
                });
            }
        });

});

module.exports = router;