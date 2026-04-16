import { IDeliveryRepository, BaseError } from "../index.js";

export class DeleteDeliveryService {
    constructor(private deliveryRepository: IDeliveryRepository) { }

    async execute(deliveryId: string): Promise<boolean> {
        const deliveryExists = await this.deliveryRepository.getDelivery({ _id: deliveryId }, {});

        if (!deliveryExists) {
            throw new BaseError("Entrega não encontrada para eliminação", 404);
        }

        const deleted = await this.deliveryRepository.deleteDelivery(deliveryId);

        if (!deleted) {
            throw new BaseError("Falha ao eliminar a entrega", 500);
        }

        return true;
    }
}
