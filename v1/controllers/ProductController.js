const { Category, SubCategory, Sub_category } = require("../models/Categories"),
    ViewsProducts = require("../models/Products/ViewsProducts"),
    Variations = require("../models/Variations"),
    Customers = require("../models/Customers"),
    Users = require("../models/Users"),
    { Products, Brands } = require("../models/Products/Products"),
    { getLocationFromIP } = require("../helpers/geoLocation"),
    Ratings = require("../models/Ratings"),
    Orders = require("../models/Orders"),
    { deleteFilesFirebase } = require("../config/firebase");

// { $or: [{ deliveryEstimate: { $exists: false } }, { deliveryEstimate: { $not: { $type: "array" } } }] },

// async function migrateDeliveryEstimate() {
//     try {
//         const result = await Products.updateMany(
// {},
//             {
//                 $set: {
//                     productBrand: null
//                 },
//             }
//         );
//         console.log("Produtos atualizados:", result);
//         console.log("Produtos atualizados:", result.modifiedCount);
//     } catch (error) {
//         console.error("Erro ao migrar produtos:", error);
//     }
// }

// migrateDeliveryEstimate();

const UAParser = require("ua-parser-js");
const { uploadFirebase } = require("../config/firebase");

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

    trackProductView = async (req, userId = null, productId) => {
        // Admins não são contabilizados
        if (userId) {
            const user = await Users.findById(userId);
            if (user?.role.includes("admin")) return;
        }

        try {
            const ip = req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"].split(",")[0] : req.connection.remoteAddress;

            const userAgent = req.headers["user-agent"] || "unknown";
            const referrer = req.get("Referrer") || null;

            // Configuração do período do dia
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));

            // Detalhes do dispositivo
            const deviceInfo = this.detectarDispositivo(userAgent);

            // Buscar localização
            const locationInfo = await getLocationFromIP(ip);
            console.log(locationInfo);

            // Estrutura básica do guest
            const guestData = {
                ip,
                userAgent: deviceInfo,
                referrer,
                ...(locationInfo && { location: locationInfo }),
                ...(userId && { user: userId }),
            };

            // Verificar se já existe registro hoje
            let view = await ViewsProducts.findOne({
                product: productId,
                createdAt: { $gte: startOfDay, $lte: endOfDay },
            });

            if (view) {
                // Verificar se este usuário/guest já visualizou hoje
                const alreadyViewed = userId ? view.guests.some((g) => g.user?.equals(userId)) : view.guests.some((g) => g.ip === ip);

                if (!alreadyViewed) {
                    view.guests.push(guestData);
                    view.views += 1;
                    await view.save();
                }
            } else {
                // Criar novo registro
                await ViewsProducts.create({
                    product: productId,
                    guests: [guestData],
                    views: 1,
                });
            }
        } catch (error) {
            console.log(error);
            console.error("Erro ao rastrear visualização de produto:", error.message);
        }
    };

    // Função auxiliar para detectar dispositivo (mantida igual)
    detectarDispositivo(userAgentString) {
        const parser = new UAParser(userAgentString);
        const result = parser.getResult();

        return {
            navegador: result.browser.name,
            navegadorVersao: result.browser.version,
            sistemaOperacional: result.os.name,
            soVersao: result.os.version,
            tipoDispositivo: result.device.type || "desktop",
            fabricante: result.device.vendor || "Desconhecido",
            modelo: result.device.model || "Desconhecido",
        };
    }

    // ADMIN

    // New product
    async createProduct(req, res, next) {
        const { sku, productCategory, productSubcategory, productSub_category, productBrand } = req.body;

        try {
            const existingSku = await Products.findOne({ sku });

            if (existingSku) {
                return res.status(400).json({ message: "SKU já em uso", success: false });
            }

            const product = new Products({
                ...req.body,
            });

            // Verificar se todas as categorias existem
            let categories = [];
            if (productCategory) {
                const categoryPromises = productCategory.map((id) => Category.findById(id));
                
                categories = await Promise.all(categoryPromises);

                if (categories.some((category) => !category)) {
                    return res.status(400).json({ message: "Uma ou mais categorias não existem", success: false });
                }

                // Adicionar produto a cada categoria
                categories.forEach((category) => {
                    category.products.push(product._id);
                });
            }

            // SubCategories
            let subCategories = [];
            if (productSubcategory) {
                const subCategoryPromises = productSubcategory.map((id) => SubCategory.findById(id));
                subCategories = await Promise.all(subCategoryPromises);

                if (subCategories.some((subCategory) => !subCategory)) {
                    return res.status(400).json({ message: "Uma ou mais subCategorias não existem", success: false });
                }
                subCategories.forEach((subCategory) => {
                    subCategory.products.push(product._id);
                });
            }

            // Sub_categories
            let sub_categories = [];
            if (productSub_category) {
                const sub_categoryPromises = productSub_category.map((id) => Sub_category.findById(id));
                sub_categories = await Promise.all(sub_categoryPromises);

                if (sub_categories.some((sub_category) => !sub_category)) {
                    return res.status(400).json({ message: "Uma ou mais sub_categorias não existem", success: false });
                }

                sub_categories.forEach((sub_category) => {
                    sub_category.products.push(product._id);
                });
            }

            // saves

            // Salvar categorias, subcategorias e sub_categorias
            await Promise.all([
                ...categories.map((category) => category.save()),
                ...subCategories.map((subCategory) => subCategory.save()),
                ...sub_categories.map((sub_category) => sub_category.save()),
            ]);

            // --------- brand ----------
            const _brand = await Brands.findById(productBrand);

            if (_brand) {
                // Relacionar produto com a marca
                _brand.products.push(product._id);
                await _brand.save();

                // Atualizar a referência da marca no produto
                product.productBrand = _brand._id;
            }

            // Adiciona novas imagens
            if (Array.isArray(req.files) && req.files.length > 0) {
                await uploadFirebase(req);
                product.productImage = req.files;
            }

            await product.save();
            return res.status(200).json({ product, success: true, message: "Produto Criado!" });
        } catch (error) {
            next(error);
        }
    }

    showDetailsProductAdmin = async (req, res, next) => {
        try {
            const product = await Products.findById(req.params.id).populate([
                { path: "productVariations" },
                { path: "productBrand", select: "-products -createdAt -updatedAt" },
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

            const viewsProducts = await ViewsProducts.find({ product: "66a3f89ecedb89bc95e40ee1" }).populate([{ path: "guests" }]);
            const pro = {
                ...product._doc,
                viewsProducts,
                // productStatistc: {
                ratingAverage: this.calculateAverageRating(product.productRatings),
                ratingStats: this.ratingStats(product),
                // },
            };

            return res.status(200).json({
                product: pro,
            });
        } catch (error) {
            next(error);
        }
    };

    // Update product
    async updateProduct(req, res, next) {
        let {
            productSpecifications,
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
            additionalCost,
            deliveryEstimate,
        } = req.body;

        try {
            const product = await Products.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado!" });
            }

            if (productImage === undefined) {
                productImage = [];
            }

            // Filtrar e remover imagens do Firebase
            const removedImages = product.productImage.filter((image) => !productImage.includes(image));

            if (removedImages.length > 0) {
                await deleteFilesFirebase(removedImages);
                product.productImage = productImage;
            }

            const oldBrandId = product?.productBrand?.toString();

            if (oldBrandId && oldBrandId !== productBrand) {
                await Brands.findByIdAndUpdate(oldBrandId, {
                    $pull: { products: req.params.id },
                });
            }

            // Adiciona o produto à nova marca (sem duplicar)
            await Brands.findByIdAndUpdate(productBrand, {
                $addToSet: { products: req.params.id },
            });

            // Atualizar os dados do produto
            product.set({
                productName,
                productSpecifications,
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
                additionalCost,
                deliveryEstimate,
            });

            // Atualizar categorias e subcategorias
            const updateCategories = async (categoryModel, productCategory, productField) => {
                if (productCategory && (!product[productField] || !arraysEqual(product[productField], productCategory))) {
                    if (product[productField] && product[productField].length > 0) {
                        await categoryModel.updateMany({ _id: { $in: product[productField] } }, { $pull: { products: product._id } });
                    }

                    await categoryModel.updateMany({ _id: { $in: productCategory } }, { $addToSet: { products: product._id } });

                    product[productField] = productCategory;
                }
            };

            const arraysEqual = (arr1, arr2) => {
                if (arr1.length !== arr2.length) return false;
                return arr1.every((item, index) => item.toString() === arr2[index].toString());
            };

            // Adiciona novas imagens
            if (Array.isArray(req.files) && req.files.length > 0) {
                await uploadFirebase(req);
                product.productImage.push(...req.files);
            }

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

            await uploadFirebase(req);

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

    showAllBrandsdmin = async (req, res, next) => {
        try {
            const brands = await Brands.find();
            res.status(200).json({ brands });
        } catch (error) {
            next(error);
        }
    };

    createBrand = async (req, res, next) => {
        try {
            const { brand } = req.body;
            console.log();

            const exists = await Brands.findOne({ name: brand });

            if (exists) return res.status(400).json({ message: "Nome existente" });

            const newBrand = new Brands({ name: brand });
            await newBrand.save();

            const brands = await Brands.find();
            res.status(201).json({ brands, message: "Marca Criada!3" });
        } catch (error) {
            next(error);
        }
    };
    ///

    // CLIENT

    ///

    availiableProducts = async (req, res, next) => {
        // Opções de paginação e classificação
        const query = { productAvailability: true };

        const options = {
            page: Number(req.query.offset) || 1,
            limit: 30,
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
            limit: Number(req.query.limit) || 30,
            sort: this.getSort(req.query.sortType),
            select: this.dontSelect,
            populate: ["productCategory"],
            productAvailability: true,
        };

        const query = {
            $or: [{ productName: { $regex: search } }, { productDescription: { $regex: search } }, { sku: { $regex: search } }, { tags: { $regex: search } }],
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
                    { path: "productBrand" },
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
                return res.status(404).json({ message: "Produto não encontrado!" });
            }

            this.trackProductView(req, userId, productId);

            if (userId) {
                const customer = await Customers.findOne({ user: userId });

                if (customer) {
                    const orders = await Orders.find({ customer: customer._id, "cartPayd.productId": productId });

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
