const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({path: '.env'})

exports.autenticarUsuario = async (req, res, next) => {
    //Revisar si hay errores

    //Buscar usuario para ver si esta registrado
    const {email, password} = req.body;
    const usuario = await Usuario.findOne({email});
    console.log(usuario)
    if(!usuario){
        res.status(401).json({msg:'El usuario no existe'})
        return next();
    }

    //Verificar el password y autenticar usuario
    if(bcrypt.compareSync(password, usuario.password)){
        //Crear JWT
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
        }, process.env.SECRETA, {
            expiresIn: '8h'
        })

        // console.log(token)
        res.json({token})

    }else{
        res.status(401).json({msg:'El password no es correcto'})
        return next()
    }
}

exports.usuarioAutenticado = (req,res) => {

}
