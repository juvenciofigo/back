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
    createbrandController,
    createBrandValidator,
} from "./index.js";
const router = Router();

//////////////////////////
//ADMIN
/////////////

router.put("/product/:id", IsAuthValidator.require, IsAdminValidator, uploadMulter.array("files"), updateProductValidator, updateProductController);

router.post("/product", IsAuthValidator.require, IsAdminValidator, uploadMulter.array("files"), createProductValidator, createProductController);

router.get("/products", fetchProductsValidator, fetchProductsController);


router.get("/product/:productId", getProductValidator, getProductController);

router.get("/brands", fetchBrandsController);

router.post("/brands", IsAuthValidator.require, IsAdminValidator, createBrandValidator, createbrandController);

//////////////////////////
//Cliente
/////////////

// router.get("/product/:id", auth.optional, productValidation.getBtId, ProductController.showDetailsProduct); //testado

// // router.get("/products", productValidation.All, ProductController.getAllProducts);

// router.get("/products", productValidation.All, ProductController.availiableProducts);

router.get("/products/search", searchProductsValidator, searchProductsController);

// //Ratings
// router.get("/product/:id/ratings", productValidation.getBtId, ProductController.getRatingsProduct);

// //Variations
// router.get("/product/:id/variations", productValidation.getBtId, ProductController.getVariationsProduct);

export default router;
