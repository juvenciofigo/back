import { Request } from "express-jwt";
import { IRegionalRepository, IShippingZone } from "../../index.js";

export class DeleteShippingZoneService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<IShippingZone | null> {
        const { id } = req.params;

        return await this.regionalRepository.deleteShippingZone(id!);
    }
}
