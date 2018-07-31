var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario.model');
var jwt = require( 'jsonwebtoken' );
var SEED = require('../config/config').SEED;

router.post( '/', ( req, res, next ) => {
    var body = req.body;

    Usuario.findOne({ email:body.email }, ( err, usuario ) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        } else if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email'
            });
        } else if ( !bcrypt.compareSync( body.password, usuario.password ) ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password'
            });
        } else {
            // Crear un token !
            usuario.password = ':-)';
            var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 60 }); // 4 horas == 14400

            return res.status(200).json({
                ok: true,
                mensaje: 'Login POST correcto',
                token: token,
                usuario: usuario,
                id: usuario._id
            });
        }
    });

    
});

module.exports = router;