import {
    IDeliveryRepository,
    EnDeliveryStatus,
    IDelivery,
    IOrder,
    IOrderRepository,
    BaseError,
    IRegionalRepository,
    IProductRepository,
    ICreateDeliveryRequest
} from "../index.js";


export class CreateDeliveryService {
    constructor(
        private deliveryRepository: IDeliveryRepository,
        private orderRepository: IOrderRepository,
        private regionalRepository: IRegionalRepository,
        private productRepository: IProductRepository,
    ) { }

    async execute(data: ICreateDeliveryRequest, session?: any): Promise<IDelivery | null> {
        const address = data.address;
        if (!address) throw new BaseError("Address Not Found", 404);

        // Calcular peso e preço total
        let totalWeight = 0;
        let totalPrice = 0;
        for (const item of data.cartItems) {
            totalPrice += item.subtotal;
            const product = await this.productRepository.getProduct({ _id: item.productId });
            if (product && product.productWeight) {
                totalWeight += product.productWeight * item.quantity;
            }
        }

        // Inferir classe de veículo se não fornecida
        const vehicleClass = this.inferVehicleClass(totalWeight);

        let logistics = {
            baseFee: 0,
            tollFee: 0,
            weightFee: 0,
            totalShipping: 0
        };

        if (address.neighborhood) {
            logistics = await this.calculateLocalFreight(address.neighborhood.toString(), vehicleClass);
        } else if (address.terminal) {
            logistics = await this.calculateProvincialFreight(address.terminal.toString(), totalWeight);
        } else {
            throw new BaseError("O endereço deve conter um Bairro ou um Terminal de Transportadora", 400);
        }

        const delivery: Partial<IDelivery> = {
            status: EnDeliveryStatus.PENDING,
            order: data.orderId as any,
            customer: data.customerId as any,
            shippingAddress: {
                addressId: address._id as any,
                province: address.province,
                city: address.city,
                neighborhood: address.neighborhood,
                terminal: address.terminal,
                cellNumber: address.cellNumber,
                reference: address.reference,
                complete: address.complete,
                note: address.note,
            },
            logistics,
            trackingCode: this.generateTrackingCode(),
        };

        return await this.deliveryRepository.createDelivery(delivery, { session });
    }

    private inferVehicleClass(weight: number): 'motorcycle' | 'lightVehicle' | 'heavyVehicle' {
        if (weight <= 20) return 'motorcycle';
        if (weight <= 150) return 'lightVehicle';
        return 'heavyVehicle';
    }

    private async calculateLocalFreight(neighborhoodId: string, vehicleClass: string): Promise<any> {
        const neighborhood = await this.regionalRepository.getNeighborhood({ _id: neighborhoodId });
        if (!neighborhood) throw new BaseError("Bairro não encontrado", 404);

        const zone = await this.regionalRepository.getShippingZone({ _id: neighborhood.zone });
        const baseFee = zone ? zone.baseTax : 0;

        let tollFee = 0;
        if (neighborhood.tolls && neighborhood.tolls.length > 0) {
            for (const tollId of neighborhood.tolls) {
                const toll = await this.regionalRepository.getToll({ _id: tollId });
                if (toll && toll.prices) {
                    tollFee += (toll.prices as any)[vehicleClass] || 0;
                }
            }
        }

        return {
            baseFee,
            tollFee,
            weightFee: 0,
            totalShipping: baseFee + tollFee
        };
    }

    private async calculateProvincialFreight(terminalId: string, totalWeight: number): Promise<any> {
        const terminal = await this.regionalRepository.getCarrierTerminal({ _id: terminalId });
        if (!terminal) throw new BaseError("Terminal de transportadora não encontrado", 404);

        const baseFee = terminal.baseTax || 0;
        const weightFee = (terminal.pricePerKg || 0) * Math.ceil(totalWeight);

        return {
            baseFee,
            tollFee: 0,
            weightFee,
            totalShipping: baseFee + weightFee
        };
    }

    private generateTrackingCode(): string {
        const prefix = "PVD";
        const timestamp = Date.now().toString().slice(-4);
        const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${randomString}`;
    }
}