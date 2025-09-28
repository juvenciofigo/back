import { BaseError, Sub_categoryRepository } from "../index.js";
interface Request {
    sub_categoryName: string;
    availability: boolean;
    products: [];
    subCategoryId: string;
    sub_categoryId: string;
}
export class UpdateSub_categoryService {
    private sub_categoryRepository: Sub_categoryRepository;

    constructor(sub_categoryRepository: Sub_categoryRepository) {
        this.sub_categoryRepository = sub_categoryRepository;
    }

    async execute({ sub_categoryName, availability, subCategoryId, sub_categoryId }: Request) {
        const existingSub_categoryName = await this.sub_categoryRepository.findSub_categoryByName(sub_categoryName);

        if (existingSub_categoryName && existingSub_categoryName.subCategory.toString() === subCategoryId) {
            throw new BaseError("Sub_category Name Already Exists on this Subcategory", 409);
        }

        const sub_category = await this.sub_categoryRepository.updateSub_category({ sub_categoryId, sub_categoryName, availability });

        if (!sub_category) {
            throw new BaseError("Sub_category Not Found!", 404);
        }

        return { sub_category };
    }
}
