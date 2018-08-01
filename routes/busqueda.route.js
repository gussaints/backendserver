var express = require( 'express' );
var router = express.Router( );
var Hospital = require( '../models/hospital.model' );
// ==================================================
// Buscar todo
// ==================================================
router.get( '/todo/:busqueda', ( req, res, next ) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i' );
    buscarHospitales( busqueda, regex )
        .then( hospitales => {
            return res.status( 200 ).json({
                ok: true,
                hospitales: hospitales
            });
        })
});

function buscarHospitales( busqueda, regex ) {
    return new Promise( ( resolve, reject ) => {
        Hospital
            .find({ nombre: regex }, ( err, hospitales ) => {
                if ( err ) {
                    reject( 'Error al cargar hospitales', err );
                } else {
                    resolve( hospitales );
                }
            })
    })
}

module.exports = router;