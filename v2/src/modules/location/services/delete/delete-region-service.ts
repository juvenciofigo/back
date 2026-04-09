import { Request } from "express-jwt";
import { IRegionalRepository, IRegion } from "../../index.js";

export class DeleteRegionService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<IRegion | null> {
        const { id } = req.params;

        return await this.regionalRepository.deleteRegion(id!);
    }
}
