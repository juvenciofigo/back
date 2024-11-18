var admin = require("firebase-admin");
const BUCKET = process.env.STORAGE_BUCKET_fb;

// Configuração das credenciais do Firebase API
const serviceAccount = {
    type: process.env.TYPE_fb,
    project_id: process.env.PROJECT_ID_fb,
    private_key_id: process.env.PRIVATE_KEY_ID_fb,
    private_key: process.env.PRIVATE_KEY_fb.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL_fb,
    client_id: process.env.CLIENT_ID_fb,
    auth_uri: process.env.AUTH_URI_fb,
    token_uri: process.env.TOKEN_URI_fb,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL_fb,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL_fb,
    universe_domain: process.env.UNIVERSE_DOMAIN_fb,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: BUCKET,
});
const bucket = admin.storage().bucket();

// Função para fazer o upload de arquivos
const uploadFirebase = async (req, res, next) => {
    if (!req.files) return next();

    const files = req.files;

    try {
        const imageUrls = await Promise.all(
            files.map((file) => {
                return new Promise((resolve, reject) => {
                    const uniqueName = `${Date.now()}_${file.originalname}`; // Nome único do arquivo

                    const blob = bucket.file(uniqueName); // Cria uma referência para o arquivo no Firebase Storage

                    const blobStream = blob.createWriteStream({
                        metadata: {
                            contentType: file.mimetype,
                        },
                    });

                    blobStream.on("error", (error) => reject(error));

                    blobStream.on("finish", async () => {
                        // URL pública do arquivo
                        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
                        resolve(publicUrl);
                    });

                    blobStream.end(file.buffer); // Envia o buffer do arquivo para o Firebase Storage
                });
            })
        );

        req.files = imageUrls;
        next();
    } catch (error) {
        console.error("Erro ao fazer upload dos arquivos:", error.message);
        res.status(500).json({ message: "Erro ao fazer upload dos arquivos." });
    }
};

const deleteFilesFirebase = async (fileUrls) => {
    try {
        // Função para extrair o nome do arquivo do link

        const extractFileName = (url) => {
            const regex = /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^\/]+\/o\/([^?]+)\?alt=media/;
            const match = url.match(regex);
            if (match && match[1]) {
                return decodeURIComponent(match[1]); // Decodifica e retorna o nome do arquivo
            }
            throw new Error("URL inválida ou formato inesperado.");
        };

        // Excluindo os arquivos
        const deletePromises = fileUrls.map((url) => {
            const fileName = extractFileName(url); // Extrai o nome do arquivo
            const file = bucket.file(fileName); // Cria referência para o arquivo
            return file.delete(); // Retorna a promessa de exclusão
        });

        // Aguarda a exclusão de todos os arquivos
        await Promise.all(deletePromises);
        return;
    } catch (error) {
        console.error("Erro ao excluir os arquivos:", error.message);
    }
};

module.exports = { uploadFirebase, deleteFilesFirebase };
