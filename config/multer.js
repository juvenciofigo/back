const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, __dirname + "/../public/images"),
    filename: (req, file, callback) => calback(null, file.fieldname + "-" + Date.now() + ".jpg"),
});

const upload = multer({ storage });

module.exports = upload
