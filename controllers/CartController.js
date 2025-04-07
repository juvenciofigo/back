const mongoose = require("mongoose"),
    Variations = require("../models/Variations"),
    Carts = require("../models/Carts"),
    { Products } = require("../models/Products/Products");

class CartController {
    async createCart(req, res, next) {
        const { user_id } = req.params;
        const bodyData = req.body;
        try {
            async function newCart(userId, bodyData) {
                const cart = new Carts({
                    cartUser: userId,
                    cartItens: bodyData,
                });
                return cart.save();
            }

            await newCart(user_id, bodyData);

            return res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    addProductsCart = async (req, res, next) => {
        const { userId } = req.params;
        const tempCart = req.body;

        try {
            let cart = await Carts.findOne({ cartUser: userId });

            if (!cart) {
                cart = new Carts({
                    cartUser: userId,
                    cartItens: [],
                });
                await cart.save();
            }

            // Função auxiliar para comparar dois itens de produto com variações e entrega
            function isSameItem(a, b) {
                return (
                    a.productId?.toString() === b.productId?.toString() &&
                    a.variation?.color === b.variation?.color &&
                    a.variation?.model === b.variation?.model &&
                    a.variation?.material === b.variation?.material &&
                    a.variation?.size === b.variation?.size &&
                    a.deliveryEstimate === b.deliveryEstimate
                );
            }

            if (Array.isArray(tempCart) && tempCart.length > 0) {
                for (const tempItem of tempCart) {
                    const existingProductIndex = cart.cartItens.findIndex((cartItem) => isSameItem(cartItem, tempItem));

                    if (existingProductIndex !== -1) {
                        cart.cartItens[existingProductIndex].quantity += Number(tempItem.quantity) || 1;
                    } else {
                        cart.cartItens.push({
                            productId: tempItem.productId,
                            quantity: Number(tempItem.quantity) || 1,
                            variation: {
                                color: tempItem.variation?.color,
                                model: tempItem.variation?.model,
                                size: tempItem.variation?.size,
                                material: tempItem.variation?.material,
                            },
                            deliveryEstimate: tempItem.deliveryEstimate,
                            item: new mongoose.Types.ObjectId(),
                        });
                    }
                }
            } else {
                const { productId, quantity, variation, deliveryEstimate } = req.body;

                const tempItem = {
                    productId,
                    variation,
                    deliveryEstimate,
                };

                const existingProductIndex = cart.cartItens.findIndex((item) => isSameItem(item, tempItem));

                if (existingProductIndex !== -1) {
                    cart.cartItens[existingProductIndex].quantity += Number(quantity) || 1;
                } else {
                    cart.cartItens.push({
                        productId,
                        quantity: Number(quantity) || 1,
                        variation: {
                            color: variation?.color,
                            model: variation?.model,
                            size: variation?.size,
                            material: variation?.material,
                        },
                        deliveryEstimate,
                        item: new mongoose.Types.ObjectId(),
                    });
                }
            }

            await cart.save();
            return res.status(200).json({ message: "Produto adicionado ao carrinho" });
        } catch (error) {
            next(error);
        }
    };

    async removeProductCart(req, res, next) {
        const { userId, item } = req.params;
        try {
            // Encontrar o carrinho do usuário
            let cart = await Carts.findOne({ cartUser: userId });

            if (!cart || cart === null) {
                return res.status(404).json({ message: "Carrinho não encontrado" });
            }
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
            const carts = await Carts.find();
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
        let products = [];
        let cart = {};
        let totalProductsPrice = 0;

        try {
            if (userId !== "false") {
                cart = await Carts.findOne({ cartUser: userId });

                if (!cart || cart === null || !cart.cartItens || cart.cartItens.length === 0) {
                    return res.status(200).json({ totalProducts: totalProductsPrice });
                }
                products = cart.cartItens;
            } else {
                products = req.body;
            }

            if (!Array.isArray(products) || products.length === 0) {
                return res.status(200).json({ totalProducts: totalProductsPrice });
            }

            for (const product of products) {
                const productDetails = await Products.findById(product.productId);

                if (!productDetails) continue; 

                const estimate = productDetails?.deliveryEstimate?.id(product.deliveryEstimate);
                const color = await Variations.findById(product.variation.color);
                const model = await Variations.findById(product.variation.model);
                const size = await Variations.findById(product.variation.size);
                const material = await Variations.findById(product.variation.material);

                let price = 0;

                if (estimate?.additionalCost) price += estimate?.additionalCost;
                if (color) price += color.variationPrice;
                if (model) price += model.variationPrice;
                if (material) price += material.variationPrice;
                if (size) price += size.variationPrice;

                let productPrice = productDetails.productPrice + price;
                let subtotal = productPrice * product.quantity;

                totalProductsPrice += subtotal;
            }

            return res.status(200).json({ totalProducts: totalProductsPrice });
        } catch (error) {
            next(error);
        }
    }

    // // Detalhes
    async showDetailsCart(req, res, next) {
        const { userId } = req.params;
        let products = [];
        let cartProducts = [];
        let cartId = "";

        try {
            if (userId !== "false") {
                const cart = await Carts.findOne({ cartUser: userId });

                if (!cart || cart === null || !cart.cartItens || cart.cartItens.length === 0) {
                    return res.status(200).json(cartProducts);
                }
                products = cart.cartItens;
                cartId = cart._id;
            } else {
                products = req.body;
            }
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(200).json(cartProducts);
            }

            for (const product of products) {
                const productDetails = await Products.findById(product.productId);
                if (!productDetails) {
                    console.log(`Produto não encontrado: ${product.productId}`);
                    continue;
                }

                const estimate = productDetails?.deliveryEstimate?.id(product.deliveryEstimate);

                const color = await Variations.findById(product.variation.color);
                const model = await Variations.findById(product.variation.model);
                const size = await Variations.findById(product.variation.size);
                const material = await Variations.findById(product.variation.material);

                let price = 0;

                if (estimate?.additionalCost) {
                    price += estimate?.additionalCost;
                }
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
                    picture: productDetails.productImage[0],
                    variation: {
                        color: color,
                        model: model,
                        size: size,
                        material: material,
                    },
                    estimate,
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
            const cart = await Carts.findByIdAndUpdate(
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

        try {
            // Encontrar o carrinho do usuário
            let cart = await Carts.findOne({ cartUser: userId });

            if (!cart || cart === null) {
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
    //         const deleteCart = await Carts.findByIdAndDelete({ _id: req.params.id });
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
