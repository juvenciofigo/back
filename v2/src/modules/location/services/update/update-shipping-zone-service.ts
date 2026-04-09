import { Request } from "express-jwt";
import { IRegionalRepository, IShippingZone } from "../../index.js";

export class UpdateShippingZoneService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<IShippingZone | null> {
        const { id } = req.params;
        const data = req.body;

        return await this.regionalRepository.updateShippingZone(id!, data);
    }
}
