const Products = require("../models/Products");
const Categories = require("../models/Categories");
const Ratings = require("../models/Ratings");
const Variations = require("../models/Variations");

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
            return {};
    }
};

class ProductController {
    // Save product

    async createProduct(req, res, next) {
        const { productName, productDescription, productPrice, productCategory, productPromotion, sku } = req.body;

        try {
            // Vericar se o SKU está a ser usado
            const existingSku = await Products.findOne({ sku });
            if (existingSku) return res.status(400).json({ errors: "SKU já em uso", success: false });

            // Cria uma nova instância do modelo Product com os dados fornecidos
            const product = new Products({
                productName,
                productDescription,
                productPrice,
                productCategory,
                productPromotion,
                sku,
            });

            // Encontra a categoria associada ao produto usando o ID da categoria fornecido
            const category = await Categories.findById(productCategory);
            if (!category) return res.status(400).json({ errors: "Cateroria não existente", success: false });

            // Adiciona o ID do novo produto à lista de produtos da categoria
            await category.products.push(product._id);

            // Salva o novo produto e a categoria associada no banco de dados
            await product.save();
            await category.save();

            // Retorna uma resposta de status 200 (OK) indicando que o produto foi criado com sucesso
            return res.status(200).json({ product, success: true, msg: "Produto Criado!" });
        } catch (error) {
            next(error);
        }
    }

    // Update product
    async updateProduct(req, res, next) {
        // Extrair dados do corpo da requisição
        const { productName, productDescription, productAvailability, productPrice, productStock, productCategory, productRatings, productPromotion, sku } = req.body;

        try {
            // Encontrar o produto pelo ID fornecido na requisição
            const product = await Products.findById(req.params.id);

            // Verificar se o produto foi encontrado
            if (!product) {
                return res.status(404).json({ msg: "Produto não encontrado!" });
            }

            // Atualizar as propriedades do produto com os valores fornecidos
            if (productStock) product.productStock = productStock;
            if (productDescription) product.productDescription = productDescription;
            if (productName) product.productName = productName;
            if (productPrice) product.productPrice = productPrice;
            if (productPromotion) product.productPromotion = productPromotion;
            if (productAvailability !== undefined) product.productAvailability = productAvailability;
            if (productRatings) product.productRatings = productRatings;
            if (sku) product.sku = sku;

            // Verificar se a categoria do produto está sendo alterada
            if (productCategory !== undefined && productCategory.toString() !== product.productCategory.toString()) {
                // Encontrar a categoria antiga do produto
                const oldCategory = Categories.findById(product.productCategory);
                // Encontrar a nova categoria do produto
                const newCategory = await Categories.findById(productCategory);

                // Verificar se ambas as categorias foram encontradas
                if (oldCategory && newCategory) {
                    // Remover o produto da categoria antiga
                    oldCategory.products = oldCategory.products.filter((item) => item !== product._id);
                    // Adicionar o produto à nova categoria
                    newCategory.products.push(product._id);
                    product.productCategory = productCategory;

                    // Salvar as alterações nas categorias
                    await oldCategory.save();
                    await newCategory.save();
                } else if (newCategory) {
                    // Adicionar o produto à nova categoria se apenas a nova categoria for encontrada
                    newCategory.products.push(product._id);
                    product.productCategory = productCategory;
                    await newCategory.save();
                }
            }

            // Salvar as alterações no banco de dados
            await product.save();

            // Responder com sucesso e os detalhes do produto
            return res.status(200).json({ success: true, product });
        } catch (error) {
            next(error);
        }
    }

    // Atualizar as imagens de um produto
    async updateImage(req, res, next) {
        try {
            // Encontrar o produto pelo ID fornecido na requisição
            const product = await Products.findById(req.params.id);

            // Verificar se o produto foi encontrado
            if (!product) {
                return res.status(404).json({ msg: "Produto não encontrado!" });
            }

            // Obter os nomes dos novos arquivos de imagem a partir dos arquivos enviados na requisição
            console.log(req.files);
            const newImages = req.files.map((item) => item.filename);

            // Filtrar imagens existentes (removendo valores nulos) e concatenar com as novas imagens
            product.productImage = product.productImage.filter((item) => item).concat(newImages);

            // Salvar as alterações no banco de dados
            await product.save();

            // Responder com sucesso e os detalhes do produto atualizado
            return res.status(200).json({ success: true, product });
        } catch (error) {
            next(error);
        }
    }

    // Delete product
    async deleteProduct(req, res, next) {
        try {
            // Buscar o produto pelo ID na requisição
            const product = await Products.findById(req.params.id);

            // Se o produto não existe, retornar um erro
            if (!product) {
                return res.status(404).json({ error: "Produto não encontrado", success: false });
            }

            // Buscar a categoria do produto
            const category = await Categories.findById(product.productCategory);

            // Se a categoria e seus produtos existirem
            if (category && category.products) {
                // Remover o ID do produto da lista de produtos da categoria
                category.products = category.products.filter((item) => item !== product._id);

                // Salvar a categoria atualizada no banco de dados
                await category.save();
            }

            // Deletar o produto
            await product.deleteOne();

            // Retornar uma resposta de sucesso
            return res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    }
    // Show all
    async getAllProducts(req, res, next) {
        // Opções de paginação e classificação
        const options = {
            page: Number(req.query.offset) || 1, // Página padrão 1 se offset não fornecido
            limit: Number(req.query.limit) || 30, // Limite padrão de 10 se limit não fornecido
            sort: getSort(req.query.sortType), // Função getSort para obter configuração de classificação
        };

        try {
            // Buscar todos os produtos paginados
            const products = await Products.paginate({}, options);

            // Retornar uma resposta com a quantidade de produtos e a lista de produtos
            return res.status(200).json({ quantity: products.totalDocs, products: products.docs });
        } catch (error) {
            next(error);
        }
    }

    async availiableProducts(req, res, next) {
        // Opções de paginação e classificação
        const options = {
            page: Number(req.query.offset) || 1, // Página padrão 1 se offset não fornecido
            limit: Number(req.query.limit) || 10, // Limite padrão de 10 se limit não fornecido
            sort: getSort(req.query.sortType), // Função getSort para obter configuração de classificação
        };

        try {
            // Buscar todos os produtos paginados
            const products = await Products.paginate({ productAvailability: true }, options);

            // Retornar uma resposta com a quantidade de produtos e a lista de produtos
            return res.status(200).json({ quantity: products.totalDocs, products: products.docs });
        } catch (error) {
            next(error);
        }
    }

    // Search
    async searchProducts(req, res, next) {
        // Opções de paginação e classificação
        const options = {
            page: Number(req.query.offset) || 0, // Página padrão 1 se offset não fornecido
            limit: Number(req.query.limit) || 30, // Limite padrão de 10 se limit não fornecido
            sort: getSort(req.query.sortType), // Função getSort para obter configuração de classificação
            populate: ["productCategory"],
        };

        try {
            // Cria uma expressão regular para a pesquisa, ignorando maiúsculas e minúsculas
            const search = new RegExp(req.params.search, "i");

            // Executa a consulta no banco de dados para buscar produtos
            const products = await Products.paginate(
                {
                    // Utiliza o operador $or para buscar em vários campos
                    $or: [
                        {
                            productName: { $regex: search }, // Procura por correspondências no nome do produto
                            productDescription: { $regex: search }, // Procura por correspondências na descrição do produto
                            sku: { $regex: search }, // Procura por correspondências no SKU do produto
                        },
                    ],
                },
                options
            );

            // Retorna a resposta com os produtos encontrados
            return res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    // Show One
    async showDetailsProduct(req, res, next) {
        try {
            // Busca o produto pelo ID, e popula as propriedades 'productVariations' e 'productRatings'
            const product = await Products.findById(req.params.id).populate(["productVariations", "productRatings"]);

            // Verifica se o produto foi encontrado
            if (!product) {
                // Retorna uma resposta 404 se o produto não for encontrado
                return res.status(404).json({ msg: "Produto não encontrado!" });
            }

            // Retorna uma resposta 200 com o produto encontrado e suas propriedades populadas
            return res.status(200).json({ product });
        } catch (error) {
            next(error);
        }
    }

    async getRatingsProduct(req, res, next) {
        try {
            const ratings = await Ratings.find({ ratingProduct: req.params.id });
            if (!ratings) {
                return res.status(400).json({ msg: "Nenhuma avaliaçã encotrada", success: false });
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
                return res.status(400).json({ msg: "Nenhuma variação encotrada", success: false });
            }
            if (variations.length > 0) {
                return res.status(200).json({ variations });
            } else {
                return res.status(200).json({variations, msg: "Não existem variações para esse produto!", success: true });
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();
