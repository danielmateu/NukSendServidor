
const Enlaces = require('../models/enlace')
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');


exports.nuevoEnlace = async (req, res, next) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    console.log(req.body);

    //Crear un objeto de enlace
    const { nombre_original, nombre } = req.body

    const enlace = new Enlaces();
    enlace.url = shortid.generate()
    enlace.nombre = nombre
    enlace.nombre_original = nombre_original

    // Si el usuario está autenticado
    // console.log(req.usuario);
    if (req.usuario) {
        const { password, descargas } = req.body
        // /asignar a enlace el número de descargas

        if (descargas) {
            enlace.descargas = descargas
        }

        //asignar un psswd
        if (password) {
            const salt = await bcrypt.genSalt(10)
            enlace.password = await bcrypt.hash(password, salt)
        }

        //asignar el autor
        enlace.author = req.usuario.id
    }

    //Almacenar en la DB
    try {
        await enlace.save()
        res.json({ msg: `${enlace.url}` })
        return next()
    } catch (error) {
        console.log(error);
    }
}

//Obtiene un listado de todos los enlaces
exports.todosEnlaces = async (req, res) => {
    try {
        const enlaces = await Enlaces.find({}).select('url -_id');
        res.json({ enlaces })
    } catch (error) {
        console.log(error)
    }
}

// Obtener Enlace
exports.obtenerEnlace = async (req, res, next) => {

    const {url} = req.params;
    // verificar si existe el enlace
    const enlace = await Enlaces.findOne( {url} )
    // console.log(enlace);

    if(!enlace){
        res.status(404).json({msg: 'Ese enlace no está disponible'})
        return next();
    }

    //Si el enlace existe 
    res.json({archivo: enlace.nombre})

    return;

    //Si las descargas === 1 hay que borrar la entrada y borrar el archivo
    const {descargas, nombre} = enlace;
    if(descargas === 1){
        // console.log('Si solo 1');
        //Eliminar el archivo
        req.archivo = nombre

        //Eliminar la entrada a la DB
        await Enlaces.findOneAndRemove(req.params.url)
        next()

    }else {
        //Si las descargoas son > 1 - Restar 1
        enlace.descargas --;
        await enlace.save();
        // console.log('Aun hay descargas')
    }

}