import { Router } from "express";

import {
    IsAuthValidator,
    IsAdminValidator,

    // Category
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    fetchCategoriesController,
    getCategoryController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    fetchCategoriesAdminController,
    getCategoryAdminController,

    // SubCategory
    createSubCategoryValidator,
    fetchSubCategoriesValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,

    createSubCategoryController,
    deleteSubCategoryController,
    fetchSubCategoriesAdminController,
    fetchSubCategoriesController,
    getSubCategoryAdminController,
    getSubCategoryController,
    updateSubCategoryController,

    // Sub_category
    getSub_categoryValidator,
    createSub_categoryValidator,
    updateSub_categoryValidator,
    fetchSub_categoryController,
    fetchSub_categoriesBySubCategoryController,
    fetchSub_categoriesValidator,
    getSub_categoryAdminController,
    createSub_categoryController,
    updateSub_categoryController,
    deleteSub_categoryController,
} from "./index.js";

const router = Router();

// Category
router.get("/categories", fetchCategoriesController);

router.get("/category/:categoryId", getCategoryValidator, getCategoryController);

router.get("/categories/admin", IsAuthValidator.require, IsAdminValidator, fetchCategoriesAdminController);

router.get("/category/:categoryId/admin", IsAuthValidator.require, IsAdminValidator, getCategoryValidator, getCategoryAdminController);

router.post("/category", IsAuthValidator.require, IsAdminValidator, createCategoryValidator, createCategoryController);

router.put("/category/:categoryId", IsAuthValidator.require, IsAdminValidator, updateCategoryValidator, updateCategoryController);

router.delete("/category/:categoryId", IsAuthValidator.require, IsAdminValidator, getCategoryValidator, deleteCategoryController);


// SubCategory
router.get("/subcategories/admin", IsAuthValidator.require, IsAdminValidator, fetchSubCategoriesValidator, fetchSubCategoriesAdminController);

router.get("/subcategories", fetchSubCategoriesValidator, fetchSubCategoriesController);

router.get("/subcategories/:subCategoryId/admin", IsAuthValidator.require, IsAdminValidator, getSubCategoryValidator, getSubCategoryAdminController);

router.get("/subcategories/:subCategoryId", getSubCategoryValidator, getSubCategoryController);

router.post("/subCategories", IsAuthValidator.require, IsAdminValidator, createSubCategoryValidator, createSubCategoryController);

router.delete("/subcategories/:subCategoryId", IsAuthValidator.require, IsAdminValidator, getSubCategoryValidator, deleteSubCategoryController);

router.put("/subcategories/:subCategoryId/:categoryId", IsAuthValidator.require, IsAdminValidator, updateSubCategoryValidator, updateSubCategoryController);


// Sub_category
router.get("/sub_category/:sub_categoryId/admin", IsAuthValidator.require, IsAdminValidator, getSub_categoryValidator, getSub_categoryAdminController);

router.get("/sub_category/:sub_categoryId/", getSub_categoryValidator, fetchSub_categoryController);

router.get("/sub_categories/:subCategoryId/", fetchSub_categoriesValidator, fetchSub_categoriesBySubCategoryController);

router.post("/sub_category", IsAuthValidator.require, IsAdminValidator, createSub_categoryValidator, createSub_categoryController);

router.put("/sub_category/:sub_categoryId/:subCategoryId", IsAuthValidator.require, IsAdminValidator, updateSub_categoryValidator, updateSub_categoryController);

router.delete("/sub_category/:sub_categoryId", IsAuthValidator.require, IsAdminValidator, getSub_categoryValidator, deleteSub_categoryController);

export default router;
