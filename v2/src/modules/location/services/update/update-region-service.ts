import { Request } from "express-jwt";
import { IRegionalRepository, IRegion } from "../../index.js";

export class UpdateRegionService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<IRegion | null> {
        const { id } = req.params;
        const data = req.body;

        return await this.regionalRepository.updateRegion(id!, data);
    }
}
