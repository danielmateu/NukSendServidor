const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enlacesSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    nombre:{
        type: String,
        required: true
    },
    nombre_original: {
        type: String,
        required: true
    },
    descargas: {
        type: Number,
        default: 1
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
        default: null
    },
    password: {
        type: String,
        default: null
    },
    creado: {
        type: String,
        default: Date.now()
    }
})  

module.exports = mongoose.model('Enlaces', enlacesSchema)