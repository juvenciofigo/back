import mongoose from "mongoose";
import { CartRepository, ICart, ProductRepository } from "../index.js";
import { Types } from "mongoose";

interface IVariation {
    color?: Types.ObjectId;
    model?: Types.ObjectId;
    size?: Types.ObjectId;
    material?: Types.ObjectId;
}

interface ICartItemInput {
    productId: Types.ObjectId;
    quantity: number;
    variation?: IVariation;
    deliveryEstimate?: Types.ObjectId;
}

interface AddProductToCartDTO {
    userId: string;
    tempCart?: ICartItemInput[];
    singleItem?: ICartItemInput; // caso não venha array, adiciona um único item
}

export class AddProductToCartService {
    private cartRepository: CartRepository;
    private productRepository: ProductRepository;

    constructor(cartRepository: CartRepository, productRepository: ProductRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    private isSameItem(a: ICartItemInput, b: ICartItemInput): boolean {
        return (
            a.productId?.toString() === b.productId?.toString() &&
            a.variation?.color?.toString() === b.variation?.color?.toString() &&
            a.variation?.model?.toString() === b.variation?.model?.toString() &&
            a.variation?.material?.toString() === b.variation?.material?.toString() &&
            a.variation?.size?.toString() === b.variation?.size?.toString() &&
            a.deliveryEstimate?.toString() === b.deliveryEstimate?.toString()
        );
    }

    async execute({ userId, tempCart, singleItem }: AddProductToCartDTO) {

        let cart: ICart | null = await this.cartRepository.fetchCartByUser(userId);

        // [Melhoria 2] Sistema de Recuperação Automática (Auto-Healing)
        if (!cart) {
            cart = await this.cartRepository.create(userId);
        }

        if (!cart) {
            throw new Error("Erro interno na criação automática do carrinho.");
        }

        let itemsToAdd: ICartItemInput[] = [];

        if (tempCart && tempCart.length > 0) {
            itemsToAdd = tempCart;
        } else if (singleItem) {
            itemsToAdd = [singleItem];
        }

        for (const item of itemsToAdd) {
            // [Melhoria 3] Validação de Presença de Produto Real na Loja
            const productExists = await this.productRepository.findProductById(item.productId.toString());
            if (!productExists) {
                // Se algum dos produtos da lista enviada num array não existir, lançamos erro aqui
                throw new Error(`Produto com ID ${item.productId} não foi encontrado na base de dados.`);
            }

            const existingProductIndex = cart!.cartItens.findIndex((cartItem) => this.isSameItem(cartItem, item));

            if (existingProductIndex !== -1) {
                cart!.cartItens[existingProductIndex].quantity += Number(item.quantity) || 1;
            } else {
                cart!.cartItens.push({
                    productId: item.productId,
                    quantity: Number(item.quantity) || 1,
                    variation: item.variation as IVariation,
                    deliveryEstimate: item.deliveryEstimate,
                    item: new mongoose.Types.ObjectId(),
                } as any);
            }
        }

        await cart!.save();
        return { message: "Produto(s) adicionado(s) ao carrinho" };
    }
}
