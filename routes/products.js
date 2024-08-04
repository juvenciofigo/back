const router = require("express").Router();
const ProductController = require("../controllers/ProductController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const productValidation = require("../controllers/validations/productValidation");
const upload = require("../config/multer");
const uploadMultiple = require("../config/clodinary");

router.put("/product/:id", auth.require, AdminValidator, upload.array("files"), productValidation.Update, uploadMultiple, ProductController.updateProduct);

router.post("/product", auth.require, AdminValidator, upload.array("files"), productValidation.Create, uploadMultiple, ProductController.createProduct);

router.put("/product/image/:id", auth.require, AdminValidator, productValidation.Image, upload.array("files"), uploadMultiple, ProductController.updateImage);

router.delete("/product/:id", auth.require, AdminValidator, productValidation.Delete, ProductController.deleteProduct);

router.get("/products/admin", auth.require, AdminValidator, productValidation.All, ProductController.getAllProductsAdmin);

router.get("/product/admin/:id", auth.require, AdminValidator, productValidation.getBtId, ProductController.showDetailsProductAdmin);

//////////////////////////
//Cliente
/////////////

router.get("/product/:id", auth.optional, productValidation.getBtId, ProductController.showDetailsProduct); //testado

// router.get("/products", productValidation.All, ProductController.getAllProducts);

router.get("/products", productValidation.All, ProductController.availiableProducts);

router.get("/products/search/:search", ProductController.searchProducts); // nao aprovado

//Ratings
router.get("/product/:id/ratings", productValidation.getBtId, ProductController.getRatingsProduct);

//Variations
router.get("/product/:id/variations", productValidation.getBtId, ProductController.getVariationsProduct);

module.exports = router;
