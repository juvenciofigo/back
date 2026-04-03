import { BaseError, MongooseSub_categoryRepository, ISub_category } from "../../index.js";

export class GetSub_categoryService {
    private sub_categoryRepository: MongooseSub_categoryRepository;

    constructor(sub_categoryRepository: MongooseSub_categoryRepository) {
        this.sub_categoryRepository = sub_categoryRepository;
    }

    async execute(sub_categoryId: string): Promise<ISub_category> {
        const sub_category = await this.sub_categoryRepository.getSub_category(sub_categoryId);

        if (!sub_category || sub_category.availability === false) {
            throw new BaseError("Sub_category Not Found!", 404);
        }

        return sub_category;
    }
}
