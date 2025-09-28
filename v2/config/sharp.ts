import sharp from "sharp";

export const applyWatermark = async (imageBuffer) => {
    const baseImage = sharp(imageBuffer);
    const metadata = await baseImage.metadata(); // Obtém a largura/altura da imagem base

    // Ajusta dinamicamente a largura da marca d'água com base no tamanho da imagem
    const svgWatermark = `
        <svg width="${metadata.width}" height="${Math.round(metadata.height * 0.1)}">
            <text x="10" y="50" font-size="40" fill="black" text-anchor="start"
                style="font-family: Arial, sans-serif; font-weight: bold; opacity: 0.5;">
                ${process.env.STORE_NAME}
            </text>
        </svg>`;

    const watermarkBuffer = Buffer.from(svgWatermark);

    return baseImage
        .composite([{ input: watermarkBuffer, gravity: "southeast" }]) // Aplica a marca d'água no canto inferior direito
        .toBuffer();
};

export const convertFiles = async (files) => {
    return await Promise.all(
        files.map(async (file) => {
            const webpBuffer = await sharp(file.buffer).webp({ quality: 100 }).toBuffer(); // Converter só os necessários
            return { ...file, buffer: webpBuffer, mimetype: "image/webp" };
        })
    );
};
