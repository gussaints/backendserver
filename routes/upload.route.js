var express = require( 'express' );
var router = express.Router( );
var fileUpload = require( 'express-fileupload' );

// default options
router.use( fileUpload( ) );

router.patch( '/', ( req, res, next ) => {
    console.log( req.files );
    
    if ( req.files.imagen ) {
        // Obtener nombre del archivo
        var archivo = req.files.imagen;
        var nombreCortado = archivo.name.split( '.' );
        var extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];

        // Solo estas extensiones aceptamos
        var extensionesValidas = [ 'png', 'jpg', 'jpeg', 'gif' ];
        if ( extensionesValidas.indexOf( extensionArchivo ) < 0 ) {
            return res.status(400).json({
                ok: false,
                message: 'Extension no valida',
                errors: { message: 'Las extensiones validas son ' + extensionesValidas.join( ', ' ) }
            });
        } else {
            // Nombre de archivo personalizado
            return res.status(200).json({
                ok: true,
                message: 'All is good thaks to God!',
                extensionArchivo: extensionArchivo
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

module.exports = router;