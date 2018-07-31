// Requires
var express = require( 'express' );
var mongoose = require( 'mongoose' );
var bodyParser = require( 'body-parser' );
// Inicializar variables
var app = express( );
// BodyParser
app.use( bodyParser.urlencoded( { extended:false } ) );
app.use( bodyParser.json( ) );
// Conexion a la base de datos
mongoose.connect( "mongodb://localhost:27017/hospital", { useNewUrlParser: true }, (err, res) => {
    if ( err ) throw err;
    console.log( `Base de datos: \x1b[36m%s\x1b[0m`, `online` );
});

// importar rutas
var appRoutes = require( './routes/app.route' );
var usuarioRoutes = require( './routes/usuario.route' );
var loginRoutes = require( './routes/login.route' );
// Rutas
app.use( '/', appRoutes );
app.use( '/usuario', usuarioRoutes );
app.use( '/login', loginRoutes );
// Escuchar peticiones
var port = 3013;
app.listen( port, ( ) => {
    console.log( `Express server corriendo en puerto ${ port } \x1b[36m%s\x1b[0m`, `online` );
});