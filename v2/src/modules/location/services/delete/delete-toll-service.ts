import { Request } from "express";
import { IRegionalRepository, IToll } from "../../index.js";

export class DeleteTollService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<IToll | null> {
        const { id } = req.params;

        return await this.regionalRepository.deleteToll(id!);
    }
}
