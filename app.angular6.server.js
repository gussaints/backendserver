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
var hospitalRoutes = require( './routes/hospital.route' );
var medicoRoutes = require( './routes/medico.route' );
var busquedaRoutes = require( './routes/busqueda.route' );
var uploadRoutes = require( './routes/upload.route' );
// Rutas
app.use( '/', appRoutes );
app.use( '/usuario', usuarioRoutes );
app.use( '/login', loginRoutes );
app.use( '/hospital', hospitalRoutes );
app.use( '/medico', medicoRoutes );
app.use( '/busqueda', busquedaRoutes );
app.use( '/upload', uploadRoutes );
// Escuchar peticiones
var port = 3013;
app.listen( port, ( ) => {
    console.log( `Express server corriendo en puerto ${ port } \x1b[36m%s\x1b[0m`, `online` );
});