const router = require("express").Router();
const ProductController = require("../controllers/ProductController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const productValidation = require("../controllers/validations/productValidation");
const upload = require("../config/multer");
const { uploadFirebase } = require("../config/firebase");

//////////////////////////
//ADMIN
/////////////
router.put("/product/:id", auth.require, AdminValidator, upload.array("files"), productValidation.Update, uploadFirebase, ProductController.updateProduct);

router.post("/product", auth.require, AdminValidator, upload.array("files"), productValidation.Create, uploadFirebase, ProductController.createProduct);

router.put("/product/image/:id", auth.require, AdminValidator, productValidation.Image, upload.array("files"), uploadFirebase, ProductController.updateImage);

router.delete("/product/:id", auth.require, AdminValidator, productValidation.Delete, ProductController.deleteProduct);

router.get("/products/admin", auth.require, AdminValidator, productValidation.All, ProductController.getAllProductsAdmin);

router.get("/product/admin/:id", auth.require, AdminValidator, productValidation.getBtId, ProductController.showDetailsProductAdmin);

router.get("/brands/admin/", auth.require, AdminValidator, ProductController.showAllBrandsdmin);

router.post("/brands/admin/", auth.require, AdminValidator, ProductController.createBrand);

//////////////////////////
//Cliente
/////////////

router.get("/product/:id", auth.optional, productValidation.getBtId, ProductController.showDetailsProduct); //testado

// router.get("/products", productValidation.All, ProductController.getAllProducts);

router.get("/products", productValidation.All, ProductController.availiableProducts);

router.get("/products/search/", ProductController.searchProducts); // nao aprovado

//Ratings
router.get("/product/:id/ratings", productValidation.getBtId, ProductController.getRatingsProduct);

//Variations
router.get("/product/:id/variations", productValidation.getBtId, ProductController.getVariationsProduct);

module.exports = router;
