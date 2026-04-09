import { Request } from "express";
import { IRegionalRepository, ICarrierTerminal } from "../../index.js";

export class DeleteCarrierTerminalService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<ICarrierTerminal | null> {
        const { id } = req.params;

        return await this.regionalRepository.deleteCarrierTerminal(id!);
    }
}
