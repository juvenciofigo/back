const { Products } = require("../models/Products/Products"),
    Variations = require("../models/Variations"),
    { deleteFilesFirebase } = require("../config/firebase");
const { uploadFirebase } = require("../config/firebase");

class VariationController {
    // Show all
    async getAllVariations(req, res, next) {
        const { product } = req.query;

        try {
            if (!product) {
                return res.status(400).json({ success: false, message: "Produto Inválido" });
            }

            const _product = await Products.findById(product).sort({ variationType: -1 });

            if (!_product) {
                return res.status(400).json({ success: false, message: "O produto não foi encontrado." });
            }

            const variations = await Variations.find({ variationProduct: product });

            if (!variations || variations.length === 0) {
                return res.status(200).json({ success: true, message: "Sem variações encontradas para o produto especificado." });
            }

            return res.status(200).json({ success: true, message: "Variações encontradas com sucesso.", variations });
        } catch (error) {
            next(error);
        }
    }

    // Variações do porduto
    async getVariation(req, res, next) {
        // Extrai os parâmetros 'product' e 'id' da consulta
        const { product } = req.query;
        const { id } = req.params;

        try {
            // Consulta o banco de dados para encontrar a variação com o ID e relacionada ao produto
            const variation = await Variations.findOne({ _id: id, variationProduct: product });

            // Verifica se a variação foi encontrada
            if (!variation) {
                // Responde com um erro 404 se a variação não for encontrada
                return res.status(404).json({ success: false, message: "Sem variações encontradas para o produto e ID especificados." });
            }

            // Responde com a variação encontrada
            return res.status(200).json({ variation });
        } catch (error) {
            // Trata erros, repassando para o middleware de erro
            next(error);
        }
    }

    // Save Variations
    async createVariation(req, res, next) {
        const { variationType, variationValue, sku, variationPrice, variationPromotion, variationStock, heightCm, widthCm, depthCm, weight, shippingFree } = req.body;
        const { product } = req.params;

        try {
            const isSku = await Variations.findOne({ sku });

            if (isSku) {
                return res.status(400).json({ message: "SKU já em uso", success: false });
            }

            const _product = await Products.findById(product);

            if (!_product) {
                return res.status(400).json({ message: "Produto não existente", success: false });
            }

            // Cria uma nova instância da variação
            const variation = new Variations({
                variationProduct: product,
                variationType,
                variationValue,
                sku,
                variationPrice,
                variationPromotion,
                variationStock,
                delivery: {
                    dimensions: {
                        heightCm,
                        widthCm,
                        depthCm,
                    },
                    weight,
                    shippingFree,
                },
            });

            if (Array.isArray(req.files) && req.files.length > 0) {
                await uploadFirebase(req);
                variation.variationImage = req.files;
            }

            await variation.save();
            _product.productVariations.push(variation._id);
            await _product.save();

            const variations = await Variations.find({ variationProduct: product });

            return res.status(200).json({ variation, variations, success: true, message: "Variação Criada!" });
        } catch (error) {
            next(error);
        }
    }

    // Update Variation
    async updateVariation(req, res, next) {
        var { variationType, variationValue, sku, variationPrice, variationPromotion, variationStock, variationImage, heightCm, widthCm, depthCm, weight, shippingFree } = req.body;

        try {
            const variation = await Variations.findById(req.params.id);

            if (!variation) {
                return res.status(400).json({ message: "Variação não existente", success: false });
            }

            if (variationImage === undefined) {
                variationImage = [];
            }

            const removedImages = variation.variationImage.filter((image) => !variationImage.includes(image));

            if (removedImages.length > 0) {
                await deleteFilesFirebase(removedImages);
                variation.variationImage = variationImage;
            }

            if (sku) variation.sku = sku;
            if (variationType) variation.variationType = variationType;
            if (variationValue) variation.variationValue = variationValue;
            if (variationPrice) variation.variationPrice = variationPrice;
            if (variationPromotion) variation.variationPromotion = variationPromotion;
            if (variationStock) variation.variationStock = variationStock;
            if (heightCm) variation.delivery.dimensions.heightCm = heightCm;
            if (widthCm) variation.delivery.dimensions.widthCm = widthCm;
            if (depthCm) variation.delivery.dimensions.depthCm = depthCm;
            if (weight) variation.delivery.weight = weight;
            if (shippingFree !== undefined) variation.delivery.shippingFree = shippingFree;

            if (Array.isArray(req.files) && req.files && req.files.length > 0) {
                await uploadFirebase(req);
                variation.variationImage.push(...req.files);
            }

            await variation.save();

            const variations = await Variations.find({ variationProduct: variation.variationProduct });

            return res.status(200).json({ variation, variations, success: true, message: "Variação atualizada com sucesso!" });
        } catch (error) {
            next(error);
        }
    }

    async imageVariation(req, res, next) {
        try {
            const variation = await Variations.findById(req.params.id);

            if (!variation) {
                return res.status(400).json({ message: "Variação não existente", success: false });
            }

            const newImages = req.files.map((item) => item.filename);

            // Filtra itens nulos e concatena as novas imagens
            variation.variationImage = variation.variationImage.filter((item) => item).concat(newImages);

            await variation.save();

            const variations = await Variations.find({ variationProduct: variation.variationProduct });

            return res.status(200).json({ success: true, variation, variations });
        } catch (error) {
            // Trata erros, repassando para o middleware de erro
            next(error);
        }
    }

    // Delete Variations
    async deleteVariation(req, res, next) {
        try {
            const variation = await Variations.findById(req.params.id);

            if (!variation) {
                return res.status(400).json({ success: false, message: "Variação não encontrada" });
            }

            const product = await Products.findById(variation.variationProduct);

            if (product) {
                product.productVariations = product.productVariations.filter((item) => item.toString() !== req.params.id.toString());
                await product.save();
            }

            await variation.deleteOne();

            const variations = await Variations.find({ variationProduct: variation.variationProduct });

            return res.status(200).json({ success: true, message: "Variação apagada!", variations });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new VariationController();
