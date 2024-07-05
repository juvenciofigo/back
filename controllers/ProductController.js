const { Category, SubCategory, Sub_category } = require("../models/Categories"),
    Variations = require("../models/Variations"),
    Products = require("../models/Products"),
    Ratings = require("../models/Ratings"),
    Orders = require("../models/Orders"),
    api = require("../config/index").api;

const getSort = (sortType) => {
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

class ProductController {
    // ADMIN

    // Save product

    async createProduct(req, res, next) {
        const {
            productName,
            productDescription,
            productAvailability,
            productStock,
            productPrice,
            productCategory,
            productSub_category,
            productSubcategory,
            productPromotion,
            sku,
            productVendor,
            productModel,
            productSize,
            productBrand,
        } = req.body;

        try {
            const existingSku = await Products.findOne({ sku });

            if (existingSku) return res.status(400).json({ message: "SKU já em uso", success: false });

            const product = new Products({
                productName,
                productDescription,
                productAvailability,
                productPrice,
                productCategory,
                productSubcategory,
                productSub_category,
                productStock,
                productPromotion,
                sku,
                productVendor,
                productModel,
                productSize,
                productBrand,
            });

            const category = await Category.findById(productCategory);
            if (!category) return res.status(400).json({ message: "Cateroria não existente", success: false });
            category.products.push(product._id);

            await category.save();

            const subCategory = await SubCategory.findById(productSubcategory);
            if (!subCategory) return res.status(400).json({ message: "SubCategoria não existente", success: false });
            subCategory.products.push(product._id);
            await subCategory.save();

            const sub_category = await Sub_category.findById(productSub_category);
            if (!sub_category) return res.status(400).json({ message: "sub_categoria não existente", success: false });
            sub_category.products.push(product._id);
            await sub_category.save();

            await product.save();

            return res.status(200).json({ product, success: true, message: "Produto Criado!" });
        } catch (error) {
            next(error);
        }
    }

    async showDetailsProductAdmin(req, res, next) {
        try {
            const product = await Products.findById(req.params.id).populate(["productVariations", "productRatings"]);
            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado!" });
            }

            // Correção: utilize product.productImage em vez de apenas productImage
            const productImagesWithUrl = product.productImage.map((image) => `${api}/public/images/${image}`);
            return res.status(200).json({ product: { ...product._doc, productImage: productImagesWithUrl } });
        } catch (error) {
            next(error);
        }
    }

    // Update product
    async updateProduct(req, res, next) {
        const {
            productName,
            productDescription,
            productAvailability,
            productPrice,
            productStock,
            productPromotion,
            sku,
            productVendor,
            productModel,
            productSize,
            productBrand,
            productCategory,
            productSubcategory,
            productSub_category,
        } = req.body;

        try {
            const product = await Products.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado!" });
            }

            // Atualizar as propriedades do produto com os valores fornecidos
            product.set({
                productName,
                productDescription,
                productAvailability,
                productPrice,
                productStock,
                productPromotion,
                sku,
                productVendor,
                productModel,
                productSize,
                productBrand,
            });

            // Atualizar as categorias do produto
            const updateCategories = async (categoryModel, productCategory, productField) => {
                if (productCategory && (!product[productField] || !product[productField].every((cat) => productCategory.includes(cat)))) {
                    if (product[productField] && product[productField].length > 0) {
                        const oldCategories = await categoryModel.find({ _id: { $in: product[productField] } });
                        oldCategories.forEach(async (oldCategory) => {
                            oldCategory.products = oldCategory.products.filter((item) => !item.equals(product._id));
                            await oldCategory.save();
                        });
                    }

                    const newCategories = await categoryModel.find({ _id: { $in: productCategory } });
                    newCategories.forEach(async (newCategory) => {
                        newCategory.products.push(product);
                        await newCategory.save();
                    });

                    product[productField] = productCategory;
                }
            };

            await updateCategories(Category, productCategory, "productCategory");
            await updateCategories(SubCategory, productSubcategory, "productSubcategory");
            await updateCategories(Sub_category, productSub_category, "productSub_category");

            await product.save();

            return res.status(200).json({ success: true, product });
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

            // Obter os nomes dos novos arquivos de imagem a partir dos arquivos enviados na requisição
            const newImages = req.files.map((item) => item.filename);

            // Adicionar as novas imagens ao array existente
            product.productImage = [...product.productImage, ...newImages];

            await product.save();

            return res.status(200).json({ success: true, product });
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

            return res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    // Show all
    async getAllProductsAdmin(req, res, next) {
        // Opções de paginação e classificação
        const options = {
            page: Number(req.query.offset) || 1,
            limit: Number(req.query.limit) || 10,
            sort: getSort(req.query.sortType),
        };

        try {
            const products = await Products.paginate({}, options);

            const imagesWithUrl = products.docs.map((product) => {
                const imageUrls = product.productImage.map((image) => `${api}/public/images/${image}`);
                return { ...product._doc, productImage: imageUrls };
            });

            const response = {
                quantity: products.totalDocs,
                products: imagesWithUrl,
            };

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    ///

    // CLIENT

    ///

    async availiableProducts(req, res, next) {
        let query = {};
        const category = req.query.category;
        const subcategory = req.query.subcategory;
        const sub_category = req.query.sub_category;

        // Opções de paginação e classificação
        const options = {
            page: Number(req.query.offset) || 1,
            limit: Number(req.query.limit) || 10,
            sort: getSort(req.query.sortType),
        };

        if (category) {
            query.productCategory = category;
        }

        if (subcategory) {
            query.productSubcategory = subcategory;
        }

        if (sub_category) {
            query.productSub_category = sub_category;
        }

        try {
            const products = await Products.paginate({ productAvailability: true }, { ...query, ...options, select: "-productVendor -order_items -timesPurchased -totalRevenue -sales" });

            const imagesWithUrl = products.docs.map((product) => {
                const imageUrls = product.productImage.map((image) => `${api}/public/images/${image}`);
                return { ...product._doc, productImage: imageUrls };
            });

            const response = {
                quantity: products.totalDocs,
                products: imagesWithUrl,
            };
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getAllProducts(req, res, next) {
        let query = {};
        const category = req.query.category;
        const subcategory = req.query.subcategory;
        const sub_category = req.query.sub_category;

        // Opções de paginação e classificação
        const options = {
            page: Number(req.query.offset) || 1,
            limit: Number(req.query.limit) || 10,
            sort: getSort(req.query.sortType),
        };

        if (category) {
            query.productCategory = category;
        }

        if (subcategory) {
            query.productSubcategory = subcategory;
        }

        if (sub_category) {
            query.productSub_category = sub_category;
        }

        try {
            const products = await Products.paginate(query, options);

            const imagesWithUrl = products.docs.map((product) => {
                const imageUrls = product.productImage.map((image) => `${api}/public/images/${image}`);
                return { ...product._doc, productImage: imageUrls };
            });

            const response = {
                quantity: products.totalDocs,
                products: imagesWithUrl,
            };

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    // Search
    async searchProducts(req, res, next) {
        // Opções de paginação e classificação
        const options = {
            page: Number(req.query.offset) || 0,
            limit: Number(req.query.limit) || 30,
            sort: getSort(req.query.sortType),
            populate: ["productCategory"],
        };

        try {
            // Cria uma expressão regular para a pesquisa, ignorando maiúsculas e minúsculas
            const search = new RegExp(req.params.search, "i");

            const products = await Products.paginate(
                {
                    // Utiliza o operador $or para buscar em vários campos
                    $or: [
                        {
                            productName: { $regex: search },
                            productDescription: { $regex: search },
                            sku: { $regex: search },
                        },
                    ],
                },
                options
            );

            return res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    // Show One
    async showDetailsProduct(req, res, next) {
        try {
            const product = await Products.findById(req.params.id).select("-productVendor -order_items -timesPurchased -totalRevenue -sales ").populate(["productVariations", "productRatings"]);

            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado!" });
            }

            const productImagesWithUrl = product.productImage.map((image) => `${api}/public/images/${image}`);

            return res.status(200).json({ product: { ...product._doc, productImage: productImagesWithUrl } });
        } catch (error) {
            next(error);
        }
    }

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
