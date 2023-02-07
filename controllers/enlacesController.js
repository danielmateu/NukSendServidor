
const Enlaces = require('../models/Enlace')
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');


exports.nuevoEnlace = async (req, res, next) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    // console.log(req.body);

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
        return res.json({ msg: `${enlace.url}` })
        next()
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

//Retorna si el enlace tiene password o no
exports.tienePassword = async (req, res, next) => {

    // console.log(req.params.url);
    const { url } = req.params;
    console.log(url);

    // verificar si existe el enlace
    const enlace = await Enlaces.findOne({ url })

    if (!enlace) {
        res.status(404).json({ msg: 'Ese enlace no está disponible' })
        return next();
    }

    if (enlace.password) {
        return res.json({ password: true, enlace: enlace.url })
    }
    next()
}

//Verifica si el password es correcto
exports.verificarPassword = async (req, res, next) => {

    console.log('verificando...');

    const { url } = req.params;

    //Consultar por el enlace
    const enlace = await Enlaces.findOne({ url })

    //verificar el password
    const { password } = req.body;
    if (bcrypt.compareSync(password, enlace.password)) {
        // console.log('Correcto');
        //Permitir descargar el archivo
        next()

    } else {
        return res.status(401).json({ msg: 'Password Incorrecto' })
    }

}

// Obtener Enlace
exports.obtenerEnlace = async (req, res, next) => {

    const { url } = req.params;

    console.log(url);
    // const { password } = req.body;
    // verificar si existe el enlace
    const enlace = await Enlaces.findOne({ url })
    // console.log(enlace);

    if (!enlace) {
        res.status(404).json({ msg: 'Ese enlace no está disponible' })
        return next();
    }

    //Si el enlace existe 
    res.json({ archivo: enlace.nombre, password: false })

    next()

}