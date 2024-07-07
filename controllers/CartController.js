const mongoose = require("mongoose"),
    Variations = require("../models/Variations"),
    Cart = require("../models/Carts"),
    Product = require("../models/Products"),
    api = require("../config/index").api;

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
            async function newCart(userId, bodyData) {
                const cart = new Cart({
                    cartUser: userId,
                    cartItens: bodyData,
                });
                return cart.save();
            }

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
                async function newCart(userId, bodyData) {
                    const cart = new Cart({
                        cartUser: userId,
                        cartItens: bodyData,
                    });
                    return cart.save();
                }

                cart = await newCart(userId, req.body);
            }

            if (Array.isArray(req.body)) {
                for (const product of req.body) {
                    const existingProductIndex = cart.cartItens.findIndex((item) => {
                        if (item.productId == product.productId) {
                            if (item.variation.color == product.variation.color) {
                                if (item.variation.model == product.variation.model) {
                                    if (item.variation.material == product.variation.material) {
                                        return item.variation.size == product.variation.size;
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
                        cart.cartItens[existingProductIndex].quantity += Number(product.quantity) || 1;
                    } else {
                        cart.cartItens.push({
                            productId: product.productId,
                            quantity: Number(product.quantity) || 1,
                            variation: {
                                color: product.variation.color,
                                model: product.variation.model,
                                size: product.variation.size,
                                material: product.variation.material,
                            },
                            item: new mongoose.Types.ObjectId(),
                        });
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
                        productId,
                        quantity: Number(quantity) || 1,
                        variation: {
                            color: variation.color,
                            model: variation.model,
                            size: variation.size,
                            material: variation.material,
                        },
                        item: new mongoose.Types.ObjectId(),
                    });
                }
            }

            await cart.save();
            return res.status(200).json({ message: "Produto adicionado" });
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
            console.log(cart);
            // Filtrar os itens do carrinho para remover o produto
            const initialCartItemCount = cart.cartItens.length;

            cart.cartItens = cart.cartItens.filter((cartItem) => !cartItem.item.equals(item));

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

    // Show One prices
    async showDetailsCartPrices(req, res, next) {
        const { userId } = req.params;
        let Products = [];
        let cart = {};
        let totalProductsPrice = 0;

        try {
            if (userId !== "false") {
                cart = await Cart.findOne({ cartUser: userId });
                console.log(cart);

                if (!cart || !cart.cartItens || cart.cartItens.length === 0) {
                    console.log("Carrinho vazio ou não encontrado");
                    return res.status(200).json({ totalProducts: totalProductsPrice });
                }
                Products = cart.cartItens;
            } else {
                Products = req.body;
            }

            if (!Array.isArray(Products) || Products.length === 0) {
                console.log("Nenhum produto encontrado");
                return res.status(200).json({ totalProducts: totalProductsPrice });
            }

            for (const product of Products) {
                console.log(`Processando produto: ${product.productId}`);
                const productDetails = await Product.findById(product.productId);

                if (!productDetails) {
                    console.log(`Produto não encontrado: ${product.productId}`);
                    continue; // Pula este produto e continua com os outros
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

                let productPrice = productDetails.productPrice + price;
                let subtotal = productPrice * product.quantity;

                totalProductsPrice += subtotal;
            }

            console.log(totalProductsPrice);

            return res.status(200).json({ totalProducts: totalProductsPrice });
        } catch (error) {
            console.error("Erro ao processar o carrinho:", error);
            next(error);
        }
    }

    // // Detalhes
    async showDetailsCart(req, res, next) {
        const { userId } = req.params;
        let Products = [];
        let cartProducts = [];
        let cartId = "";

        try {
            if (userId !== "false") {
                const cart = await Cart.findOne({ cartUser: userId });

                if (!cart || !cart.cartItens || cart.cartItens.length === 0) {
                    return res.status(200).json(cartProducts);
                }
                Products = cart.cartItens;
                cartId = cart._id;
            } else {
                Products = req.body;
            }
            if (!Array.isArray(Products) || Products.length === 0) {
                return res.status(200).json(cartProducts);
            }

            for (const product of Products) {
                const productDetails = await Product.findById(product.productId);
                if (!productDetails) {
                    console.log(`Produto não encontrado: ${product.productId}`);
                    continue;
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
                let subtotal = productPrice * product.quantity;

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
                    subtotal: subtotal,
                });
            }

            const totalProductsPrice = cartProducts.reduce((total, product) => total + product.subtotal, 0);

            return res.status(200).json({ totalProducts: totalProductsPrice, items: cartProducts, cartId });
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
