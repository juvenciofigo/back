const Products = require("../models/Products");
const Ratings = require("../models/Ratings");

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
                return res.status(404).json({ msg: "Sem avaliações!" });
            }

            return res.status(200).json({ rating });
        } catch (error) {
            next(error);
        }
    }

    // Save product

    async createRating(req, res, next) {
        const { ratingName, ratingText, ratingScore } = req.body;
        const { product } = req.query;

        try {
            // Cria uma nova instância do modelo Ratings com os dados fornecidos
            const rating = new Ratings({ ratingName, ratingText, ratingScore, ratingProduct: product });

            const _product = await Products.findById(product);

            if (!_product) return res.status(400).json({ message: "Produto não existente", success: false });

            // Adiciona o ID do novo produto à lista de produtos da categoria
            await _product.productRatings.push(rating._id);

            // Salva o novo produto e a categoria associada no banco de dados
            await _product.save();
            await rating.save();
            return res.status(200).json({ rating, success: true, msg: "Avaliação Criada!" });
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
    async deleteRating(req, res, next) {
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

            return res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RatingController();
