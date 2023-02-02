const express = require('express');
const conectarDB = require('./config/db');


//Crear Servidor
const app = express();



//Conectar a la base de datos
conectarDB()

//Puerto de la app
const port = process.env.PORT || 4000;

//Habilitar leer los valores del body
app.use(express.json());

//Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))

//Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor está corriendo en el puerto ${port}`)
})

