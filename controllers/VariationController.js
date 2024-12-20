const Products = require("../models/Products"),
    Variations = require("../models/Variations"),
    { deleteFilesFirebase } = require("../config/firebase");

class VariationController {
    // Show all
    async getAllVariations(req, res, next) {
        // Extrai o parâmetro 'product' da consulta
        const { product } = req.query;

        try {
            // Verifica se o parâmetro 'product' está presente
            const _product = await Products.findById(product).sort({ variationType: -1 });

            if (!_product) {
                // Responde com um erro 400 se 'product' não estiver presente
                return res.status(400).json({ success: false, message: "O produto não foi encontrado." });
            }

            // Consulta o banco de dados para obter as variações do produto
            const variations = await Variations.find({ variationProduct: product });

            // Verifica se foram encontradas variações para o produto
            if (!variations || variations.length === 0) {
                // Responde com um erro 404 se não houver variações encontradas
                return res.status(200).json({ success: true, message: "Sem variações encontradas para o produto especificado." });
            }

            // Responde com as variações encontradas
            return res.status(200).json({ success: true, message: "Variações encontradas com sucesso.", variations });
        } catch (error) {
            // Trata erros, repassando para o middleware de erro
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
            // Verifica se o produto existe
            const _product = await Products.findById(product);

            // Se o produto não existir, retorna um erro 400
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
                variationImage: req.files,
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

            // Adiciona a nova variação ao array de variações do produto
            await _product.productVariations.push(variation._id);

            // Salva o produto com a nova variação
            await _product.save();

            // Salva a nova variação no banco de dados
            await variation.save();

            // Responde com sucesso e a nova variação criada
            return res.status(200).json({ variation, success: true, message: "Variação Criada!" });
        } catch (error) {
            // Trata erros, repassando para o middleware de erro
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

            // Se variationImage for undefined, inicializa como array vazio
            if (variationImage === undefined) {
                variationImage = [];
            }

            // Filtra as imagens removidas
            const removedImages = variation.variationImage.filter((image) => !variationImage.includes(image));

            // Atualização das imagens
            if (removedImages.length > 0) {
                await deleteFilesFirebase(removedImages);
                variation.variationImage = variationImage;
            }

            // Adiciona novas imagens enviadas
            if (Array.isArray(req.files) && req.files && req.files.length > 0) {
                variation.variationImage.push(...req.files);
            }

            // Atualiza as propriedades da variação com os valores fornecidos
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

            // Salva a variação atualizada no banco de dados
            await variation.save();

            // Retorna uma resposta de sucesso com a variação atualizada
            return res.status(200).json({ variation, success: true, message: "Variação atualizada com sucesso!" });
        } catch (error) {
            // Trata erros, repassando para o middleware de erro
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

            // Retorna uma resposta de sucesso com a variação atualizada
            return res.status(200).json({ success: true, variation });
        } catch (error) {
            // Trata erros, repassando para o middleware de erro
            next(error);
        }
    }

    // Delete Variations
    async deleteVariation(req, res, next) {
        const { product } = req.query;
        try {
            // Busca o comentário pelo ID nos parâmetros da requisição
            const variation = await Variations.findById(req.params.id);

            // Se o comentário não existe, retorna um erro
            if (!variation) {
                return res.status(400).json({ success: false, message: "Variação não encontrada" });
            }

            // Busca o produto relacionado ao comentário
            const product = await Products.findById(variation.variationProduct);

            // Se o produto existe, remove o ID do comentário da lista de avaliações do produto
            if (product) {
                product.productVariations = product.productVariations.filter((item) => item.toString() !== req.params.id.toString());
                await product.save();
            }

            // Deleta o comentário
            await variation.deleteOne();

            return res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new VariationController();
