import { BaseError, ISub_category, Sub_categoryRepository } from "../../index.js";

interface Request {
    sub_categoryName?: string;
    availability?: boolean;
    subCategoryId?: string;
    sub_categoryId: string;
}
export class UpdateSub_categoryService {
    private sub_categoryRepository: Sub_categoryRepository;

    constructor(sub_categoryRepository: Sub_categoryRepository) {
        this.sub_categoryRepository = sub_categoryRepository;
    }

    async execute({ sub_categoryName, availability, subCategoryId, sub_categoryId }: Request): Promise<ISub_category> {
        const update: Partial<ISub_category> = {};

        if (sub_categoryName) {
            const existingSub_categoryName = await this.sub_categoryRepository.findSub_categoryByName(sub_categoryName);

            if (
                existingSub_categoryName &&
                existingSub_categoryName.subCategory._id.toString() !== subCategoryId
            ) {
                throw new BaseError("Sub_category Name Already Exists on this Subcategory", 409);
            }


            update.sub_categoryName = sub_categoryName;
            update.code = sub_categoryName.toLowerCase().replace(/\s/g, "");

        }

        if (typeof availability === "boolean") {
            update.availability = availability;
        }

        if (Object.keys(update).length === 0) {
            throw new BaseError("Bad Request", 400);
        }

        const sub_category = await this.sub_categoryRepository.updateSub_category(sub_categoryId, update);

        if (!sub_category) {
            throw new BaseError("Sub_category Not Found!", 404);
        }

        return sub_category;
    }
}
