var express = require( 'express' );
var router = express.Router( );
var Hospital = require( '../models/hospital.model' );
var SEED = require( '../config/config' ).SEED;
var mdAuthentication = require( '../middlewares/authentication.middleware' );
// ==================================================
// Obtener hospitales
// ==================================================
router.get( '/', ( req, res, next ) => {
    var desde = Number( req.query.desde || 0 );
    Hospital
        .find({ })
        .skip( desde )
        .limit(5)
        .populate( 'usuario', 'nombre role email' )
        .exec( ( errH, hospitales ) => {
            if ( errH ) {
                return res.status( 500 ).json({
                    ok: false,
                    message: 'Error al buscar hospitales',
                    errors: errH
                });
            } else if ( hospitales.length > 0 ) {
                Hospital.count({}, ( err, conteo ) =>{
                    return res.status(200).json({
                        ok: true,
                        total: conteo,
                        hospitales: hospitales
                    });
                });
            } else {
                return res.status( 400 ).json({
                    ok: false,
                    message: 'No hay hospitales guardados',
                    hospitales: hospitales
                });
            }
        });
});
// ==================================================
// Obtener Hospital por Id
// ==================================================
router.get( '/:id', ( req, res, next ) => {
    var id = req.params.id;

    Hospital.findById( id )
        .populate( 'usuario', 'nombre img email' )
        .exec( ( err, hospital ) => {
            if ( err ) {
                return res.status( 500 ).json({
                    ok: false,
                    message: 'Error al buscar hospital',
                    errors: err
                });
            }
            if ( !hospital ) {
                return res.status( 400 ).json({
                    ok: false,
                    message: 'El hospital con el id ' + id + ' no existe',
                    errors: { message: 'No existe un hospital con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        });
})
// ==================================================
// Guardar hospitales
// ==================================================
router.post( '/', mdAuthentication.verificaToken, ( req, res, next ) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        // img: body.img,
        usuario: req.usuario._id
    });

    hospital.save( ( errSave, hospitalGuardado )  => {
        if ( errSave ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error al guardar hospital',
                errors: errSave
            });
        } else {
            return res.status(201).json({
                ok: true,
                hospital: hospitalGuardado
            });
        }
    });
});
// ==================================================
// Actualizar hospital por id
// ==================================================
router.put( '/:id', mdAuthentication.verificaToken, ( req, res, next ) => {
    var id = req.params.id;
    var body = req.body;
    Hospital
        .findById( id, ( errUpd, hospital ) => {
            if ( errUpd ) {
                return res.status( 500 ).json({
                    ok: false,
                    message: 'Error al buscar hospital',
                    errors: errUpd
                });
            } else if ( !hospital ) {
                return res.status( 400 ).json({
                    ok: false,
                    message: `El hospital con id ${id} no existe`,
                    hospital: hospital
                });
            } else {
                hospital.nombre = body.nombre;
                hospital.usuario = req.usuario._id;
                hospital.save( ( errSave, hospitalGuardado ) => {
                    if ( errSave ) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error al actualizar hospital',
                            errors: errSave
                        });
                    } else {
                        return res.status(200).json({
                            ok: true,
                            hospital: hospitalGuardado
                        });
                    }
                });
            }
        });
});
// ==================================================
// Borrar hospital por id
// ==================================================
router.delete( '/:id', mdAuthentication.verificaToken, ( req, res, next ) => {
    var id = req.params.id;
    Hospital
        .findByIdAndDelete( id, ( errDelete, hospitalBorrado ) => {
            if ( errDelete ) {
                return res.status( 500 ).json({
                    ok: false,
                    message: 'Error al borrar hospital',
                    errors: errDelete
                });
            } else if ( !hospitalBorrado ) {
                return res.status(400).json({
                    ok: false,
                    message: `No existe un hospital con el id ${id}`,
                    errors: { message: `No existe un hospital con el id ${id}` },
                    hospital: hospitalBorrado
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    hospital: hospitalBorrado
                });
            }
        });
});

module.exports = router;