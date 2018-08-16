// Requires
var express = require( 'express' );
var mongoose = require( 'mongoose' );
var bodyParser = require( 'body-parser' );
// Inicializar variables
var app = express( );
// Cross Domain
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header( "Access-Control-Allow-Methods", "POST, GET, PATCH, PUT, DELETE, OPTIONS" )
//   next();
// });
// Make our db accessible to our router
app.use( (req,res,next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next( );
});
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
var imagenesRoutes = require( './routes/imagenes.route' );
// Server index config
// var serveIndex = require( 'serve-index' );
// app.use( express.static( __dirname + '/' ) );
// app.use( '/uploads', serveIndex( __dirname + '/uploads' ) );
// Rutas

app.use( '/usuario', usuarioRoutes );
app.use( '/login', loginRoutes );
app.use( '/hospital', hospitalRoutes );
app.use( '/medico', medicoRoutes );
app.use( '/busqueda', busquedaRoutes );
app.use( '/upload', uploadRoutes );
app.use( '/img', imagenesRoutes );
app.use( '/', appRoutes );

// Escuchar peticiones
var port = 3013;
app.listen( port, ( ) => {
    console.log( `Express server corriendo en puerto ${ port } \x1b[36m%s\x1b[0m`, `online` );
});