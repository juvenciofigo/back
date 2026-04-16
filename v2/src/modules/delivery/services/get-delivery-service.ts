import {
    IDeliveryRepository,
    IDelivery,
    BaseError,
} from "../index.js";


export class GetDeliveryService {


    constructor(
        private deliveryRepository: IDeliveryRepository,
    ) {

    }

    async execute(deliveryId: string): Promise<IDelivery | null> {
        const delivery = await this.deliveryRepository.getDelivery({ _id: deliveryId }, {})
        if (!delivery) {
            throw new BaseError("Entrega não encontrada", 404);
        }
        return delivery
    }
}