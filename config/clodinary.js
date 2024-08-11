const asyncHandler = require("express-async-handler");
const axios = require("axios");
const fs = require("fs");
const { google } = require("googleapis");

// Configuração das credenciais do Google API
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

// Função principal de upload múltiplo
const uploadMultiple = asyncHandler(async (req, res, next) => {
    console.log("Iniciando upload de múltiplos arquivos.");

    const files = req.files;
    const folderId = process.env.ID_FOLDER;
    let imageUrls = [];

    try {
        // Autenticação com o Google API
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ["https://www.googleapis.com/auth/drive.file"],
        });

        const driveService = google.drive({
            version: "v3",
            auth,
        });

        // Promises de upload para cada arquivo
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

        console.log("Iniciando upload dos arquivos para o Google Drive.");

        // Espera a conclusão de todos os uploads
        const responses = await Promise.all(uploadPromises);

        console.log("Uploads concluídos, obtendo URLs de visualização.");

        // Função auxiliar para extrair o viewer ID do código-fonte HTML
        const getViewerIdFromHTMLSourceCode = (sourceCode) => {
            if (!sourceCode) return null;
            const split = sourceCode.split("drive-viewer/");
            if (split.length < 2) return null;
            return split[1].split("\\")[0];
        };

        // Função para obter o ID do visualizador do Google Drive
        const getViewIdFromImageIdGoogleDrive = async (photo_id) => {
            try {
                const response = await axios.get(`https://drive.google.com/file/d/${photo_id}/view`);
                return getViewerIdFromHTMLSourceCode(response.data);
            } catch (err) {
                console.error(`Erro ao obter viewer ID para o arquivo ${photo_id}:`, err.message);
                return null;
            }
        };

        // Aguarda a conclusão de todas as Promises de visualização
        imageUrls = await Promise.all(
            responses.map(async (response) => {
                const viewId = await getViewIdFromImageIdGoogleDrive(response.data.id);
                return viewId ? `https://lh3.googleusercontent.com/drive-viewer/${viewId}` : null;
            })
        );

        console.log("URLs de visualização obtidas.");

        // Remove os arquivos temporários após o upload
        files.forEach((file) => {
            fs.unlinkSync(file.path);
        });

        req.files = imageUrls.filter(Boolean); // Filtra URLs nulas ou indefinidas

        console.log("Arquivos temporários removidos. Passando para o próximo middleware.");

        next();
    } catch (error) {
        console.error("Erro ao fazer upload dos arquivos:", error.message);
        res.status(500).json({ message: "Erro ao fazer upload dos arquivos." });
    }
});

module.exports = uploadMultiple;