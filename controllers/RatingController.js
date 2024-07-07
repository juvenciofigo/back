const Products = require("../models/Products"),
    Customers = require("../models/Customers"),
    Ratings = require("../models/Ratings"),
    Orders = require("../models/Orders");

// const getSort = (sortType) => {
//     switch (sortType) {
//         case "alphabet_a-z":
//             return { productName: 1 };
//         case "alphabet_z-a":
//             return { productName: -1 };
//         case "price-ascending":
//             return { productPrice: 1 };
//         case "price-descending":
//             return { productPrice: -1 };
//         default:
//             return {};
//     }
// };

class RatingController {
    // Show all
    async getAllRatings(req, res, next) {
        const { product } = req.query;

        try {
            // Procura todas as avaliações relacionadas ao produto usando o ID do produto
            const ratings = await Ratings.find({ ratingProduct: product });

            // Retorna as avaliações encontradas
            return res.status(200).json({ ratings });
        } catch (error) {
            // Trata erros, repassando para o middleware de erro
            next(error);
        }
    }

    // Show One
    async getRating(req, res, next) {
        const { product } = req.query;
        const { id } = req.params;

        try {
            const rating = await Ratings.findOne({ _id: id, ratingProduct: product });

            if (!rating) {
                return res.status(404).json({ message: "Sem avaliações!" });
            }

            return res.status(200).json({ rating });
        } catch (error) {
            next(error);
        }
    }

    // Save product

    async createRating(req, res, next) {
        const { ratingText, ratingScore } = req.body;
        const { productId } = req.params;
        const userId = req.auth._id;

        try {
            if (!userId) return res.status(400).json({ success: false, message: "Não tem autorização para avaliar" });

            // Verificar se o produto existe
            const product = await Products.findById(productId);
            if (!product) return res.status(400).json({ message: "Produto não existente", success: false });

            // Verificar se o cliente existe
            const customer = await Customers.findOne({ user: userId });
            if (!customer) return res.status(400).json({ success: false, message: "Não tem autorização para avaliar" });

            const orders = await Orders.find({ customer: customer._id, "cartPayd.productId": productId });

            // Verificar se o cliente comprou o produto
            if (orders.length <= 0) return res.status(400).json({ success: false, message: "Não tem autorização para avaliar" });

            // Criar uma nova avaliação
            const rating = new Ratings({ customer: customer._id, ratingText, ratingScore, ratingProduct: productId });

            // Adicionar a avaliação ao produto
            await product.productRatings.push(rating._id);
            await rating.save();
            await product.save();

            return res.status(200).json({ success: true, message: "Avaliação Criada!" });
        } catch (error) {
            next(error);
        }
    }

    // Update Rating
    async updateRating(req, res, next) {
        try {
        } catch (error) {
            next(error);
        }
    }

    // Middleware para deletar um comentário (rating)
    async PerpenteDelete(req, res, next) {
        try {
            // Busca o comentário pelo ID nos parâmetros da requisição
            const rating = await Ratings.findById(req.params.id);

            // Se o comentário não existe, retorna um erro
            if (!rating) {
                return res.status(400).json({ success: false, message: "Comentário não encontrado" });
            }

            // Busca o produto relacionado ao comentário
            const product = await Products.findById(rating.ratingProduct);

            // Se o produto existe, remove o ID do comentário da lista de avaliações do produto
            if (product) {
                product.productRatings = product.productRatings.filter((item) => item.toString() !== req.params.id.toString());
                await product.save();
            }

            // Deleta o comentário
            await rating.deleteOne();

            return res.status(200).json({ success: true, message: "Avalição apagada" });
        } catch (error) {
            next(error);
        }
    }

    async deleteRating(req, res, next) {
        const user = req.auth._id;
        console.log(req.params);
        try {
            // Busca o comentário pelo ID nos parâmetros da requisição
            const rating = await Ratings.findByIdAndUpdate(req.params.RatingId, { deleted: true, deletedAt: new Date(), deletedby: user }, { new: true });

            // Se o comentário não existe, retorna um erro
            if (!rating) {
                return res.status(400).json({ success: false, message: "Comentário não encontrado" });
            }

            return res.status(200).json({ success: true, message: "Avalição apagada" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RatingController();
