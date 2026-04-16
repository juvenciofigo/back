import { ICartItem, IItemDetails, IItemVariation } from "../model/cart-interface-model.js";
import { calculateItemPrice } from "./calculateTotal.js";
import { IProduct, IProductRepository } from "src/modules/variation/index.js";

/**
 * Transforma um item do carrinho (populado) num snapshot para o pedido ou detalhe do carrinho.
 * @param item Item do carrinho populado (populado pelo CartRepository)
 */
export async function formatCartItemSnapshot(item: ICartItem, productRepository: IProductRepository): Promise<IItemDetails> {

    const product: IProduct | null = await productRepository.getProduct({ _id: item.productId });
    const variation = item.variation || {};

    if (!product) {
        throw new Error("Produto não encontrado!");
    }
    // 1. Calcular o preço do item usando o utilitário partilhado
    const itemPrice = calculateItemPrice(product, variation, item.deliveryEstimate);

    // 2. Extrair a estimativa de entrega (Snapshot)
    const estimates = product.deliveryEstimate as any;
    const deliveryEstimate = estimates?.id
        ? estimates.id(item.deliveryEstimate)
        : estimates?.find?.((d: any) => (d._id?.toString() || d.id?.toString()) === item.deliveryEstimate?.toString());

    // 3. Montar o objeto formatado (Snapshot)
    return {
        item: item.item,
        productId: product.id,
        productName: product.productName,
        variation: variation as IItemVariation,
        picture: product.productImage?.[0] || "",
        itemPrice: Number(itemPrice),
        deliveryEstimate: deliveryEstimate || null,
        quantity: Number(item.quantity) || 1,
        subtotal: Number(itemPrice * (item.quantity || 1)),
        totalWeight: Number(product.productWeight * (item.quantity || 1)),
        itemAvailability: product.productAvailability ?? true
    };
}
