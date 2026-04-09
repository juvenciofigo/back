import mongoose, { ClientSession } from "mongoose";
import { IOrderRepository, IOrder } from "../index.js";
import { ICartRepository } from "../../cart/index.js";
import { IUserRepository } from "../../user/index.js";
import { formatCartItemSnapshot } from "../../cart/utils/cartItemSnapshot.js";

// Importando os modelos globais que ainda não possuem módulos em src/modules/
import Payments from "../../../../models/Payments.js";
import Deliveries from "../../../../models/Deliveries.js";
import OrderRegistrations from "../../../../models/OrderRegistrations.js";
import Customers from "../../../../models/Customers.js";

interface CreateOrderRequest {
    cartId: string;
    addressId: string;
    userId: string;
}

export class CreateOrderService {
    constructor(
        private orderRepository: IOrderRepository,
        private cartRepository: ICartRepository,
        private userRepository: IUserRepository
    ) { }

    async execute({ cartId, addressId, userId }: CreateOrderRequest) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Verificar existência do carrinho (populado)
            const cart = await this.cartRepository.fetchCartByUser(userId);

            if (!cart || cart.cartItens.length === 0 || cart._id?.toString() !== cartId) {
                throw new Error("Carrinho inválido ou vazio!");
            }

            // 2. Verificar se cliente existe
            const customer = await Customers.findOne({ user: userId }).session(session);
            if (!customer) {
                throw new Error("Perfil de cliente não encontrado!");
            }

            // 3. Gerar referência única
            const reference = await this.generateUniqueReference(session);

            // 4. Processar itens do carrinho (Snapshot) usando o utilitário partilhado
            const cartProducts = cart.cartItens.map(item => formatCartItemSnapshot(item));

            const totalProductsPrice = cartProducts.reduce((total, p) => total + p.subtotal, 0);

            // 5. Criar Pagamento
            const payment = new Payments({
                amount: totalProductsPrice, // + shippingPrice (v1 tem 0 por padrão)
                totalProductsPrice,
                reference,
                status: "Esperando"
            });

            // 6. Criar Entrega
            const delivery = new Deliveries({
                cost: 0,
                address: addressId
            });

            // 7. Criar Pedido
            const orderData: Partial<IOrder> = {
                customer: customer._id,
                cart: cartProducts,
                address: addressId,
                payment: payment._id,
                delivery: delivery._id,
                referenceOrder: reference,
                status: "Pendente",
                orderCancel: false,
                deleted: false
            };

            const order: IOrder | null = await this.orderRepository.createOrder(orderData);

            if (!order) {
                throw new Error("Erro ao criar pedido!");
            }

            // 8. Registo do Pedido
            const orderReg = new OrderRegistrations({
                order: order._id,
                orderStatus: order.status
            });

            payment.order = order.id;
            delivery.order = order.id;
            order.orderRegistration = orderReg._id;

            // 9. Salvar todos os documentos
            await order.save({ session });
            await payment.save({ session });
            await delivery.save({ session });
            await orderReg.save({ session });

            // 10. Limpar carrinho
            cart.cartItens = [];
            await cart.save({ session });

            await session.commitTransaction();

            return {
                id: order._id,
                reference: order.referenceOrder,
                status: order.status
            };

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    private async generateUniqueReference(session: ClientSession): Promise<string> {
        let reference: string = "";
        let exists = true;

        while (exists) {
            reference = this.createReferenceCode();
            const order = await this.orderRepository.getOrder({ referenceOrder: reference });
            if (!order) exists = false;
        }

        return reference;
    }

    private createReferenceCode(): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const timestamp = new Date().getTime().toString();
        const randomStr = Array.from({ length: 10 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");

        // v1 usa tamanho entre 6 e 20
        const size = Math.floor(Math.random() * (20 - 6 + 1)) + 6;
        return (timestamp + randomStr).slice(0, size);
    }
}
