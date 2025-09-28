import { BaseError, MongooseSub_categoryRepository } from "../index.js";
interface Request {
    sub_categoryId: string;
}

export class FetchSub_categoryService {
    private sub_categoryRepository: MongooseSub_categoryRepository;

    constructor(sub_categoryRepository: MongooseSub_categoryRepository) {
        this.sub_categoryRepository = sub_categoryRepository;
    }

    async execute({ sub_categoryId }: Request) {
        const sub_category = await this.sub_categoryRepository.findSub_categoryById(sub_categoryId);

        if (!sub_category) {
            throw new BaseError("Sub_category Not Found!", 404);
        }

        return { sub_category };
    }
}
