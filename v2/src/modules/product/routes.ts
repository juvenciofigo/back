import { Router } from "express";
import {
    createProductController,
    updateProductController,
    fetchProductsController,
    getProductController,
    getProductValidator,
    createProductValidator,
    // updateProductValidator,

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

router.put("/product/:id", IsAuthValidator.require, IsAdminValidator, uploadMulter.array("files"),  updateProductController);

// productCreateValidation,
router.post("/product", IsAuthValidator.require, IsAdminValidator, uploadMulter.array("files"), createProductValidator, createProductController);

router.get("/products", fetchProductsController);

// router.put("/product/image/:id", auth.require, AdminValidator, productValidation.Image, upload.array("files"), ProductController.updateImage);

// router.delete("/product/:id", auth.require, AdminValidator, productValidation.Delete, ProductController.deleteProduct);

router.get("/product/:productId", getProductValidator, getProductController);

router.get("/brands", fetchBrandsController);

router.post("/brands", IsAuthValidator.require, IsAdminValidator, createBrandValidator, createbrandController);

//////////////////////////
//Cliente
/////////////

// router.get("/product/:id", auth.optional, productValidation.getBtId, ProductController.showDetailsProduct); //testado

// // router.get("/products", productValidation.All, ProductController.getAllProducts);

// router.get("/products", productValidation.All, ProductController.availiableProducts);

// router.get("/products/search/", ProductController.searchProducts); // nao aprovado

// //Ratings
// router.get("/product/:id/ratings", productValidation.getBtId, ProductController.getRatingsProduct);

// //Variations
// router.get("/product/:id/variations", productValidation.getBtId, ProductController.getVariationsProduct);

export default router;
