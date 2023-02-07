const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Crear Servidor
const app = express();

//Conectar a la base de datos
conectarDB()

// Habilitar Cors
// console.log(process.env.FRONTEND_URL);
const opcionesCors = {
    origin: process.env.FRONTEND_URL,
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(opcionesCors));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//Puerto de la app
const port = process.env.PORT || 4000;

//Habilitar leer los valores del body
app.use(express.json());

//Habilitar carpeta publica
app.use(express.static('uploads'));

//Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/enlaces', require('./routes/enlaces'))
app.use('/api/archivos', require('./routes/archivos'))

//Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor está corriendo en el puerto ${port}`)
})

