import { BaseError, MongooseSubCategoryRepository } from "../index.js";
interface Request {
    subCategoryId: string;
}

export class FetchSubCategoryService {
    private subCategoryRepository: MongooseSubCategoryRepository;

    constructor(subCategoryRepository: MongooseSubCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    async execute({ subCategoryId }: Request) {
        const subCategory = await this.subCategoryRepository.findSubCategoryById(subCategoryId);

        if (!subCategory) {
            throw new BaseError("SubCategory Not Found!", 404);
        }

        return { subCategory };
    }
}
