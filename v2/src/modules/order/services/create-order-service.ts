import mongoose from "mongoose";
import {
    IOrderRepository,
    IOrder,
    ICustomerRepository,
    ICartRepository,
    ICustomer,
    IAddressRepository,
    IAddress,
    EnOrderStatus,
    IProductRepository,
    ICart,
    IItemDetails,
    BaseError,
    IDelivery,
    CreateDeliveryService
} from "../index.js";
import { formatCartItemSnapshot } from "../../cart/utils/cartItemSnapshot.js";

// Importando os modelos globais que ainda não possuem módulos em src/modules/
import Payments from "../../../../models/Payments.js";
import OrderRegistrations from "../../../../models/OrderRegistrations.js";

interface CreateOrderRequest {
    addressId: string;
    userId: string;
}

export class CreateOrderService {
    constructor(
        private orderRepository: IOrderRepository,
        private cartRepository: ICartRepository,
        private customerRepository: ICustomerRepository,
        private createDelivery: CreateDeliveryService,
        private addressRepository: IAddressRepository,
        private productRepository: IProductRepository,
    ) { }

    async execute({ addressId, userId }: CreateOrderRequest) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Verificar existência do carrinho (populado)
            const cart: ICart | null = await this.cartRepository.getCart({ cartUser: userId });

            if (!cart || cart.cartItens.length === 0) {
                throw new BaseError("Carrinho inválido ou vazio!", 400);
            }

            // 2. Verificar se cliente existe
            const customer: ICustomer | null = await this.customerRepository.getCustomer({ user: userId });
            if (!customer) {
                throw new BaseError("Perfil de cliente não encontrado!", 404);
            }

            // 3. Verificar se o endereço é válido
            const address: IAddress | null = await this.addressRepository.getAddress({ _id: addressId });
            if (!address) {
                throw new BaseError("Endereço não encontrado!", 404);
            }

            // 4. Processar itens do carrinho (Snapshot) 
            const cartItems: IItemDetails[] = await Promise.all(
                cart.cartItens.map(
                    async item => await formatCartItemSnapshot(item, this.productRepository)
                )
            );

            const totalProductsPrice = cartItems.reduce((total, p) => total + p.subtotal, 0);

            // 5. Gerar referência única
            const reference = await this.generateUniqueReference();

            // 6. Criar Encomenda (Order)
            const order = await this.orderRepository.createOrder({
                customer: customer._id,
                cart: cartItems,
                referenceOrder: reference,
                status: EnOrderStatus.PENDING,
            }, { session });

            if (!order) {
                throw new BaseError("Erro ao criar pedido!", 500);
            }

            // 7. Criar Entrega (Delivery) usando o serviço inteligente
            const delivery: IDelivery | null = await this.createDelivery.execute({
                cartItems,
                address,
                orderId: order.id,
                customerId: customer.id
            }, session);

            if (!delivery) {
                throw new BaseError("Erro ao criar entrega!", 500);
            }

            // 8. Criar Pagamento (Modelo Legado)
            const payment = new Payments({
                amount: totalProductsPrice + delivery.logistics.totalShipping,
                totalProductsPrice,
                reference,
                status: "Esperando",
                order: order._id
            });

            // 9. Registo do Histórico (Modelo Legado)
            const orderReg = new OrderRegistrations({
                order: order._id,
                orderStatus: order.status
            });

            // 10. Atualizar referências cruzadas na Encomenda
            await this.orderRepository.updateOrder(order.id, {
                delivery: delivery._id,
                payment: payment._id,
                orderRegistration: orderReg._id
            }, { session });

            // 11. Salvar documentos legados e limpar carrinho
            await payment.save({ session });
            await orderReg.save({ session });
            await this.cartRepository.clearCart(cart.id, { session });

            // Finalizar Transação
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

    private async generateUniqueReference(): Promise<string> {
        let reference: string = "";
        let exists = true;

        while (exists) {
            reference = this.createReferenceCode();
            // Aqui usamos findOne normal sem sessão pois a ordem ainda não foi comitada
            const order = await this.orderRepository.getOrder({ referenceOrder: reference });
            if (!order) exists = false;
        }

        return reference;
    }

    private createReferenceCode(): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const timestamp = Date.now().toString().slice(-4);
        const randomStr = Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
        return `ORD-${timestamp}-${randomStr}`;
    }
}
