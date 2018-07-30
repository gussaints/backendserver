var express = require('express');
var router = express.Router();
var bcrypt = require( 'bcryptjs' );
var Usuario = require('../models/usuario.model');

// ==================================================
// Obtener todos los usuarios
// ==================================================
router.get('/', (req, res, next) => {
    console.log('usuarios route');
    Usuario.find({}, 'nombre email img role')
        .exec((err0, usuarios) => {
            if ( err0 ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios !',
                    errors: err0
                });
            } else if ( usuarios.length > 0 ) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Get de usuarios !',
                    usuarios: usuarios
                });
            } else {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'Does not exist users !',
                    usuarios: usuarios
                });
            }
        });
});

// ==================================================
// Crear un nuevo usuario
// ==================================================
router.post( '/', ( req, res, next ) => {
    console.log();
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        img: body.img,
        role: body.role
    });

    usuario.save( ( errU, usuarioGuardado ) => {
        if ( errU ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: errU
            });
        } else {
            return res.status(201).json({
                ok: true,
                usuario: usuarioGuardado
            });
        }
    });
});

// ==================================================
// Actualizar usuario
// ==================================================
router.put( '/:id', ( req, res, next ) => {
    console.log();
    var id = req.params.id;
    var body = req.body;
    Usuario.findById( id, ( errUpd, usuario ) => {
        if ( errUpd ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: errUpd
            });
        } else if( !usuario ) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id ${id} no existe`,
                errors: { message: 'No existe un usuario con ese Id' }
            });
        } else {
            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;
            usuario.save( ( errSave, usuarioGuardado ) => {
                if ( errSave ) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: errSave
                    });
                } else {
                    usuarioGuardado.password = ':-)';
                    return res.status(200).json({
                        ok: true,
                        usuario: usuarioGuardado
                    });
                }
            });
        }
    })
});
// ==================================================
// Borrar un usuario por el id
// ==================================================
router.delete( '/:id', ( req, res, next ) => {
    console.log();
    var id = req.params.id;

    Usuario.findByIdAndRemove( id, ( errDel, usuarioBorrado ) => {
        if ( errDel ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: errDel
            });
        } else if ( !usuarioBorrado ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese Id',
                errors: { message: 'No existe un usuario con ese Id' }
            });
        } else {
            return res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            });
        }
    });
});

module.exports = router;