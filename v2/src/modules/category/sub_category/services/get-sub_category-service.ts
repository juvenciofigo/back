import { BaseError, ISub_categoryRepository, ISub_category } from "../../index.js";

export class GetSub_categoryService {
    private sub_categoryRepository: ISub_categoryRepository;

    constructor(sub_categoryRepository: ISub_categoryRepository) {
        this.sub_categoryRepository = sub_categoryRepository;
    }

    async execute(sub_categoryId: string): Promise<ISub_category> {
        const sub_category = await this.sub_categoryRepository.getSub_category({ _id: sub_categoryId, availability: true });

        if (!sub_category) {
            throw new BaseError("Sub_category Not Found!", 404);
        }

        return sub_category;
    }
}
