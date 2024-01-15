require("../models/Products");
const { json } = require("body-parser");
const mongoose = require("../database/connection");
const Product = mongoose.model("Product");

class ProductController {
    // Save product

    async createProduct(req, res) {
        try {
            const newProduct = await Product.create(req.body);
            console.log(newProduct);
            return res.status(200).json({ msg: "Produto Criado!" });
        } catch (error) {
            console.error(error);
            return res.status(400).json(error);
        }
    }

    // Show all
    async listProtucts(req, res) {
        try {
            const products = await Product.find();
            if (products) {
                console.log(products);
                return res.status(200).json({ quan: products.length, products });
            }
            throw new Error("error");
        } catch (error) {
            console.log(error);
        }
    }

    // Show One
    async showDetailsProduct(req, res) {
        const id = req.params.id;
        try {
            const product = await Product.findById({ _id: id });
            if (!product) return res.status(404).json({ msg: "Produto não encontrado!" });
            else {
                return res.status(200).json(product);
            }
        } catch (error) {
            console.log(error.messageFormat);
            return res.status(500).json({ id, error, msg: "Produto não encontrado!" });
        }
    }

    // Update product
    async updateproduct(req, res) {
        try {
            const product = await Product.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        productName: req.body.productName,
                        productDescription: req.body.productDescription,
                        productPrice: req.body.productPrice,
                        productQuantity: req.body.productQuantity,
                        productImage: req.body.productImage,
                        categoria: req.body.categoria,
                    },
                },
                { new: true }
            );

            if (product) {
                return res.status(200).json({ msg: "Produto atualizado!" });
            } else {
                return res.status(404).json({ msg: "Produto não encontrado!" });
            }
        } catch (error) {
            return res.status(500).json({ msg: "Erro ao atualizar o produto." });
        }
    }

    // Delete product
    async deletecProduct(req, res) {
        try {
            const deleteProduct = await Product.findByIdAndDelete({ _id: req.params.id });
            if (deleteProduct) {
                return res.status(200).json({ msg: "Produto Deletado!" });
            } else {
                return res.status(404).json({ msg: "Produto não encontrado!" });
            }
        } catch (error) {
            return res.status(500).json({ msg: "Erro ao deletar o produto." });
        }
    }
}

module.exports = new ProductController();
