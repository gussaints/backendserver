var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario.model');
var jwt = require( 'jsonwebtoken' );
var SEED = require('../config/config').SEED;

// ==================================================
// Google Auth
// ==================================================
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require( 'google-auth-library' );
const client = new OAuth2Client( CLIENT_ID );
// ==================================================
// Google Auth
// ==================================================
async function verify( token ) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  return {
      nombre: payload.name,
      email: payload.email,
      img: payload.picture,
      google: true
  }
}
// ==================================================
// Autenticacion de Google
// ==================================================
router.post( '/google', async( req, res, next ) => {

    var token = req.body.token;

    var googleUser = await verify( token )
        .catch( e => {
            console.log( e );
            
            return res.status(403).json({
                ok: false,
                message: 'token no valido'
            });
        })
    
    Usuario.findOne( { email: googleUser.email }, ( err, usuarioDB ) => {
        console.log();
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        } else if ( usuarioDB ) {
            if ( usuarioDB.google === false ) {
                // usuario se registro normalmente
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su autenticacion normal'
                });
            } else {
                // Crear un token !
                // Usuario ya registrado mediante google
                usuarioDB.password = ':-)';
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas == 14400
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Login POST correcto',
                    token: token,
                    usuario: usuarioDB,
                    id: usuarioDB._id
                });
            }
        } else {
            // El usuario no existe, hay que crearlo
            var usuario = new Usuario( );
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':-)';

            usuario.save( ( err, usuarioDB ) => {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas == 14400
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Login POST correcto',
                    token: token,
                    usuario: usuarioDB,
                    id: usuarioDB._id
                });
            })
        }
    })
    
});
// ==================================================
// Autenticacion normal
// ==================================================
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
            var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 }); // 4 horas == 14400

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