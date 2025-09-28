import multer from "multer";

const storage = multer.memoryStorage();
import { Request, Express } from "express";

const fileFilter = (_req: Request, file: Express.Multer.File, cb: any) => {
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

export default upload;
