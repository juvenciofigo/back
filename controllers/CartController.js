require("../models/Carts");
const { populate } = require("dotenv");
const mongoose = require("../database/connection");
const Variations = require("../models/Variations");
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
                const { productId, quantity, variation } = req.body;

                const existingProductIndex = cart.cartItens.findIndex((item) => {
                    if (item.productId == productId) {
                        if (item.variation.color == variation.color) {
                            if (item.variation.model == variation.model) {
                                if (item.variation.material == variation.material) {
                                    return item.variation.size == variation.size;
                                }
                                return false;
                            }
                            return false;
                        }
                        return false;
                    }
                    return false;
                });

                if (existingProductIndex !== -1) {
                    cart.cartItens[existingProductIndex].quantity += Number(quantity) || 1;
                } else {
                    cart.cartItens.push({
                        item: Date.now().toString(),
                        productId,
                        quantity: Number(quantity) || 1,
                        variation: {
                            color: variation.color,
                            model: variation.model,
                            size: variation.size,
                            material: variation.material,
                        },
                    });
                }
            }

            await cart.save();
            return res.status(200).json({ success: true, message: "Produto adicionado" });
        } catch (error) {
            next(error);
        }
    }

    async removeProductCart(req, res, next) {
        const { userId, item } = req.params;
        try {
            // Encontrar o carrinho do usuário
            let cart = await Cart.findOne({ cartUser: userId });

            if (!cart) {
                return res.status(404).json({ message: "Carrinho não encontrado" });
            }

            // Filtrar os itens do carrinho para remover o produto
            const initialCartItemCount = cart.cartItens.length;

            cart.cartItens = cart.cartItens.filter((item) => !item.item.equals(item));

            // Verificar se algum item foi removido
            if (initialCartItemCount === cart.cartItens.length) {
                return res.status(404).json({ message: "Produto não encontrado no carrinho" });
            }

            // Salvar as alterações no carrinho
            await cart.save();

            return res.status(200).json({ message: "Produto removido do carrinho" });
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
                const color = await Variations.findById(product.variation.color);
                const model = await Variations.findById(product.variation.model);
                const size = await Variations.findById(product.variation.size);
                const material = await Variations.findById(product.variation.material);

                let price = 0;
                if (color) {
                    price += color.variationPrice;
                }
                if (model) {
                    price += model.variationPrice;
                }
                if (material) {
                    price += material.variationPrice;
                }
                if (size) {
                    price += size.variationPrice;
                }
                let productPrice = (productDetails.productPrice += price);

                cartProducts.push({
                    item: product.item,
                    productId: productDetails._id,
                    productName: productDetails.productName,
                    picture: `${api}/public/images/${productDetails.productImage[0]}`,
                    variation: {
                        color: color,
                        model: model,
                        size: size,
                        material: material,
                    },
                    productPrice: productPrice,
                    quantity: Number(product.quantity),
                    subtotal: (productPrice *= Number(product.quantity)),
                });
                price = 0;
            }

            async function calculatePriceTotal(cart) {
                console.log(cart);
                return await cart.reduce((total, item) => total + item.subtotal, 0);
            }
            // console.log(calculatePriceTotal(cartProducts));
            return res.status(200).json({ totalProducts: calculatePriceTotal(cartProducts), cartProducts });
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
                return res.status(200).json({ message: "Produto atualizado!" });
            } else {
                return res.status(404).json({ message: "Produto não encontrado!" });
            }
        } catch (error) {
            next(error);
        }
    }

    // Update cart
    async updateQuantity(req, res, next) {
        const { userId, item, quantity } = req.params;
        console.log(item);

        try {
            // Encontrar o carrinho do usuário
            let cart = await Cart.findOne({ cartUser: userId });

            if (!cart) {
                return res.status(404).json({ message: "Carrinho não encontrado" });
            }
            const productIndex = cart.cartItens.findIndex((e) => e.item == item);

            if (productIndex !== -1) {
                cart.cartItens[productIndex].quantity = Number(quantity);
            }
            await cart.save();
            return res.status(200).json({ message: "Produto atualizado!" });
        } catch (error) {
            next(error);
        }
    }

    // // Delete cart
    // async deletecCart(req, res,next) {
    //     try {
    //         const deleteCart = await Cart.findByIdAndDelete({ _id: req.params.id });
    //         if (deleteCart) {
    //             return res.status(200).json({ message: "Produto Deletado!" });
    //         } else {
    //             return res.status(404).json({ message: "Produto não encontrado!" });
    //         }
    //     } catch (error) {
    //                    next(error);
    //     }
    // }
}

module.exports = new CartController();
