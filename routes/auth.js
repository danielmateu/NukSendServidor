const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const { check } = require('express-validator')

router.post('/',
    [
        check('email', 'agrega un email válido...').isEmail(),
        check('password', 'El password debes introducirlo').not().isEmpty(),
    ],
    authController.autenticarUsuario
)

router.get('/',
    authController.usuarioAutenticado
)

module.exports = router;