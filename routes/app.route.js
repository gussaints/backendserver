var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    // Peticion correcta
    res.status(200).json({ ok: true, mensaje: 'Peticion realizada correctamente' });
    // Not found
    // res.status( 404 );
});

module.exports = router;