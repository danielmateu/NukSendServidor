const Usuario = require("../models/Usuario");
const bcrypt = require('bcrypt');


exports.nuevoUsuario = async(req, res) => {
    //Verificar si el usuario ya está registrado
    const {email, password} = req.body

    let usuario = await Usuario.findOne({email})

    if(usuario){
        return res.status(400).json({msg: 'El usuario ya está registrado'})
    }

    //Crear nuevo Usuario

    usuario =  new Usuario(req.body);
    //Hashear Password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.save()

    try {
        
        res.json({msg: 'Usuario creado correctamente'})
    } catch (error) {
        console.log(error)
    }

}