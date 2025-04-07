const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Tipo de arquivo não suportado"), false);
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5 MB
    },
});

module.exports = upload;
