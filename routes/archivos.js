const express = require('express');
const router = express.Router();
const archivosController = require('../controllers/archivosController')
// const { check } = require('express-validator')
const auth = require('../middleware/auth');


router.post('/',
    auth,
    archivosController.subirArchivo
)

// router.delete('/:id',
//     archivosController.eliminarArchivos
// )

module.exports = router

