require("../models/Carts");
const mongoose = require("../database/connection");
const Cart = mongoose.model("Cart");

class CartController {
    // async createCart(req, res,next) {
    //     const { user_id } = req.params;
    //     const bodyData = req.body;
    //     try {
    //         const createCart = await Cart.create({ ...bodyData, username: user_id });
    //         await createCart.populate("products").execPopulate();

    //         return res.status(200).json({ msg: "Produto Criado!" });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(400).json(error);
    //     }
    // }
    async createCart(req, res, next) {
        const { user_id } = req.params;
        const bodyData = req.body;
        try {
            const newCart = await Cart.create({ ...bodyData, username: user_id });
            const cartWithProducts = await Cart.findById(newCart._id).populate("itens");
            return res.status(200).json({ msg: "Produto Criado!", cart: cartWithProducts });
        } catch (error) {
            console.error(error);
            return res.status(400).json(error);
        }
    }

    // async addProtuctsCart(req, res,next) {
    //     const { user_id } = req.params;
    //     const bodyData = req.body;
    //     console.log("ola");
    //     try {
    //         const newCart = await Cart.create({ ...bodyData, user: nameuser_id });

    //         await this.createCart.populate("products").execPolulate();

    //         console.log(newCart);

    //         return res.status(200).json({ msg: "Produto Criado!" });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(400).json(error);
    //     }
    // }

    // // Show all
    // async listCarts(req, res,next) {
    //     try {
    //         const carts = await Cart.find();
    //         if (carts) {
    //             console.log(carts);
    //             return res.status(200).json({ quan: carts.length, carts });
    //         }
    //         throw new Error("error");
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // // Show One
    // async showDetailsCart(req, res,next) {
    //     const id = req.params.id;
    //     try {
    //         const cart = await Cart.findById({ _id: id });
    //         if (!cart) return res.status(404).json({ msg: "Produto não encontrado!" });
    //         else {
    //             return res.status(200).json(cart);
    //         }
    //     } catch (error) {
    //         console.log(error.messageFormat);
    //         return res.status(500).json({ id, error, msg: "Produto não encontrado!" });
    //     }
    // }

    // // Update cart
    // async updatecart(req, res,next) {
    //     try {
    //         const cart = await Cart.findByIdAndUpdate(
    //             { _id: req.params.id },
    //             {
    //                 $set: {
    //                     cartName: req.body.cartName,
    //                     cartDescription: req.body.cartDescription,
    //                     cartPrice: req.body.cartPrice,
    //                     cartQuantity: req.body.cartQuantity,
    //                     cartImage: req.body.cartImage,
    //                     categoria: req.body.categoria,
    //                 },
    //             },
    //             { new: true }
    //         );

    //         if (cart) {
    //             return res.status(200).json({ msg: "Produto atualizado!" });
    //         } else {
    //             return res.status(404).json({ msg: "Produto não encontrado!" });
    //         }
    //     } catch (error) {
    //         return res.status(500).json({ msg: "Erro ao atualizar o produto." });
    //     }
    // }

    // // Delete cart
    // async deletecCart(req, res,next) {
    //     try {
    //         const deleteCart = await Cart.findByIdAndDelete({ _id: req.params.id });
    //         if (deleteCart) {
    //             return res.status(200).json({ msg: "Produto Deletado!" });
    //         } else {
    //             return res.status(404).json({ msg: "Produto não encontrado!" });
    //         }
    //     } catch (error) {
    //         return res.status(500).json({ msg: "Erro ao deletar o produto." });
    //     }
    // }
}

module.exports = new CartController();
