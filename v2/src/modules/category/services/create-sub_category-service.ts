import { BaseError, Sub_categoryRepository, SubCategoryRepository } from "../index.js";
interface Request {
    sub_categoryName: string;
    subCategoryID: string;
}
export class CreateSub_CategoryService {
    private subCategoryRepository: SubCategoryRepository;
    private sub_categoryRepository: Sub_categoryRepository;

    constructor(subCategoryRepository: SubCategoryRepository, sub_categoryRepository: Sub_categoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
        this.sub_categoryRepository = sub_categoryRepository;
    }

    async execute({ sub_categoryName, subCategoryID }: Request) {
        const subCategory = await this.subCategoryRepository.findSubCategoryById(subCategoryID);

        if (!subCategory) {
            throw new BaseError("SubCategory Not Found!", 404);
        }

        const existingSub_category = subCategory.sub_categories.find((sub) => sub.sub_categoryName.toLowerCase() === sub_categoryName.toLowerCase());

        if (existingSub_category) {
            throw new BaseError(`Sub_category "${sub_categoryName}" Exists On This SubCategory !`, 409);
        }


        const sub_category = await this.sub_categoryRepository.createSub_categories(sub_categoryName, subCategoryID);

        return { message: "SubCategoria criada", sub_category };
    }
}
