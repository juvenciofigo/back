import { Request } from "express";
import { IRegionalRepository, INeighborhood } from "../../index.js";

export class UpdateNeighborhoodService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<INeighborhood | null> {
        const { id } = req.params;
        const data = req.body;

        // Se o distrito foi enviado no body, trocamos para city para manter consistência no repo
        if (data.district) {
            data.city = data.district;
            delete data.district;
        }

        return await this.regionalRepository.updateNeighborhood(id!, data);
    }
}
