var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario.model');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var mdAuthentication = require('../middlewares/authentication.middleware');
// ==================================================
// Obtener todos los usuarios
// ==================================================
router.get('/', (req, res, next) => {
    console.log('usuarios route');
    var desde = Number(req.query.desde || 0);
    Usuario
        .find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec((err0, usuarios) => {
            if (err0) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando usuarios !',
                    errors: err0
                });
            } else if (usuarios.length > 0) {
                Usuario.count({}, (err, conteo) => {
                    return res.status(200).json({
                        ok: true,
                        total: conteo,
                        message: 'Get de usuarios !',
                        usuarios: usuarios
                    });
                });
            } else {
                return res.status(404).json({
                    ok: false,
                    message: 'Does not exist users !',
                    usuarios: usuarios
                });
            }
        });
});


// ==================================================
// Actualizar usuario
// ==================================================
router.patch('/:id', mdAuthentication.verificaToken, (req, res, next) => {
    console.log(req.body);
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (errUpd, usuario) => {
        if (errUpd) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: errUpd
            });
        } else if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: `El usuario con el id ${id} no existe`,
                errors: { message: 'No existe un usuario con ese Id' }
            });
        } else {
            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role || usuario.role;
            usuario.save((errSave, usuarioGuardado) => {
                if (errSave) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error al actualizar usuario',
                        errors: errSave
                    });
                } else {
                    usuarioGuardado.password = ':-)';
                    return res.status(200).json({
                        ok: true,
                        usuario: usuarioGuardado,
                        usuarioToken: req.usuario
                    });
                }
            });
        }
    })
});

// ==================================================
// Crear un nuevo usuario
// ==================================================
router.post('/', (req, res, next) => {
    console.log();
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((errU, usuarioGuardado) => {
        if (errU) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: errU
            });
        } else {
            return res.status(201).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
            });
        }
    });
});


// ==================================================
// Borrar un usuario por el id
// ==================================================
router.delete('/:id', mdAuthentication.verificaToken, (req, res, next) => {
    console.log();
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (errDel, usuarioBorrado) => {
        if (errDel) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
                errors: errDel
            });
        } else if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                message: `No existe un hospital con el id ${id}`,
                errors: { message: `No existe un hospital con el id ${id}` }
            });
        } else {
            return res.status(200).json({
                ok: true,
                usuario: usuarioBorrado,
                usuarioToken: req.usuario
            });
        }
    });
});

module.exports = router;