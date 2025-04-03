const { Category, SubCategory, Sub_category } = require("../models/Categories"),
    Variations = require("../models/Variations"),
    Customers = require("../models/Customers"),
    { Products } = require("../models/Products/Products"),
    Ratings = require("../models/Ratings"),
    Orders = require("../models/Orders"),
    { deleteFilesFirebase } = require("../config/firebase");

class ProductController {
    getSort = (sortType) => {
        switch (sortType) {
            case "alphabet_a-z":
                return { productName: 1 };
            case "alphabet_z-a":
                return { productName: -1 };
            case "price-ascending":
                return { productPrice: 1 };
            case "price-descending":
                return { productPrice: -1 };
            default:
                return { createdAt: -1 };
        }
    };
    dontSelect = "-productVendor -order_items -timesPurchased -totalRevenue -sales -acquisitionCost -additionalCosts";

    ratingStats(product) {
        return [1, 2, 3, 4, 5].map((score) => {
            // Ordenar as avaliações pelo valor da avaliação (ratingScore)
            const sortedRatings = product.productRatings.sort((a, b) => b.ratingScore - a.ratingScore);

            const ratings = sortedRatings.filter((rating) => rating.ratingScore === score);

            const count = ratings.length;

            const average = count > 0 ? ratings.reduce((sum, rating) => sum + rating.ratingScore, 0) / count : 0;

            const percentage = (count / product.productRatings.length) * 100;

            return {
                score,
                count,
                average,
                percentage,
            };
        });
    }

    calculateAverageRating(scores) {
        if (!scores || scores.length === 0) {
            return 0;
        }
        const sumScores = scores.reduce((total, rating) => total + rating.ratingScore, 0);
        const average = sumScores / scores.length;
        return average;
    }

    // ADMIN

    // Save product

    async createProduct(req, res, next) {
        const { sku, productCategory, productSubcategory, productSub_category } = req.body;

        try {
            const existingSku = await Products.findOne({ sku });

            if (existingSku) {
                return res.status(400).json({ message: "SKU já em uso", success: false });
            }

            const product = new Products({
                productImage: req.files,
                ...req.body,
            });

            // Verificar se todas as categorias existem
            const categoryPromises = productCategory.map((id) => Category.findById(id));
            const categories = await Promise.all(categoryPromises);

            if (categories.some((category) => !category)) {
                return res.status(400).json({ message: "Uma ou mais categorias não existem", success: false });
            }

            // Adicionar produto a cada categoria
            categories.forEach((category) => {
                category.products.push(product._id);
            });

            // SubCategories
            const subCategoryPromises = productSubcategory.map((id) => SubCategory.findById(id));
            const subCategories = await Promise.all(subCategoryPromises);

            if (subCategories.some((subCategory) => !subCategory)) {
                return res.status(400).json({ message: "Uma ou mais subCategorias não existem", success: false });
            }
            subCategories.forEach((subCategory) => {
                subCategory.products.push(product._id);
            });

            // Sub_categories

            const sub_categoryPromises = productSub_category.map((id) => Sub_category.findById(id));
            const sub_categories = await Promise.all(sub_categoryPromises);

            if (sub_categories.some((sub_category) => !sub_category)) {
                return res.status(400).json({ message: "Uma ou mais sub_categorias não existem", success: false });
            }

            sub_categories.forEach((sub_category) => {
                sub_category.products.push(product._id);
            });

            // saves
            await product.save();

            // Salvar categorias, subcategorias e sub_categorias
            await Promise.all([
                ...categories.map((category) => category.save()),
                ...subCategories.map((subCategory) => subCategory.save()),
                ...sub_categories.map((sub_category) => sub_category.save()),
            ]);

            return res.status(200).json({ product, success: true, message: "Produto Criado!" });
        } catch (error) {
            next(error);
        }
    }

    showDetailsProductAdmin = async (req, res, next) => {
        try {
            const product = await Products.findById(req.params.id).populate([
                { path: "productVariations" },
                {
                    path: "productRatings",
                    populate: [
                        { path: "customer", select: "firstName lastName email" },
                        { path: "deletedby", select: "firstName lastName email role" },
                    ],
                },
            ]);

            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado!" });
            }

            const pro = {
                ...product._doc,
                // productStatistc: {
                ratingAverage: this.calculateAverageRating(product.productRatings),
                ratingStats: this.ratingStats(product),
                // },
            };

            console.log(pro);

            return res.status(200).json({
                product: pro,
            });
        } catch (error) {
            next(error);
        }
    };

    // Update product
    async updateProduct(req, res, next) {
        var {
            productDescription,
            productAvailability,
            productPrice,
            productStock,
            productImage,
            productCategory,
            productSubcategory,
            productSub_category,
            productPromotion,
            sku,
            productVendor,
            productModel,
            productBrand,
            productWeight,
            productLength,
            productWidth,
            productHeight,
            productName,
            acquisitionCost,
            additionalCosts,
        } = req.body;

        try {
            const product = await Products.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado!" });
            }

            // Se productImage for undefined, inicializa como array vazio
            if (productImage === undefined) {
                productImage = [];
            }

            // Filtra as imagens removidas
            const removedImages = product.productImage.filter((image) => !productImage.includes(image));

            // Atualização das imagens
            if (removedImages.length > 0) {
                await deleteFilesFirebase(removedImages);
                product.productImage = productImage;
            }

            // Adiciona novas imagens enviadas
            if (Array.isArray(req.files) && req.files.length > 0) {
                product.productImage.push(...req.files);
            }

            // Atualizar as propriedades do produto com os valores fornecidos
            product.set({
                productName,
                productDescription,
                productAvailability,
                productPrice,
                productStock,
                productPromotion,
                productVendor,
                productModel,
                productBrand,
                productWeight,
                productLength,
                productWidth,
                productHeight,
                sku,
                acquisitionCost,
                additionalCosts,
            });

            // Atualizar as categorias do produto
            const updateCategories = async (categoryModel, productCategory, productField) => {
                if (productCategory && (!product[productField] || !arraysEqual(product[productField], productCategory))) {
                    // Remover produto das categorias antigas
                    if (product[productField] && product[productField].length > 0) {
                        await categoryModel.updateMany({ _id: { $in: product[productField] } }, { $pull: { products: product._id } });
                    }

                    // Adicionar produto às novas categorias
                    await categoryModel.updateMany({ _id: { $in: productCategory } }, { $push: { products: product._id } });

                    product[productField] = productCategory;
                }
            };

            const arraysEqual = (arr1, arr2) => {
                if (arr1.length !== arr2.length) return false;
                return arr1.every((item, index) => item.equals(arr2[index]));
            };

            await updateCategories(Category, productCategory, "productCategory");
            await updateCategories(SubCategory, productSubcategory, "productSubcategory");
            await updateCategories(Sub_category, productSub_category, "productSub_category");

            await product.save();

            return res.status(200).json({ success: true, message: "Produto actualizado", product });
        } catch (error) {
            next(error);
        }
    }

    // Atualizar as imagens de um produto
    async updateImage(req, res, next) {
        try {
            const productId = req.params.id;

            const product = await Products.findById(productId);

            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado!" });
            }

            // Verificar se há arquivos enviados na requisição
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "Nenhuma imagem enviada!" });
            }

            // Adicionar as novas imagens ao array existente
            product.productImage = [...product.productImage, ...req.files];

            await product.save();

            return res.status(200).json({ success: true, message: "Imagens adicionadas" });
        } catch (error) {
            next(error);
        }
    }
    // Delete product

    async deleteProduct(req, res, next) {
        try {
            const product = await Products.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado", success: false });
            }

            // Remover o produto das categorias e subcategorias associadas
            const removeFromCategory = async (categoryId, productId) => {
                if (categoryId) {
                    const category = await Category.findById(categoryId);
                    if (category && category.products) {
                        category.products = category.products.filter((item) => !item.equals(productId));
                        await category.save();
                    }
                }
            };

            await removeFromCategory(product.productCategory, product._id);
            await removeFromCategory(product.productSubcategory, product._id);
            await removeFromCategory(product.productSub_category, product._id);

            // Deletar o produto
            await product.deleteOne();

            return res.status(200).json({ success: true, message: "Produto apagado!" });
        } catch (error) {
            next(error);
        }
    }

    // Show all
    async getAllProductsAdmin(req, res, next) {
        // Opções de paginação e classificação
        const query = {};

        const options = {
            page: Number(req.query.offset) || 1,
            limit: Number(req.query.limit) || 30,
        };

        if (req.query.category) {
            query.productCategory = req.query.category;
        }
        if (req.query.subcategory) {
            query.productSubcategory = req.query.subcategory;
        }
        if (req.query.sub_category) {
            query.productSub_category = req.query.sub_category;
        }

        try {
            const products = await Products.paginate(query, options);
            return res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    ///

    // CLIENT

    ///

    availiableProducts = async (req, res, next) => {
        // Opções de paginação e classificação
        const query = { productAvailability: true };

        const options = {
            page: Number(req.query.offset) || 1,
            limit: 10,
            select: this.dontSelect,
        };

        if (req.query.category) {
            query.productCategory = req.query.category;
        }
        if (req.query.subcategory) {
            query.productSubcategory = req.query.subcategory;
        }
        if (req.query.sub_category) {
            query.productSub_category = req.query.sub_category;
        }

        try {
            const products = await Products.paginate(query, options);
            console.log(products);
            return res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    };

    searchProducts = async (req, res, next) => {
        const search = new RegExp(req.query.search, "i");
        const category = req.query.category;

        const options = {
            page: Number(req.query.offset) || 0,
            limit: Number(req.query.limit) || 3,
            sort: this.getSort(req.query.sortType),
            select: this.dontSelect,
            populate: ["productCategory"],
            productAvailability: true,
        };

        const query = {
            $or: [{ productName: { $regex: search } }, { productDescription: { $regex: search } }, { sku: { $regex: search } }, { tags: { $regex: search } }, { productBrand: { $regex: search } }],
        };

        if (category) query.productCategory = category;

        try {
            const products = await Products.paginate(query, options);

            return res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    };

    // Show One
    showDetailsProduct = async (req, res, next) => {
        const userId = req.auth ? req.auth._id : null;
        const productId = req.params.id;
        let canRate = false;

        try {
            const product = await Products.findById(productId)
                .select("-productVendor -order_items -timesPurchased -totalRevenue -sales -acquisitionCost -additionalCosts")
                .populate([
                    { path: "productVariations" },
                    {
                        path: "productRatings",
                        match: { deleted: false },
                        populate: {
                            path: "customer",
                            select: "firstName lastName email",
                        },
                    },
                ]);

            if (!product) {
                console.log(false);
                return res.status(404).json({ message: "Produto não encontrado!" });
            }

            if (userId) {
                const customer = await Customers.findOne({ user: userId });

                if (customer) {
                    const orders = await Orders.find({ customer: customer._id, "cartPayd.productId": productId });
                    console.log(orders);

                    if (orders.length > 0) {
                        canRate = true;
                    }
                }
            }

            return res.status(200).json({
                product: { ...product._doc, productStatistc: { ratingAverage: this.calculateAverageRating(product.productRatings), ratingStats: this.ratingStats(product) }, canRate },
            });
        } catch (error) {
            next(error);
        }
    };

    async getRatingsProduct(req, res, next) {
        try {
            const ratings = await Ratings.find({ ratingProduct: req.params.id });
            if (!ratings) {
                return res.status(400).json({ message: "Nenhuma avaliaçã encotrada", success: false });
            }
            return res.status(200).json({ ratings });
        } catch (error) {
            next(error);
        }
    }
    async getVariationsProduct(req, res, next) {
        try {
            const variations = await Variations.find({ variationProduct: req.params.id });
            if (!variations) {
                return res.status(400).json({ message: "Nenhuma variação encotrada", success: false });
            }
            if (variations.length > 0) {
                return res.status(200).json({ variations });
            } else {
                return res.status(200).json({ variations, message: "Não existem variações para esse produto!", success: true });
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();
