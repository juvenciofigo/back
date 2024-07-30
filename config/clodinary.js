// const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const axios = require("axios");

const fs = require("fs");
const { google } = require("googleapis");
const credentials = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
};
const { body } = require("express-validator");

const uploadMultiple = asyncHandler(async (req, res, next) => {
    const files = req.files;
    const folderId = process.env.ID_FOLDER;
    const imageUrls = [];

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ["https://www.googleapis.com/auth/drive.file"],
        });

        const driveService = google.drive({
            version: "v3",
            auth,
        });

        const uploadPromises = files.map((file) => {
            const fileMetadata = {
                name: file.originalname,
                parents: [folderId],
            };

            const media = {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path),
            };

            return driveService.files.create({
                resource: fileMetadata,
                media: media,
                fields: "id",
            });
        });

        const responses = await Promise.all(uploadPromises);

        const getViewerIdFromHTMLSourceCode = (sourceCode) => {
            if (!sourceCode) return null;
            const splited = sourceCode.split("drive-viewer/");
            if (splited.length < 2) return null;
            const viewerId = splited[1].split("\\")[0];
            return viewerId;
        };

        // Função para obter o ID do visualizador do Google Drive
        const getViewIdFromImageIdGoogleDrive = async (photo_id) => {
            try {
                const response = await axios.get(`https://drive.google.com/file/d/${photo_id}/view`);
                const viewid = getViewerIdFromHTMLSourceCode(response.data);
                return viewid;
            } catch (err) {
                return null;
            }
        };

        // Aguarda a conclusão de todas as Promises de visualização
        const imageUrls = await Promise.all(
            responses.map(async (response) => {
                const viewId = await getViewIdFromImageIdGoogleDrive(response.data.id);
                return viewId ? `https://lh3.googleusercontent.com/drive-viewer/${viewId}` : null;
            })
        );

        // Remove os arquivos temporários após o upload
        files.forEach((file) => {
            fs.unlinkSync(file.path);
        });
        req.files = imageUrls;

        next();
    } catch (error) {
        console.error("Erro ao fazer upload dos arquivos:", error);
        res.status(500).send("Erro ao fazer upload dos arquivos.");
    }
});

module.exports = uploadMultiple;

// cloudinary.config({
//     cloud_name: "dlm5nmxsv",
//     api_key: process.env.CLODINARY_API_KEY,
//     api_secret: process.env.CLODINARY_SECRET,
// });

// const uploadMultiple = asyncHandler(async (req, res, next) => {
//     try {
//         const images = req.files;

//         console.log(images);
//         const imageUrls = [];
//         for (const image of images) {
//             const result = await cloudinary.uploader.upload(image.path, {
//                 resource_type: "auto",
//             });
//             imageUrls.push(result.secure_url);
//         }
//         req.images = imageUrls;
//         console.log(req.images);

//         return
//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("erro interno");
//         return;
//     }
// });

// module.exports = uploadMultiple;

//     // Upload an image
//     const uploadResult = await cloudinary.uploader
//         .upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg", {
//             public_id: "shoes",
//         })
//         .catch((error) => {
//             console.log(error);
//         });

//     console.log(uploadResult);

//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url("shoes", {
//         fetch_format: "auto",
//         quality: "auto",
//     });

//     console.log(optimizeUrl);

//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url("shoes", {
//         crop: "auto",
//         gravity: "auto",
//         width: 500,
//         height: 500,
//     });

//     console.log(autoCropUrl);
// })();
