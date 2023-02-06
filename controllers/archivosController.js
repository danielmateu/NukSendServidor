//Subida de archivos            
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlace = require('../models/enlace');


    exports.subirArchivo = async (req, res, next) => {

        const configuracionMulter = {
            limits: { fileSize: req.usuario ? 10000000 : 1000000 },
            storage: fileStorage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, __dirname+'/../uploads')
                },
                filename: (req, file, cb) => {
                    const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                    cb(null, `${shortid.generate()}${extension}`);
                }
                // Para cuando queremos validar que no suban un formato en particular, en este caso pdf 
                // fileFilter: (req, file, cb) => {
                //     if(file.mimetype === "application/pdf") {
                //         return cb(null, true);
                //     }
                // }
            })
        };
        
        const upload = multer(configuracionMulter).single('archivo');
        
        upload(req, res, async (error) => {
            console.log(req.file);
            if(!error) {
                res.json({archivo: req.file.filename});
            } else {
                console.log(error.message);
                return next
            }
        });
    }


exports.eliminarArchivos = async function (req, res) {
    console.log(req.archivo);

    try {
        fs.unlinkSync(__dirname + `/..uploads/${req.archivo}`);
        console.log('Archivo Eliminado');
    } catch (error) {
        console.log(error);
    }
}

//Descarga un archivo
exports.descargar = async (req, res, next) => {

    //Obtener el enlace
    const {archivo} = req.params;
    const  enlace  = await Enlace.findOne({nombre: archivo})

    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);
    // console.log(req.params.archivo)

    //Eliminar archivo y entrada de la DB
    //Si las descargas === 1 hay que borrar la entrada y borrar el archivo
    const {descargas, nombre} = enlace;

    if(descargas === 1){
        // console.log('Si solo 1');
        //Eliminar el archivo
        req.archivo = nombre

        //Eliminar la entrada a la DB
        await Enlace.findOneAndRemove(enlace.id)
        next()

    }else {
        //Si las descargoas son > 1 - Restar 1
        enlace.descargas --;
        await enlace.save();
        // console.log('Aun hay descargas')
    }

}