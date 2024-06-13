require("../models/Carts");
const mongoose = require("../database/connection");
const Cart = mongoose.model("Cart");
const Product = mongoose.model("Product");
const api = require("../config/index").api;

async function newCart(userId, bodyData) {
    const cart = new Cart({
        cartItens: bodyData || [],
        cartUser: userId,
    });

    await cart.save();
    return cart;
}
class CartController {
    async createCart(req, res, next) {
        const { user_id } = req.params;
        const bodyData = req.body;

        try {
            const createCart = await newCart(user_id, bodyData);

            return res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    async addProductsCart(req, res, next) {
        const { userId } = req.params;
        try {
            let cart = await Cart.findOne({ cartUser: userId });

            if (!cart) {
                const newCart = await newCart(userId, bodyData);
                cart = newCart;
            }

            if (typeof req.body === "object" && Array.isArray(req.body)) {
                for (const product of req.body) {
                    const existingProductIndex = cart.cartItens.findIndex((item) => item.productId.equals(product.productId));

                    if (existingProductIndex !== -1) {
                        cart.cartItens[existingProductIndex].quantity += Number(product.quantity) || 1;
                    } else {
                        cart.cartItens.push({ productId: product.productId, quantity: Number(product.quantity) || 1 });
                    }
                }
            } else {
                const { productId, quantity } = req.body;

                const existingProductIndex = cart.cartItens.findIndex((item) => item.productId.equals(productId));

                if (existingProductIndex !== -1) {
                    cart.cartItens[existingProductIndex].quantity += Number(quantity) || 1;
                } else {
                    cart.cartItens.push({ productId, quantity: Number(quantity) || 1 });
                }
            }

            // Salvar as alterações no carrinho
            await cart.save();
            return res.status(200).json({ success: true, msg: "Produto adicionado" });
        } catch (error) {
            next(error);
        }
    }

    async removeProductCart(req, res, next) {
        const { userId, productId } = req.params;
        try {
            // Encontrar o carrinho do usuário
            let cart = await Cart.findOne({ cartUser: userId });

            if (!cart) {
                return res.status(404).json({ msg: "Carrinho não encontrado" });
            }

            // Filtrar os itens do carrinho para remover o produto
            const initialCartItemCount = cart.cartItens.length;
            cart.cartItens = cart.cartItens.filter((item) => !item.productId.equals(productId));

            // Verificar se algum item foi removido
            if (initialCartItemCount === cart.cartItens.length) {
                return res.status(404).json({ msg: "Produto não encontrado no carrinho" });
            }

            // Salvar as alterações no carrinho
            await cart.save();

            return res.status(200).json({ msg: "Produto removido do carrinho" });
        } catch (error) {
            next(error);
        }
    }

    // // Show all
    async allCarts(req, res, next) {
        try {
            const carts = await Cart.find();
            if (carts) {
                return res.status(200).json({ quan: carts.length, carts });
            }
            throw new Error("error");
        } catch (error) {
            next(error);
        }
    }

    // // Show One prices
    async showDetailsCartPrices(req, res, next) {
        const { userId } = req.params;
        try {
            let cart = await Cart.findOne({ cartUser: userId });
            if (!cart) {
                cart = await newCart(userId);
            }
            const Products = cart.cartItens;

            const Prices = [];
            for (const product of Products) {
                const productDetails = await Product.findById(product.productId);
                Prices.push(product.quantity * productDetails.productPrice);
            }

            return res.status(200).json(Prices);
        } catch (error) {
            next(error);
        }
    }
    // // Detalhes
    async showDetailsCart(req, res, next) {
        const { userId } = req.params;
        let Products = [];
        let cartProducts = [];

        try {
            if (userId !== "false") {
                const cart = await Cart.findOne({ cartUser: userId });
                if (!cart || !cart.cartItens || cart.cartItens.length === 0) {
                    return res.status(200).json(cartProducts);
                }
                Products = cart.cartItens;
            } else {
                Products = req.body;
            }

            if (!Array.isArray(Products) || Products.length === 0) {
                return res.status(200).json(cartProducts);
            }

            for (const product of Products) {
                const productDetails = await Product.findById(product.productId);
                if (!productDetails) {
                    throw new Error(`Product com ID ${product.productId} not found`);
                }
                cartProducts.push({
                    productId: productDetails._id,
                    productName: productDetails.productName,
                    productPrice: productDetails.productPrice,
                    picture: `${api}/public/images/${productDetails.productImage[0]}`,
                    quantity: Number(product.quantity),
                    subtotal: product.quantity * productDetails.productPrice,
                });
            }

            return res.status(200).json(cartProducts);
        } catch (error) {
            next(error);
        }
    }

    // Update cart
    async updatecart(req, res, next) {
        try {
            const cart = await Cart.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        cartName: req.body.cartName,
                        cartDescription: req.body.cartDescription,
                        cartPrice: req.body.cartPrice,
                        cartQuantity: req.body.cartQuantity,
                        cartImage: req.body.cartImage,
                        categoria: req.body.categoria,
                    },
                },
                { new: true }
            );

            if (cart) {
                return res.status(200).json({ msg: "Produto atualizado!" });
            } else {
                return res.status(404).json({ msg: "Produto não encontrado!" });
            }
        } catch (error) {
            next(error);
        }
    }

    // Update cart
    async updateQuantity(req, res, next) {
        const { userId, productId, quantity } = req.params;

        try {
            // Encontrar o carrinho do usuário
            let cart = await Cart.findOne({ cartUser: userId });

            if (!cart) {
                return res.status(404).json({ msg: "Carrinho não encontrado" });
            }
            const productIndex = cart.cartItens.findIndex((item) => item.productId.equals(productId));

            if (productIndex !== -1) {
                cart.cartItens[productIndex].quantity = Number(quantity);
            }
            await cart.save();
            return res.status(200).json({ msg: "Produto atualizado!" });
        } catch (error) {
            next(error);
        }
    }

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
    //                    next(error);
    //     }
    // }
}

module.exports = new CartController();
