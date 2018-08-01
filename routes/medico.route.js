var express = require( 'express' );
var router = express.Router( );
var Medico = require( '../models/medico.model' );
var SEED = require( '../config/config' ).SEED;
var mdAuthentication = require( '../middlewares/authentication.middleware' );
// ==================================================
// Obtener medicos
// ==================================================
router.get( '/', ( req, res, next ) => {
    var desde = Number( req.query.desde || 0 );
    Medico
        .find({ })
        .skip( desde )
        .limit(5)
        .populate( 'usuario', 'nombre email role' )
        .populate( 'hospital' )
        .exec( ( errDoctor, medicos ) => {
            if ( errDoctor ) {
                return res.status( 500 ).json({
                    ok: false,
                    message: 'Error al buscar los medicos',
                    errors: errDoctor
                });
            } else if ( medicos.length > 0 ) {
                Medico.count({}, ( err, conteo ) =>{
                    return res.status(200).json({
                        ok: true,
                        total: conteo,
                        medicos: medicos
                    });
                });
            } else {
                return res.status( 400 ).json({
                    ok: false,
                    message: 'No hay medicos guardados',
                    medicos: medicos
                })
            }
        });
});
// ==================================================
// Actualizar medico por id
// ==================================================
router.put( '/:id', mdAuthentication.verificaToken, ( req, res, next ) => {
    console.log();
    var id = req.params.id;
    var body = req.body;
    Medico
        .findById( id, ( errUpd, medico ) => {
            if ( errUpd ) {
                return res.status( 500 ).json({
                    ok: false,
                    message: 'Error al buscar medico',
                    errors: errUpd
                });
            } else if ( !medico ) {
                return res.status( 400 ).json({
                    ok: false,
                    message: `El medico con id ${id} no existe`,
                    medico: medico
                })
            } else {
                medico.nombre = body.nombre;
                medico.usuario = req.usuario._id;
                medico.hospital = body.hospital;
                medico.save( ( errSave, medicoGuardado ) => {
                    if ( errSave ) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error al actualizar medico',
                            errors: errSave
                        });
                    } else {
                        return res.status(200).json({
                            ok: true,
                            medico: medicoGuardado
                        });
                    }
                })
            }
        });
});
// ==================================================
// Guardar medico
// ==================================================
router.post( '/', mdAuthentication.verificaToken, ( req, res, next ) => {
    console.log();
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save( ( errSave, medicoGuardado ) => {
        if ( errSave ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error al guardar medico',
                errors: errSave
            });
        } else {
            return res.status( 201 ).json({
                ok: true,
                medico: medicoGuardado
            });
        }
    })
});
// ==================================================
// Borrar medico por id
// ==================================================
router.delete( '/:id', mdAuthentication.verificaToken, ( req, res, next ) => {
    console.log();
    var id = req.params.id;
    Medico
        .findByIdAndDelete( id, ( errDelete, medicoBorrado ) => {
            if ( errDelete ) {
                return res.status( 500 ).json({
                    ok: false,
                    message: 'Error al borrar medico',
                    errors: errDelete
                });
            } else if ( !medicoBorrado ) {
                return res.status(400).json({
                    ok: false,
                    message: `No existe un medico con el id ${id}`,
                    errors: { message: `No existe un medico con el id ${id}` },
                    medico: medicoBorrado
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    medico: medicoBorrado
                });
            }
        });
});

module.exports = router;