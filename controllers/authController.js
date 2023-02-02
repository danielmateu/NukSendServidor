const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
require('dotenv').config({ path: '.env' })

exports.autenticarUsuario = async (req, res, next) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //Buscar usuario para ver si esta registrado
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    console.log(usuario)
    if (!usuario) {
        res.status(401).json({ msg: 'El usuario no existe' })
        return next();
    }

    //Verificar el password y autenticar usuario
    if (bcrypt.compareSync(password, usuario.password)) {
        //Crear JWT
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
        }, process.env.SECRETA, {
            expiresIn: '8h'
        })

        // console.log(token)
        res.json({ token })

    } else {
        res.status(401).json({ msg: 'El password no es correcto' })
        return next()
    }
}

exports.usuarioAutenticado = (req, res, next) => {
    // console.log(req.get('Authorization'))
    const authHeader = req.get('Authorization')

    if(authHeader){
        //Obtener el Token
        const token = authHeader.split(' ')[1]
        //Comprobar el JWT
        try {
            const usuario = jwt.verify(token, process.env.SECRETA )
            res.json({usuario})
            
        } catch (error) {
            console.log(error)
            console.log('JWT no válido')
        }
        
    }

    // console.log('No hay header')

    return next()
}
