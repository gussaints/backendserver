var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var fs = require('fs');
var Usuario = require('../models/usuario.model');
var Hospital = require('../models/hospital.model');
var Medico = require('../models/medico.model');

// default options
router.use(fileUpload());

router.patch('/:tipo/:id', (req, res, next) => {
    console.log(req.files);

    var tipo = req.params.tipo;
    var id = req.params.id;
    // tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Coleccion no valida',
            errors: { message: 'Las Colecciones validas son ' + tiposValidos.join(', ') }
        });
    } else if (req.files.imagen) {
        // Obtener nombre del archivo
        var archivo = req.files.imagen;
        var nombreCortado = archivo.name.split('.');
        var extensionArchivo = nombreCortado[nombreCortado.length - 1];

        // Solo estas extensiones aceptamos
        var extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
        if (extensionesValidas.indexOf(extensionArchivo) < 0) {
            return res.status(400).json({
                ok: false,
                message: 'Extension no valida',
                errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
            });
        } else {
            // Nombre de archivo personalizado
            var nombreArchivo = `${ id }-${ new Date(  ).getMilliseconds(  ) }.${ extensionArchivo }`;
            // Mover el archivo del temporal al path
            var path = `./uploads/${ tipo }/${ nombreArchivo }`;

            archivo.mv(path, errMoving => {
                if (errMoving) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al mover archivo',
                        errors: errMoving
                    });
                } else {
                    subirPorTipo(tipo, id, nombreArchivo, res);
                }
            });

        }

    } else {
        return res.status(400).json({
            ok: false,
            message: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }
    // console.log();

});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo == 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    message: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            // Si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        console.log("failed to delete local image:" + err);
                    } else {
                        console.log('successfully deleted local image');
                    }
                });
            }
            usuario.img = nombreArchivo;
            usuario.save((errSavingImg, usuarioActualizado) => {
                usuarioActualizado.password = ':-)';
                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de usuario actualizada !',
                    usuario: usuarioActualizado
                });
            })
        });
    }
    if (tipo == 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }
            var pathViejo = './uploads/hospitales/' + hospital.img;
            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        console.log("failed to delete local image:" + err);
                    } else {
                        console.log('successfully deleted local image');
                    }
                });
            }
            hospital.img = nombreArchivo;
            hospital.save((errSavingImg, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de hospital actualizada !',
                    hospital: hospitalActualizado
                });
            })
        });
    }
    if (tipo == 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    message: 'medico no existe',
                    errors: { message: 'medico no existe' }
                });
            }
            var pathViejo = './uploads/medicos/' + medico.img;
            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        console.log("failed to delete local image:" + err);
                    } else {
                        console.log('successfully deleted local image');
                    }
                });
            }
            medico.img = nombreArchivo;
            medico.save((errSavingImg, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de medico actualizada !',
                    medico: medicoActualizado
                });
            })
        });
    }
}

module.exports = router;