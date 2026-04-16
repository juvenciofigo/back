import { IDeliveryRepository, IDelivery, BaseError } from "../index.js";

export class UpdateDeliveryService {
    constructor(private deliveryRepository: IDeliveryRepository) { }

    async execute(deliveryId: string, data: Partial<IDelivery>): Promise<IDelivery | null> {
        // Verifica se a entrega existe
        const deliveryExists = await this.deliveryRepository.getDelivery({ _id: deliveryId }, {});

        if (!deliveryExists) {
            throw new BaseError("Entrega não encontrada para atualização", 404);
        }

        // Atualiza a entrega
        const updatedDelivery = await this.deliveryRepository.updateDelivery(deliveryId, data);

        if (!updatedDelivery) {
            throw new BaseError("Não foi possível atualizar a entrega", 500);
        }

        return updatedDelivery;
    }
}
