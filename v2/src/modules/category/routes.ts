import { Router } from "express";
import {
    IsAuthValidator,
    IsAdminValidator,
    //
    createCategoryValidator,
    updateCategoryController,
    updateCategoryValidator,
    fetchCategoryValidator,
    createCategoryController,
    fetchCategoryController,
    getAvailableCategoriesController,
    //
    createSubCategoryController,
    fetchsubCategoryValidator,
    createSubCategoryValidator,
    updateSubCategoryValidator,
    fetchSubcategoriesByCategoryController,
    fetchSubcategoryController,
    updateSubCategoryController,
    //
    createSub_categoryValidator,
    createSub_categoryController,
    fetchSub_categoriesBySubCategoryController,
    fetchsub_categoriesValidator,
    fetchsub_categoryValidator,
    fetchSub_categoryController,
    updateSub_categoryValidator,
    updateSub_categoryController,
} from "./index.js";

const router = Router();

// Category
router.get("/categories", getAvailableCategoriesController); // 👌

router.get("/category/:categoryId", fetchCategoryValidator, fetchCategoryController);

router.post("/category", IsAuthValidator.require, IsAdminValidator, createCategoryValidator, createCategoryController); // 👌 criar nova categoria

router.put("/category/:categoryId", IsAuthValidator.require, IsAdminValidator, updateCategoryValidator, updateCategoryController); // 👌

// router.delete("/category/:id/", auth.require, AdminValidator, categoryValidation.removeCategory, CategoryController.removeCategory); //testado e aprovado

// router.get("/categories/unavailable", auth.require, AdminValidator, CategoryController.categoryUnavailable); //testado e aprovado

// router.get("/categories", auth.require, AdminValidator, CategoryController.getAllCategories); //testado e aprovado

// router.put("/category/:id/products", auth.require, AdminValidator, CategoryController.updateProduct);

// router.get("/category/:id/protucts", CategoryController.productCategory); // testado

// SubCategory

router.get("/subcategories/:categoryId/", fetchCategoryValidator, fetchSubcategoriesByCategoryController); // 👌

router.get("/subcategory/:subCategoryId/", fetchsubCategoryValidator, fetchSubcategoryController); // 👌

router.post("/subCategory", IsAuthValidator.require, IsAdminValidator, createSubCategoryValidator, createSubCategoryController); // 👌

router.put("/subcategory/:subCategoryId/:categoryId", IsAuthValidator.require, IsAdminValidator, updateSubCategoryValidator, updateSubCategoryController); // 👌

// Sub_category

router.get("/sub_categories/:subCategoryId/", fetchsub_categoriesValidator, fetchSub_categoriesBySubCategoryController); // 👌

router.get("/sub_category/:sub_categoryId/", fetchsub_categoryValidator, fetchSub_categoryController); // 👌

router.post("/sub_category", IsAuthValidator.require, IsAdminValidator, createSub_categoryValidator, createSub_categoryController); // 👌

router.put("/sub_category/:sub_categoryId/:subCategoryId", IsAuthValidator.require, IsAdminValidator, updateSub_categoryValidator, updateSub_categoryController); // 👌

export default router;
