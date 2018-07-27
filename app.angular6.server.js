// Requires
var express = require( 'express' );
var mongoose = require( 'mongoose' );
// Inicializar variables
var app = express( );
// Conexion a la base de datos
mongoose.connect("mongodb://localhost:27017/hospital", { useNewUrlParser: true }, ( err, res ) => {
    if ( err ) throw err;
    console.log( `Base de datos: \x1b[36m%s\x1b[0m`, `online` );
});

// Rutas
app.get( '/', ( req, res, next ) => {
    // Peticion correcta
    res.status( 200 ).json({ok:true,mensaje:'Peticion realizada correctamente'});
    // Not found
    // res.status( 404 );
});
// Escuchar peticiones
var port = 3013;
app.listen( port, () => {
    console.log( `Express server corriendo en puerto ${ port } \x1b[36m%s\x1b[0m`, `online` );
    
});