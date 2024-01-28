const Products = require("../../models/Products");
const Variations = require("../../models/Variations");

// Função para calcular o valor total do carrinho
const getCartValue = (cart) => {
    // Calcula o preço total e a quantidade total no carrinho
    const totalPrice = cart.reduce((total, item) => total + item.priceUnit * item.quantity, 0);
    const quantity = cart.reduce((total, item) => total + item.quantity, 0);
    return { totalPrice, quantity };
};

// Função para obter o valor total do carrinho a partir do banco de dados
const getStoreValue = async (cart) => {
    // Mapeia os itens do carrinho para calcular o preço total e a quantidade total
    const results = await Promise.all(
        cart.map(async (item) => {
            // Obtém informações do produto e da variação do banco de dados
            const product = await Products.findById(item.product);
            const variation = await Variations.findById(item.variation);

            // Verifica se o produto e a variação existem e se a variação pertence ao produto
            if (product && variation && product.variation.map((id) => id.toString()).includes(variation._id.toString())) {
                // Calcula o preço total e a quantidade para cada item
                const price = variation.promotion || variation.price;
                return { totalPrice: price * item.quantity, quantity: item.quantity };
            }

            // Se o produto ou a variação não existir ou a variação não pertencer ao produto, retorna 0
            return { totalPrice: 0, quantity: 0 };
        })
    );

    // Soma os resultados para obter o valor total do carrinho
    const totalPrice = results.reduce((total, item) => total + item.totalPrice, 0);
    const quantity = results.reduce((total, item) => total + item.quantity, 0);
    return { totalPrice, quantity };
};

// Função para validar se o valor total do carrinho corresponde ao valor total do banco de dados
async function CartValidation(cart) {
    // Obtém o valor total e a quantidade total do carrinho
    const { totalPrice: totalPriceCart, quantity: totalQuantityCart } = getCartValue(cart);
    
    // Obtém o valor total e a quantidade total do banco de dados
    const { totalPrice: totalPriceStore, quantity: totalQuantityStore } = await getStoreValue(cart);
    
    // Compara os valores do carrinho com os valores do banco de dados
    return totalPriceStore === totalPriceCart && totalQuantityStore === totalQuantityCart;
}

// Exporta a função de validação do carrinho
module.exports = CartValidation;
