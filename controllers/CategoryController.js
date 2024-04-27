const { Category, SubCategory, Sub_category } = require("../models/Categories");
const Products = require("../models/Products");

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categories = await Category.find()
                .populate({
                    path: "subCategories",
                    populate: {
                        path: "sub_categories",
                        model: "Sub_category",
                    },
                })
                .exec();
            // Se não houver categorias, retornar um código 404 (Not Found)
            if (!categories || categories.length === 0) {
                return res.status(200).json({ categories: categories, message: "Nenhuma categoria encontrada." });
            }
            // Se houver categorias, enviá-las na resposta
            return res.json({ categories });
        } catch (error) {
            // Se ocorrer um erro durante a busca no banco de dados
            console.error("Erro ao obter todas as categorias:", error);

            // Verificar se é um erro de validação do Mongoose
            if (error.name === "ValidationError") {
                return res.status(400).json({ error: "Erro de validação. Certifique-se de que todos os campos são válidos." });
            }

            // Outros erros são tratados como erro interno do servidor (código 500)
            return res.status(500).json({ error: "Erro interno ao obter todas as categorias." });
        }
    }

    async categoryAvailable(req, res) {
        try {
            // const categories = await Category.find({ availability: true });

            const categories = await Category.find({ availability: true })
                .populate({
                    path: "subCategories",
                    populate: {
                        path: "sub_categories",
                        model: "Sub_category",
                    },
                })
                .exec();

            // Se não houver categorias disponíveis, retornar um código 404 (Not Found)
            if (!categories || categories.length === 0) {
                return res.status(200).json({ categories: categories, message: "Nenhuma categoria disponível encontrada." });
            }

            // Se houver categorias disponíveis, enviá-las na resposta
            return res.json({ categories });
        } catch (error) {
            // Se ocorrer um erro durante a busca no banco de dados
            console.error("Erro ao obter categorias disponíveis:", error);

            // Verificar se é um erro de validação do Mongoose
            if (error.name === "ValidationError") {
                return res.status(400).json({ error: "Erro de validação. Certifique-se de que todos os campos são válidos." });
            }

            // Outros erros são tratados como erro interno do servidor (código 500)
            return res.status(500).json({ error: "Erro interno ao obter categorias disponíveis." });
        }
    }

    async categoryUnavailable(req, res) {
        try {
            const categories = await Category.find({ availability: false });

            // Se não houver categorias disponíveis, retornar um código 404 (Not Found)
            if (!categories || categories.length === 0) {
                return res.status(200).json({ categories: categories, message: "Nenhuma categoria disponível encontrada." });
            }

            // Se houver categorias disponíveis, enviá-las na resposta
            return res.json({ categories });
        } catch (error) {
            // Se ocorrer um erro durante a busca no banco de dados
            console.error("Erro ao obter categorias disponíveis:", error);

            // Verificar se é um erro de validação do Mongoose
            if (error.name === "ValidationError") {
                return res.status(400).json({ error: "Erro de validação. Certifique-se de que todos os campos são válidos." });
            }

            // Outros erros são tratados como erro interno do servidor (código 500)
            return res.status(500).json({ error: "Erro interno ao obter categorias disponíveis." });
        }
    }

    async categoryDetails(req, res) {
        try {
            const category = await Category.findOne({ _id: req.params.id });

            // Se a categoria não for encontrada, retornar um código 404 (Not Found)
            if (!category) {
                return res.status(404).json({ error: "Categoria não encontrada." });
            }

            // Se a categoria for encontrada, enviá-la na resposta
            return res.json({ category });
        } catch (error) {
            // Se ocorrer um erro durante a busca no banco de dados
            console.error("Erro ao obter detalhes da categoria:", error);

            // Verificar se é um erro de validação do Mongoose
            if (error.name === "ValidationError") {
                return res.status(400).json({ error: "Erro de validação. Certifique-se de que todos os campos são válidos." });
            }

            // Outros erros são tratados como erro interno do servidor (código 500)
            return res.status(500).json({ error: "Erro interno ao obter detalhes da categoria." });
        }
    }

    async createCategory(req, res) {
        const { categoryName, code } = req.body;
        try {
            // Verificar se a categoria já existe com o mesmo nome
            const existingCategory = await Category.findOne({ categoryName: categoryName });

            if (existingCategory) {
                return res.status(400).json({ success: false, error: "Nome da categoria já em uso. Escolha outro." });
            }

            // Criar uma nova instância de Categories
            const category = new Category({
                categoryName,
                code: categoryName.toLowerCase(),
            });

            // Salvar a nova categoria no banco de dados
            await category.save();

            // Responder com a categoria criada
            return res.status(200).json({ success: true, category });
        } catch (error) {
            // Tratamento de erro mais detalhado
            console.error("Erro ao criar categoria:", error);

            // Verificar se é um erro de validação do Mongoose
            if (error.name === "ValidationError") {
                return res.status(400).json({ success: false, error: "Erro de validação. Certifique-se de que todos os campos são válidos." });
            }

            // Outros erros são tratados como erro interno do servidor (código 500)
            return res.status(500).json({ success: false, error: "Erro interno ao criar categoria." });
        }
    }

    async createSubCategories(req, res) {
        const { subCategoryName, categoryID } = req.body;

        try {
            // Verificar se o ID da categoria é fornecido
            if (!categoryID) {
                return res.status(400).json({ success: false, error: "ID da categoria não fornecido" });
            }

            // Encontrar a categoria correspondente no banco de dados
            const category = await Category.findById(categoryID).populate("subCategories");

            if (!category) {
                return res.status(400).json({ success: false, error: "Categoria não encontrada" });
            }

            // Verificar se o nome da subcategoria é fornecido
            if (!subCategoryName) {
                return res.status(400).json({ success: false, error: "Nome da subcategoria não fornecida" });
            }
            const existingSubCategory = category.subCategories.find((sub) => sub.subCategoryName.toLowerCase() === subCategoryName.toLowerCase());

            if (existingSubCategory) {
                return res.status(400).json({ success: false, error: "Nome da subCategoria já em uso. Escolha outro." });
            }

            // Criar uma nova instância de SubCategory
            const subCategory = new SubCategory({
                subCategoryName,
                category,
                code: subCategoryName.toLowerCase(),
            });

            // Adicionar a nova subcategoria à lista de subcategorias da categoria
            category.subCategories.push(subCategory);

            // Salvar a subcategoria e atualizar a categoria no banco de dados
            await subCategory.save();
            await category.save();

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Erro ao criar subcategoria:", error);
            return res.status(500).json({ success: false, error: "Erro interno ao criar subcategoria." });
        }
    }

    async createSub_categories(req, res) {
        const { sub_categoryName, subCategoryID } = req.body;

        try {
            // Verificar se o nome da subcategoria e o ID da subcategoria são fornecidos
            if (!sub_categoryName || !subCategoryID) {
                return res.status(400).json({ success: false, error: "Nome da subcategoria ou ID da subcategoria não fornecido" });
            }

            // Encontrar a subcategoria correspondente no banco de dados pelo ID
            const subCategory = await SubCategory.findById(subCategoryID).populate("sub_categories");
            if (!subCategory) {
                return res.status(400).json({ success: false, error: "Subcategoria não encontrada" });
            }

            // Verificar se o nome da subcategoria é fornecido
            if (!sub_categoryName) {
                return res.status(400).json({ success: false, error: "Nome da sub_categoria não fornecida" });
            }

            // Verificar se o nome da subcategoria já existe na lista de subcategorias da subcategoria
            const existingSub_category = subCategory.sub_categories.find((sub) => sub.sub_categoryName.toLowerCase() === sub_categoryName.toLowerCase());

            if (existingSub_category) {
                return res.status(400).json({ success: false, error: "Nome da sub_categoria já em uso. Escolha outro." });
            }

            // Criar uma nova instância de Sub_category
            const sub_category = new Sub_category({
                sub_categoryName,
                subCategory,
                code: sub_categoryName.toLowerCase(), // Pode ser útil criar um código único para a subcategoria, se necessário
            });

            // Adicionar a nova subcategoria à lista de subcategorias da subcategoria pai
            subCategory.sub_categories.push(sub_category._id);

            // Salvar a subcategoria e atualizar a subcategoria pai no banco de dados
            await sub_category.save();
            await subCategory.save();

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Erro ao criar subcategoria:", error);
            return res.status(500).json({ success: false, error: "Erro interno ao criar subcategoria." });
        }
    }

    async updateCategory(req, res) {
        const { categoryName, code, availability, products } = req.body;

        try {
            // Encontrar a categoria pelo ID
            const category = await Category.findById(req.params.id);

            if (!category) {
                // Se a categoria não for encontrada, retornar um erro 404
                return res.status(404).json({ error: "Categoria não encontrada." });
            }

            // Atualizar os campos da categoria, se fornecidos
            if (categoryName) category.categoryName = categoryName;
            if (code) category.code = code;
            if (availability !== undefined) category.availability = availability;
            if (products) category.products = products;

            // Salvar a categoria atualizada no banco de dados
            await category.save();

            // Responder com a categoria atualizada
            return res.status(200).json({ category, sucesses: true });
        } catch (error) {
            // Tratamento de erro mais detalhado
            console.error("Erro ao atualizar categoria:", error);

            // Verificar se é um erro de validação do Mongoose
            if (error.name === "ValidationError") {
                return res.status(400).json({ error: "Erro de validação. Certifique-se de que todos os campos são válidos." });
            }

            // Outros erros são tratados como erro interno do servidor (código 500)
            return res.status(500).json({ error: "Erro interno ao atualizar categoria." });
        }
    }

    async removeCategory(req, res) {
        try {
            // Encontrar a categoria pelo ID
            const category = await Category.findById(req.params.id);

            if (!category) {
                // Se a categoria não for encontrada, retornar um erro 404
                return res.status(404).json({ error: "Categoria não encontrada." });
            }

            // Remover a categoria
            await category.deleteOne();

            // Responder com um objeto indicando que a categoria foi deletada
            return res.status(200).json({ deleted: true });
        } catch (error) {
            // Tratamento de erro mais detalhado
            console.error("Erro ao remover categoria:", error);

            // Outros erros são tratados como erro interno do servidor (código 500)
            return res.status(500).json({ error: "Erro interno ao remover categoria." });
        }
    }

    // Produtos com base na categoria especificada
    async productCategory(req, res) {
        // Opções de paginação e classificação
        const options = {
            page: Number(req.query.offset) || 1, // Página padrão 1 se offset não fornecido
            limit: Number(req.query.limit) || 30, // Limite padrão de 30 se limit não fornecido
        };

        try {
            // Busca produtos paginados com base na categoria
            const products = await Products.paginate({ productCategory: req.params.id }, options);

            // Caso nenhum produto seja encontrado
            if (products.totalDocs === 0) {
                return res.status(404).json({ message: "Nenhum produto encontrado nesta categoria." });
            }

            // Retorna uma resposta com a lista de produtos
            return res.status(200).json({ products });
        } catch (error) {
            // Trata erros, se houver
            console.error(error);
            return res.status(500).json({ error: "Erro ao obter produtos da categoria." });
        }
    }

    async updateProduct(req, res, next) {
        const options = {
            page: Number(req.query.offset) || 1, // Página padrão 1 se offset não fornecido
            limit: Number(req.query.limit) || 30, // Limite padrão de 30 se limit não fornecido
        };

        try {
            const category = await Category.findById(req.params.id);

            const { products } = req.body;

            if (products) category.products = products;
            await category.save();

            let _products = await Products.find({
                $or: [
                    { productCategory: req.params.id },
                    {
                        _id: {
                            $in: products,
                        },
                    },
                ],
            });

            _products = await Promise.all(
                _products.map(async (product) => {
                    if (!products.includes(product._id.toString())) {
                        product.productCategory = null;
                    } else {
                        product.productCategory = req.params.id;
                    }
                    await product.save();
                    return product;
                })
            );

            const results = await Products.paginate({ productCategory: req.params.id }, options);
            res.status(200).json({ products: results });
            return;
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao atualizar produtos na categoria." });
            // next(error);
        }
    }
}

module.exports = new CategoryController();
