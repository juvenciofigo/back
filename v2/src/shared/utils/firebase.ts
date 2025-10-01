import admin from "firebase-admin";
import { applyWatermark, convertFiles } from "./sharp.js";

const BUCKET = process.env.STORAGE_BUCKET_fb;

// Configuração das credenciais do Firebase API
const serviceAccount = {
    type: process.env.TYPE_fb,
    project_id: process.env.PROJECT_ID_fb,
    private_key_id: process.env.PRIVATE_KEY_ID_fb,
    private_key: process.env.PRIVATE_KEY_fb?.replace(/\\n/g, "\n"),
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

/**
 * Upload de arquivos para Firebase Storage
 */
export const uploadFirebase = async (files: Express.Multer.File[]): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    // Separar arquivos WebP e outros para conversão
    const filesWebp = files.filter((f) => f.mimetype.toLowerCase() === "image/webp");
    const filesToConvert = files.filter((f) => f.mimetype.toLowerCase() !== "image/webp");

    let convertedFiles: Express.Multer.File[] = [];
    if (filesToConvert.length > 0) {
        convertedFiles = await convertFiles(filesToConvert);
    }

    const filesWithWatermark = [...filesWebp, ...convertedFiles];

    const finalFiles: Express.Multer.File[] = await Promise.all(
        filesWithWatermark.map(async (file) => {
            const webpBuffer = await applyWatermark(file.buffer);
            return { ...file, buffer: webpBuffer, mimetype: "image/webp" };
        })
    );

    try {
        const imageUrls = await Promise.all(
            finalFiles.map(
                (file) =>
                    new Promise<string>((resolve, reject) => {
                        const uniqueName = `${Date.now()}_${file.originalname}.webp`;
                        const blob = bucket.file(uniqueName);

                        const blobStream = blob.createWriteStream({
                            metadata: { contentType: file.mimetype },
                        });

                        blobStream.on("error", (err) => reject(err));

                        blobStream.on("finish", () => {
                            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
                            resolve(publicUrl);
                        });

                        blobStream.end(file.buffer);
                    })
            )
        );

        return imageUrls;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Erro ao fazer upload dos arquivos:", error.message);
            throw new Error("Erro ao fazer upload dos arquivos");
        } else {
            console.error("Erro desconhecido ao fazer upload dos arquivos:", error);
            throw new Error("Erro desconhecido ao fazer upload dos arquivos");
        }
    }
};

/**
 * Exclusão de arquivos do Firebase Storage
 */
export const deleteFilesFirebase = async (fileUrls: string[]): Promise<void> => {
    if (!fileUrls || fileUrls.length === 0) return;

    const extractFileName = (url: string): string => {
        const regex = /https:\/\/firebasestorage.googleapis.com\/v0\/b\/[^/]+\/o\/([^?]+)\?alt=media/;
        const match = url.match(regex);
        if (match && match[1]) return decodeURIComponent(match[1]);
        throw new Error("URL inválida ou formato inesperado.");
    };

    try {
        const deletePromises = fileUrls.map((url) => {
            const fileName = extractFileName(url);
            return bucket.file(fileName).delete();
        });

        await Promise.all(deletePromises);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Erro ao excluir os arquivos:", error.message);
        } else {
            console.error("Erro desconhecido ao excluir os arquivos:", error);
        }
    }
};
