const Enlaces = require('../models/enlace')
const shortid = require('shortid');
const bcrypt = require('bcrypt');
exports.nuevoEnlace = async(req, res, next) => {
    //Revisar si hay errores

    //Crear un objeto de enlace
    const {nombre_original} = req.body
    
    const enlace = new Enlaces();
    enlace.url = shortid.generate()
    enlace.nombre = shortid.generate()
    enlace.nombre_original = nombre_original
    
    // Si el usuario está autenticado
    // console.log(req.usuario);
    if(req.usuario) {
        const {password, descargas} = req.body
        // /asignar a enlace el número de descargas
        
        if(descargas){
            enlace.descargas = descargas
        }

        //asignar un psswd
        if(password){
            const salt = await bcrypt.genSalt(10)
            enlace.password = await bcrypt.hash(password, salt)
        }

        //asignar el autor
        enlace.author = req.usuario.id
    }

    //Almacenar en la DB
    try {
        await enlace.save()
        res.json({msg: `${enlace.url}`})
        return next()
    } catch (error) {
        console.log(error);
    }
}