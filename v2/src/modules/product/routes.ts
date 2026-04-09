import { Router } from "express";
import {
    createProductController,
    updateProductController,
    fetchProductsController,
    getProductController,
    searchProductsController,
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    searchProductsValidator,
    fetchProductsValidator,

    IsAuthValidator,
    IsAdminValidator,
    uploadMulter,
    fetchBrandsController,
    createBrandController,
    createBrandValidator,
    fetchBrandsValidator,
} from "./index.js";
const router = Router();

//////////////////////////
//ADMIN
/////////////

router.put("/product/:id", IsAuthValidator.require, IsAdminValidator, uploadMulter.array("files"), updateProductValidator, updateProductController);

router.post("/product", IsAuthValidator.require, IsAdminValidator, uploadMulter.array("files"), createProductValidator, createProductController);

router.get("/brands", fetchBrandsValidator, fetchBrandsController);

router.post("/brands", IsAuthValidator.require, IsAdminValidator, createBrandValidator, createBrandController);

//////////////////////////
//Cliente
/////////////

router.get("/product/:productId", getProductValidator, getProductController);

router.get("/products", fetchProductsValidator, fetchProductsController);

router.get("/products/search", searchProductsValidator, searchProductsController);

// //Ratings
// router.get("/product/:id/ratings", productValidation.getBtId, ProductController.getRatingsProduct);

// //Variations
// router.get("/product/:id/variations", productValidation.getBtId, ProductController.getVariationsProduct);

export default router;
