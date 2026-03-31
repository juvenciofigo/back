import { beforeEach, describe, it } from "vitest";
import { MongooseCategoryRepository, CreateCategoryService } from "../../index.js";

let categoryRepository: MongooseCategoryRepository;
let category: CreateCategoryService;

describe("Create Category Service", () => {
    beforeEach(async () => {
        categoryRepository = new MongooseCategoryRepository();
        category = new CreateCategoryService(categoryRepository);
    });

    it("Create category", async () => {});
});
