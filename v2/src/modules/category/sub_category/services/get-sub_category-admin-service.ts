import { BaseError, Sub_categoryRepository, ISub_category } from "../../index.js";

export class GetSub_categoryAdminService {
    private sub_categoryRepository: Sub_categoryRepository;

    constructor(sub_categoryRepository: Sub_categoryRepository) {
        this.sub_categoryRepository = sub_categoryRepository;
    }

    async execute(sub_categoryId: string): Promise<ISub_category> {
        const sub_category = await this.sub_categoryRepository.getSub_category(sub_categoryId);

        if (!sub_category) {
            throw new BaseError("Sub_category Not Found!", 404);
        }

        return sub_category;
    }
}
