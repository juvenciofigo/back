import { Request } from "express-jwt";
import { IRegionalRepository, INeighborhood } from "../../index.js";

export class DeleteNeighborhoodService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<INeighborhood | null> {
        const { id } = req.params;

        return await this.regionalRepository.deleteNeighborhood(id!);
    }
}
