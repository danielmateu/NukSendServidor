//Subida de archivos            
const multer = require('multer');
const shortid = require('shortid');



    exports.subirArchivo = async (req, res, next) => {

        const configuracionMulter = {
            limits  : { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
            storage : fileStorage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, __dirname + '/../uploads')
                },
                filename: (req, file, cb) => {
                    const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                    cb(null, `${shortid.generate()}${extension}`)
                },
                // fileFilter: (req, file, cb) => {
                //     if(file.mimetype === 'application/pdf'){
                //         return cb(null, true);
                //     }
                // }
            })
        }
        const upload = multer(configuracionMulter).single('archivo')

        upload(req, res, async (error) => {

            console.log(req.file);
            if(!error){
                res.json({archivo: req.file.filename})
            }else{
                console.log(error);
                return next()
            }
        })
    }


exports.eliminarArchivos = async (req, res, next) => {

}